import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/meetup_service.dart';
import '../services/recording_service.dart';
import '../widgets/recording_indicator.dart';

class MeetupDetailScreen extends ConsumerStatefulWidget {
  final Map<String, dynamic> meetup;

  const MeetupDetailScreen({super.key, required this.meetup});

  @override
  ConsumerState<MeetupDetailScreen> createState() => _MeetupDetailScreenState();
}

class _MeetupDetailScreenState extends ConsumerState<MeetupDetailScreen> {
  late Map<String, dynamic> _meetup;
  bool _isParticipant = false;
  bool _isLoading = true;
  int _participantCount = 0;

  // Recording state
  bool _isRecording = false;
  bool _isUploading = false;
  Timer? _recordingTimer;
  int _recordingElapsed = 0;
  List<Map<String, dynamic>> _recordings = [];

  String get _userId => StreamChat.of(context).currentUser?.id ?? '';
  String get _meetupId => _meetup['id'] as String;
  String get _status => _meetup['status'] as String? ?? 'upcoming';
  String get _hostAddress => _meetup['host_address'] as String? ?? '';
  bool get _isHost => _userId == _hostAddress;

  @override
  void initState() {
    super.initState();
    _meetup = Map<String, dynamic>.from(widget.meetup);
    _loadDetails();
  }

  @override
  void dispose() {
    _recordingTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadDetails() async {
    try {
      final results = await Future.wait([
        MeetupService.isParticipant(_meetupId, _userId),
        MeetupService.getParticipantCount(_meetupId),
        MeetupService.getMeetupById(_meetupId),
        RecordingService.getRecordings(_meetupId),
      ]);

      if (mounted) {
        setState(() {
          _isParticipant = results[0] as bool;
          _participantCount = results[1] as int;
          if (results[2] != null) {
            _meetup = results[2] as Map<String, dynamic>;
          }
          _recordings = results[3] as List<Map<String, dynamic>>;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Load meetup details error: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _toggleParticipation() async {
    setState(() => _isLoading = true);

    bool success;
    if (_isParticipant) {
      success = await MeetupService.leaveMeetup(_meetupId, _userId);
    } else {
      success = await MeetupService.joinMeetup(_meetupId, _userId);
    }

    if (success && mounted) {
      setState(() {
        _isParticipant = !_isParticipant;
        _participantCount += _isParticipant ? 1 : -1;
        _isLoading = false;
      });
    } else if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  // ── Lifecycle actions (host only) ──

  Future<void> _startMeetup(String lang) async {
    final confirm = await _showConfirmDialog(
      tr('home.startMeetup', lang),
      tr('home.startMeetup', lang),
    );
    if (confirm != true) return;

    setState(() => _isLoading = true);
    final ok = await MeetupService.startMeetup(_meetupId);
    if (ok && mounted) {
      setState(() {
        _meetup['status'] = 'in_progress';
        _meetup['started_at'] = DateTime.now().toIso8601String();
        _isLoading = false;
      });
    } else if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _endMeetup(String lang) async {
    // Stop recording if active
    if (_isRecording) {
      await _stopRecording(lang);
    }

    final confirm = await _showConfirmDialog(
      tr('home.endMeetup', lang),
      tr('home.endMeetupConfirm', lang),
    );
    if (confirm != true) return;

    setState(() => _isLoading = true);
    final ok = await MeetupService.endMeetup(_meetupId);
    if (ok && mounted) {
      setState(() {
        _meetup['status'] = 'ended';
        _meetup['ended_at'] = DateTime.now().toIso8601String();
        _isLoading = false;
      });
    } else if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _completeMeetup() async {
    setState(() => _isLoading = true);
    final ok = await MeetupService.completeMeetup(_meetupId);
    if (ok && mounted) {
      setState(() {
        _meetup['status'] = 'completed';
        _isLoading = false;
      });
    } else if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  // ── Recording actions ──

  Future<void> _startRecording(String lang) async {
    final hasPerms = await RecordingService.hasPermission();
    if (!hasPerms) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(tr('recording.permissionDenied', lang))),
        );
      }
      return;
    }

    final path = await RecordingService.startRecording(_meetupId);
    if (path != null && mounted) {
      setState(() {
        _isRecording = true;
        _recordingElapsed = 0;
      });
      _recordingTimer = Timer.periodic(const Duration(seconds: 1), (_) {
        if (mounted) setState(() => _recordingElapsed++);
      });
    }
  }

  Future<void> _stopRecording(String lang) async {
    _recordingTimer?.cancel();
    _recordingTimer = null;

    final result = await RecordingService.stopRecording();
    if (result == null) {
      if (mounted) setState(() => _isRecording = false);
      return;
    }

    if (mounted) {
      setState(() {
        _isRecording = false;
        _isUploading = true;
      });
    }

    // Upload
    final url = await RecordingService.uploadRecording(
      meetupId: _meetupId,
      recorderId: _userId,
      localFilePath: result['path'] as String,
      durationSeconds: result['durationSeconds'] as int,
    );

    if (mounted) {
      setState(() => _isUploading = false);
      if (url != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(tr('recording.uploaded', lang))),
        );
        // Reload recordings list
        final recs = await RecordingService.getRecordings(_meetupId);
        if (mounted) setState(() => _recordings = recs);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(tr('recording.failed', lang))),
        );
      }
    }
  }

  Future<bool?> _showConfirmDialog(String title, String message) {
    return showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AlmaTheme.slateGray,
        title: Text(title, style: const TextStyle(color: Colors.white)),
        content: Text(message, style: TextStyle(color: Colors.white70)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text('Cancel', style: TextStyle(color: Colors.white54)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text('OK', style: TextStyle(color: AlmaTheme.electricBlue)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;
    final title = _meetup['title'] as String? ?? '';
    final description = _meetup['description'] as String? ?? '';
    final location = _meetup['location'] as String? ?? '';
    final status = _status;
    final maxParticipants = _meetup['max_participants'] as int? ?? 20;
    final photoUrl = _meetup['photo_url'] as String?;

    DateTime? meetingDate;
    try {
      meetingDate = DateTime.parse(_meetup['meeting_date'] as String);
    } catch (_) {}

    final isUpcoming = status == 'upcoming';
    final isInProgress = status == 'in_progress';
    final isEnded = status == 'ended';
    final isFull = _participantCount >= maxParticipants;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
          overflow: TextOverflow.ellipsis,
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Photo header
            if (photoUrl != null && photoUrl.isNotEmpty)
              Image.network(
                photoUrl,
                width: double.infinity,
                height: 200,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const SizedBox.shrink(),
              )
            else
              Container(
                width: double.infinity,
                height: 120,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AlmaTheme.electricBlue.withValues(alpha: 0.3),
                      AlmaTheme.terracottaOrange.withValues(alpha: 0.2),
                    ],
                  ),
                ),
                child: Center(
                  child: Icon(
                    Icons.event,
                    size: 48,
                    color: Colors.white.withValues(alpha: 0.3),
                  ),
                ),
              ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Status badge + recording indicator
                  Row(
                    children: [
                      _statusBadge(status, lang),
                      if (_isRecording) ...[
                        const SizedBox(width: 8),
                        RecordingIndicator(
                          elapsedSeconds: _recordingElapsed,
                          lang: lang,
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Title
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  if (description.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      description,
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.6),
                        fontSize: 14,
                        height: 1.4,
                      ),
                    ),
                  ],

                  const SizedBox(height: 20),

                  // Info cards
                  _infoRow(
                    Icons.calendar_today,
                    tr('home.meetupDate', lang),
                    meetingDate != null
                        ? _formatFullDate(meetingDate, lang)
                        : '-',
                  ),
                  const SizedBox(height: 10),
                  _infoRow(
                    Icons.location_on,
                    tr('home.meetupLocation', lang),
                    location,
                  ),
                  const SizedBox(height: 10),
                  _infoRow(
                    Icons.person,
                    'Host',
                    _truncateAddress(_hostAddress),
                  ),
                  const SizedBox(height: 10),
                  _infoRow(
                    Icons.people,
                    tr('home.participants', lang,
                        args: {'count': '$_participantCount'}),
                    '$_participantCount / $maxParticipants',
                  ),

                  const SizedBox(height: 24),

                  // ── HOST CONTROLS ──
                  if (_isHost) ...[
                    // upcoming → "Start Meetup" button
                    if (isUpcoming)
                      _actionButton(
                        icon: Icons.play_arrow,
                        label: tr('home.startMeetup', lang),
                        color: AlmaTheme.success,
                        onPressed: _isLoading ? null : () => _startMeetup(lang),
                      ),

                    // in_progress → Recording + "End Meetup"
                    if (isInProgress) ...[
                      // Recording controls
                      if (!_isRecording && !_isUploading)
                        _actionButton(
                          icon: Icons.mic,
                          label: tr('recording.start', lang),
                          color: AlmaTheme.error,
                          onPressed: () => _startRecording(lang),
                        ),
                      if (_isRecording)
                        _actionButton(
                          icon: Icons.stop,
                          label: tr('recording.stop', lang),
                          color: AlmaTheme.error,
                          onPressed: () => _stopRecording(lang),
                        ),
                      if (_isUploading)
                        _actionButton(
                          icon: Icons.cloud_upload,
                          label: tr('recording.uploading', lang),
                          color: AlmaTheme.warning,
                          onPressed: null,
                        ),
                      const SizedBox(height: 12),
                      // End meetup
                      _actionButton(
                        icon: Icons.stop_circle,
                        label: tr('home.endMeetup', lang),
                        color: AlmaTheme.terracottaOrange,
                        onPressed: _isLoading ? null : () => _endMeetup(lang),
                      ),
                    ],

                    // ended → "Complete" button
                    if (isEnded)
                      _actionButton(
                        icon: Icons.check_circle,
                        label: tr('home.completed', lang),
                        color: AlmaTheme.success,
                        onPressed: _isLoading ? null : _completeMeetup,
                      ),
                  ],

                  // ── PARTICIPANT CONTROLS ──
                  if (!_isHost) ...[
                    // Join/leave for upcoming
                    if (isUpcoming)
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed:
                              _isLoading || (isFull && !_isParticipant)
                                  ? null
                                  : _toggleParticipation,
                          icon: Icon(
                            _isParticipant ? Icons.logout : Icons.login,
                          ),
                          label: Text(
                            _isParticipant
                                ? tr('home.leave', lang)
                                : isFull
                                    ? tr('home.full', lang)
                                    : tr('home.join', lang),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _isParticipant
                                ? AlmaTheme.error.withValues(alpha: 0.8)
                                : AlmaTheme.electricBlue,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),

                    // In progress badge for participants
                    if (isInProgress)
                      _statusCard(
                        icon: Icons.play_circle,
                        label: tr('home.inProgress', lang),
                        color: AlmaTheme.terracottaOrange,
                      ),

                    // Ended badge for participants
                    if (isEnded)
                      _statusCard(
                        icon: Icons.stop_circle,
                        label: tr('home.ended', lang),
                        color: AlmaTheme.warning,
                      ),
                  ],

                  // Joined badge
                  if (_isParticipant && isUpcoming) ...[
                    const SizedBox(height: 12),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AlmaTheme.success.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AlmaTheme.success.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.check_circle,
                              color: AlmaTheme.success, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            tr('home.joined', lang),
                            style: TextStyle(
                              color: AlmaTheme.success,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Recordings list (visible for ended/completed or in_progress host)
                  if (_recordings.isNotEmpty ||
                      ((isEnded || _status == 'completed') && _isHost)) ...[
                    const SizedBox(height: 24),
                    Text(
                      tr('recording.recordings', lang),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    if (_recordings.isEmpty)
                      Text(
                        tr('recording.noRecordings', lang),
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.4),
                          fontSize: 13,
                        ),
                      )
                    else
                      ..._recordings.map((rec) => _recordingTile(rec, lang)),
                  ],

                  // Kindness points info for completed meetups
                  if (_status == 'completed' && _isParticipant) ...[
                    const SizedBox(height: 20),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            AlmaTheme.terracottaOrange.withValues(alpha: 0.15),
                            AlmaTheme.electricBlue.withValues(alpha: 0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color:
                              AlmaTheme.terracottaOrange.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Column(
                        children: [
                          const Icon(
                            Icons.emoji_events,
                            color: AlmaTheme.terracottaOrange,
                            size: 32,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '+30 Kindness Points',
                            style: TextStyle(
                              color: AlmaTheme.terracottaOrange,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            tr('almaneo.meetupsAttended', lang),
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.5),
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Helper widgets ──

  Widget _actionButton({
    required IconData icon,
    required String label,
    required Color color,
    VoidCallback? onPressed,
  }) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon),
        label: Text(label),
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  Widget _statusCard({
    required IconData icon,
    required String label,
    required Color color,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _statusBadge(String status, String lang) {
    final Color color;
    final String label;
    switch (status) {
      case 'upcoming':
        color = AlmaTheme.electricBlue;
        label = tr('home.upcoming', lang);
      case 'in_progress':
        color = AlmaTheme.terracottaOrange;
        label = tr('home.inProgress', lang);
      case 'ended':
        color = AlmaTheme.warning;
        label = tr('home.ended', lang);
      case 'completed':
        color = AlmaTheme.success;
        label = tr('home.completed', lang);
      case 'cancelled':
        color = AlmaTheme.error;
        label = tr('home.cancelled', lang);
      default:
        color = Colors.grey;
        label = status;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _recordingTile(Map<String, dynamic> rec, String lang) {
    final duration = rec['duration_seconds'] as int? ?? 0;
    final status = rec['status'] as String? ?? 'uploaded';
    final createdAt = rec['created_at'] as String?;
    final minutes = duration ~/ 60;
    final seconds = duration % 60;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: AlmaTheme.glassCard(opacity: 0.06, radius: 10),
      child: Row(
        children: [
          Icon(
            status == 'uploaded' ? Icons.audiotrack : Icons.cloud_upload,
            color: status == 'uploaded'
                ? AlmaTheme.electricBlue
                : AlmaTheme.warning,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'monospace',
                  ),
                ),
                if (createdAt != null)
                  Text(
                    _formatShortDate(createdAt),
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.4),
                      fontSize: 11,
                    ),
                  ),
              ],
            ),
          ),
          Text(
            status == 'uploaded'
                ? tr('recording.uploaded', lang)
                : tr('recording.processing', lang),
            style: TextStyle(
              color: status == 'uploaded'
                  ? AlmaTheme.success
                  : AlmaTheme.warning,
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.white.withValues(alpha: 0.4)),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.7),
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }

  String _formatFullDate(DateTime date, String lang) {
    final now = DateTime.now();
    final diff = date.difference(now);
    final dateStr =
        '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    final timeStr =
        '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';

    if (diff.inDays == 0) {
      return '${tr('home.today', lang)} $timeStr';
    } else if (diff.inDays == 1) {
      return '${tr('home.tomorrow', lang)} $timeStr';
    }
    return '$dateStr $timeStr';
  }

  String _formatShortDate(String isoDate) {
    try {
      final dt = DateTime.parse(isoDate);
      return '${dt.month}/${dt.day} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return '';
    }
  }

  String _truncateAddress(String address) {
    if (address.length <= 12) return address;
    return '${address.substring(0, 6)}...${address.substring(address.length - 4)}';
  }
}
