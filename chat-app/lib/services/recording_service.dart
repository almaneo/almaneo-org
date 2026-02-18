import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:record/record.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Meetup recording service — record audio + upload to Supabase Storage
///
/// Uses `record` package for AAC recording, stores files in
/// Supabase Storage `meetup-recordings` bucket, metadata in `meetup_recordings` table.
class RecordingService {
  static SupabaseClient get _db => Supabase.instance.client;

  static AudioRecorder? _recorder;
  static AudioRecorder get _rec {
    _recorder ??= AudioRecorder();
    return _recorder!;
  }

  static Timer? _durationTimer;
  static DateTime? _recordingStartTime;
  static String? _currentMeetupId;
  static String? _currentFilePath;
  static bool _isStopping = false;

  /// Callback invoked when auto-stop fires (max duration reached).
  /// Set this from the UI to update state.
  static VoidCallback? onAutoStop;

  /// Max recording duration: 2 hours
  static const int maxDurationSeconds = 7200;

  // ---------------------------------------------------------------------------
  // Permission
  // ---------------------------------------------------------------------------

  /// Check if microphone permission is granted
  static Future<bool> hasPermission() async {
    return _rec.hasPermission();
  }

  // ---------------------------------------------------------------------------
  // Recording
  // ---------------------------------------------------------------------------

  /// Start recording audio for a meetup
  ///
  /// Returns the local file path, or null on failure.
  static Future<String?> startRecording(String meetupId) async {
    try {
      final hasPerms = await hasPermission();
      if (!hasPerms) {
        debugPrint('[Recording] Permission denied');
        return null;
      }

      // Build local file path
      final dir = await getTemporaryDirectory();
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final filePath = '${dir.path}/meetup_recording_${meetupId}_$timestamp.m4a';

      // Configure & start
      await _rec.start(
        const RecordConfig(
          encoder: AudioEncoder.aacLc,
          bitRate: 128000,
          sampleRate: 44100,
          numChannels: 1,
        ),
        path: filePath,
      );

      _currentMeetupId = meetupId;
      _currentFilePath = filePath;
      _recordingStartTime = DateTime.now();
      _isStopping = false;

      // Auto-stop after max duration
      _durationTimer?.cancel();
      _durationTimer = Timer(
        const Duration(seconds: maxDurationSeconds),
        () async {
          debugPrint('[Recording] Max duration reached, auto-stopping');
          await stopRecording();
          onAutoStop?.call();
        },
      );

      debugPrint('[Recording] Started: $filePath');
      return filePath;
    } catch (e) {
      debugPrint('[Recording] startRecording error: $e');
      return null;
    }
  }

  /// Stop recording and return local file path + duration
  ///
  /// Returns `{path, durationSeconds}` or null on failure.
  /// Guarded against concurrent calls.
  static Future<Map<String, dynamic>?> stopRecording() async {
    if (_isStopping) return null;
    _isStopping = true;

    try {
      _durationTimer?.cancel();
      _durationTimer = null;

      final path = await _rec.stop();
      if (path == null) {
        debugPrint('[Recording] stop returned null path');
        return null;
      }

      final durationSeconds = _recordingStartTime != null
          ? DateTime.now().difference(_recordingStartTime!).inSeconds
          : 0;

      final result = {
        'path': path,
        'durationSeconds': durationSeconds,
        'meetupId': _currentMeetupId,
      };

      _recordingStartTime = null;
      _currentMeetupId = null;
      _currentFilePath = null;

      debugPrint('[Recording] Stopped: $path (${durationSeconds}s)');
      return result;
    } catch (e) {
      debugPrint('[Recording] stopRecording error: $e');
      return null;
    } finally {
      _isStopping = false;
    }
  }

  /// Whether the recorder is currently recording
  static Future<bool> isRecording() async {
    return _rec.isRecording();
  }

  /// Get elapsed seconds since recording started
  static int getElapsedSeconds() {
    if (_recordingStartTime == null) return 0;
    return DateTime.now().difference(_recordingStartTime!).inSeconds;
  }

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------

  /// Upload a local recording file to Supabase Storage and create DB record
  ///
  /// Returns the public URL on success, null on failure.
  static Future<String?> uploadRecording({
    required String meetupId,
    required String recorderId,
    required String localFilePath,
    required int durationSeconds,
  }) async {
    String? recordId;
    try {
      final file = File(localFilePath);
      if (!file.existsSync()) {
        debugPrint('[Recording] File not found: $localFilePath');
        return null;
      }

      final fileSize = await file.length();
      final fileName = localFilePath.split('/').last;
      final storagePath = 'recordings/$meetupId/$fileName';

      // Create DB record first (status: uploading)
      final insertResult = await _db.from('meetup_recordings').insert({
        'meetup_id': meetupId,
        'recorder_id': recorderId,
        'storage_path': storagePath,
        'duration_seconds': durationSeconds,
        'file_size_bytes': fileSize,
        'format': 'aac',
        'status': 'uploading',
      }).select('id').single();

      recordId = insertResult['id'] as String;

      // Upload to Storage
      await _db.storage.from('meetup-recordings').upload(
        storagePath,
        file,
        fileOptions: const FileOptions(
          contentType: 'audio/mp4',
          upsert: true,
        ),
      );

      // Get public URL
      final publicUrl = _db.storage
          .from('meetup-recordings')
          .getPublicUrl(storagePath);

      // Update DB record with public URL and status
      await _db.from('meetup_recordings').update({
        'public_url': publicUrl,
        'status': 'uploaded',
      }).eq('id', recordId);

      debugPrint('[Recording] Uploaded: $publicUrl');

      // Clean up local file
      try {
        await file.delete();
      } catch (_) {}

      return publicUrl;
    } catch (e) {
      debugPrint('[Recording] uploadRecording error: $e');
      // Mark orphaned DB record as failed
      if (recordId != null) {
        try {
          await _db.from('meetup_recordings').update({
            'status': 'failed',
          }).eq('id', recordId);
        } catch (_) {}
      }
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  /// Get all recordings for a meetup
  static Future<List<Map<String, dynamic>>> getRecordings(String meetupId) async {
    try {
      final response = await _db
          .from('meetup_recordings')
          .select()
          .eq('meetup_id', meetupId)
          .order('created_at', ascending: true);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      debugPrint('[Recording] getRecordings error: $e');
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  /// Dispose resources — safe to call; re-creates recorder on next use.
  static Future<void> dispose() async {
    _durationTimer?.cancel();
    _durationTimer = null;
    if (_recorder != null && await _recorder!.isRecording()) {
      await _recorder!.stop();
    }
    _recorder?.dispose();
    _recorder = null;
    _recordingStartTime = null;
    _currentMeetupId = null;
    _currentFilePath = null;
    onAutoStop = null;
  }
}
