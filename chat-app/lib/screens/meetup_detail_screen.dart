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
import 'meetup_chat_screen.dart';

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

  // Participant details
  List<Map<String, dynamic>> _participants = [];
  String _hostDisplayName = '';

  String get _userId => StreamChat.of(context).currentUser?.id ?? '';
  String get _meetupId => _meetup['id'] as String;
  String get _status => _meetup['status'] as String? ?? 'upcoming';
  String get _hostAddress => _meetup['host_address'] as String? ?? '';
  bool get _isHost => _userId == _hostAddress;

  bool _didLoad = false;

  @override
  void initState() {
    super.initState();
    _meetup = Map<String, dynamic>.from(widget.meetup);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_didLoad) {
      _didLoad = true;
      _loadDetails();
    }
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
        MeetupService.getParticipantDetails(_meetupId),
        MeetupService.getUserDisplayName(_hostAddress),
      ]);

      if (mounted) {
        setState(() {
          _isParticipant = results[0] as bool;
          _participantCount = results[1] as int;
          if (results[2] != null) {
            _meetup = results[2] as Map<String, dynamic>;
          }
          _recordings = results[3] as List<Map<String, dynamic>>;
          _participants = results[4] as List<Map<String, dynamic>>;
          _hostDisplayName = results[5] as String;
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
      // Reload participant list
      _reloadParticipants();
    } else if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _reloadParticipants() async {
    final parts = await MeetupService.getParticipantDetails(_meetupId);
    if (mounted) setState(() => _participants = parts);
  }

  // ── Edit Meetup (host only, upcoming only) ──

  Future<void> _showEditSheet(String lang) async {
    final titleCtrl = TextEditingController(text: _meetup['title'] as String? ?? '');
    final descCtrl = TextEditingController(text: _meetup['description'] as String? ?? '');
    final locationCtrl = TextEditingController(text: _meetup['location'] as String? ?? '');
    DateTime? selectedDate;
    try {
      selectedDate = DateTime.parse(_meetup['meeting_date'] as String);
    } catch (_) {}
    int maxParts = _meetup['max_participants'] as int? ?? 20;

    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AlmaTheme.deepNavy,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.white24,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  tr('meetup.editMeetup', lang),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),

                // Title
                _buildTextField(titleCtrl, tr('home.meetupTitle', lang)),
                const SizedBox(height: 12),

                // Description
                _buildTextField(descCtrl, tr('home.meetupDesc', lang), maxLines: 3),
                const SizedBox(height: 12),

                // Location
                _buildTextField(locationCtrl, tr('home.meetupLocation', lang)),
                const SizedBox(height: 12),

                // Date picker
                GestureDetector(
                  onTap: () async {
                    final date = await showDatePicker(
                      context: ctx,
                      initialDate: selectedDate ?? DateTime.now().add(const Duration(days: 1)),
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (date == null) return;
                    if (!ctx.mounted) return;
                    final time = await showTimePicker(
                      context: ctx,
                      initialTime: selectedDate != null
                          ? TimeOfDay.fromDateTime(selectedDate!)
                          : const TimeOfDay(hour: 18, minute: 0),
                    );
                    if (time == null) return;
                    setModalState(() {
                      selectedDate = DateTime(date.year, date.month, date.day, time.hour, time.minute);
                    });
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.calendar_today, size: 18, color: Colors.white54),
                        const SizedBox(width: 10),
                        Text(
                          selectedDate != null
                              ? '${selectedDate!.year}-${selectedDate!.month.toString().padLeft(2, '0')}-${selectedDate!.day.toString().padLeft(2, '0')} ${selectedDate!.hour.toString().padLeft(2, '0')}:${selectedDate!.minute.toString().padLeft(2, '0')}'
                              : tr('home.meetupDate', lang),
                          style: TextStyle(
                            color: selectedDate != null ? Colors.white : Colors.white54,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Max participants stepper
                Row(
                  children: [
                    Icon(Icons.people, size: 18, color: Colors.white54),
                    const SizedBox(width: 10),
                    Text(
                      tr('meetup.maxParticipants', lang),
                      style: const TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: () {
                        if (maxParts > 2) setModalState(() => maxParts--);
                      },
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.remove, color: Colors.white70, size: 18),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: Text(
                        '$maxParts',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        if (maxParts < 100) setModalState(() => maxParts++);
                      },
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.add, color: Colors.white70, size: 18),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Save button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx, {
                        'title': titleCtrl.text.trim(),
                        'description': descCtrl.text.trim(),
                        'location': locationCtrl.text.trim(),
                        'meetingDate': selectedDate,
                        'maxParticipants': maxParts,
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AlmaTheme.electricBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(tr('meetup.save', lang)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    titleCtrl.dispose();
    descCtrl.dispose();
    locationCtrl.dispose();

    if (result == null || !mounted) return;

    setState(() => _isLoading = true);
    final ok = await MeetupService.updateMeetup(
      meetupId: _meetupId,
      title: result['title'] as String?,
      description: result['description'] as String?,
      location: result['location'] as String?,
      meetingDate: result['meetingDate'] as DateTime?,
      maxParticipants: result['maxParticipants'] as int?,
    );
    if (ok && mounted) {
      // Refresh local state
      if (result['title'] != null) _meetup['title'] = result['title'];
      if (result['description'] != null) _meetup['description'] = result['description'];
      if (result['location'] != null) _meetup['location'] = result['location'];
      if (result['meetingDate'] != null) {
        _meetup['meeting_date'] = (result['meetingDate'] as DateTime).toIso8601String();
      }
      if (result['maxParticipants'] != null) _meetup['max_participants'] = result['maxParticipants'];
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(tr('meetup.updated', lang))),
        );
      }
    } else if (mounted) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('meetup.updateFailed', lang))),
      );
    }
  }

  Widget _buildTextField(TextEditingController ctrl, String label, {int maxLines = 1}) {
    return TextField(
      controller: ctrl,
      maxLines: maxLines,
      style: const TextStyle(color: Colors.white, fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white54, fontSize: 13),
        filled: true,
        fillColor: Colors.white.withValues(alpha: 0.06),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AlmaTheme.electricBlue),
        ),
      ),
    );
  }

  // ── Cancel Meetup ──

  Future<void> _cancelMeetup(String lang) async {
    final confirm = await _showConfirmDialog(
      tr('meetup.cancelMeetup', lang),
      tr('meetup.cancelConfirm', lang),
    );
    if (confirm != true || !mounted) return;

    setState(() => _isLoading = true);
    final ok = await MeetupService.cancelMeetup(_meetupId);
    if (ok && mounted) {
      setState(() {
        _meetup['status'] = 'cancelled';
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('meetup.cancelled', lang))),
      );
    } else if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  // ── Delete Meetup ──

  Future<void> _deleteMeetup(String lang) async {
    final confirm = await _showConfirmDialog(
      tr('meetup.deleteMeetup', lang),
      tr('meetup.deleteConfirm', lang),
    );
    if (confirm != true || !mounted) return;

    setState(() => _isLoading = true);
    final ok = await MeetupService.deleteMeetup(_meetupId);
    if (ok && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('meetup.deleted', lang))),
      );
      Navigator.pop(context, true); // return true to indicate deletion
    } else if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  // ── Remove Participant (host action) ──

  Future<void> _removeParticipant(String userAddress, String displayName, String lang) async {
    final confirm = await _showConfirmDialog(
      tr('meetup.removeParticipant', lang),
      tr('meetup.removeConfirm', lang, args: {'name': displayName}),
    );
    if (confirm != true || !mounted) return;

    final ok = await MeetupService.removeParticipant(_meetupId, userAddress);
    if (ok && mounted) {
      setState(() => _participantCount--);
      _reloadParticipants();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(tr('meetup.participantRemoved', lang))),
      );
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
    final confirm = await _showConfirmDialog(
      tr('home.endMeetup', lang),
      tr('home.endMeetupConfirm', lang),
    );
    if (confirm != true) return;

    // Stop recording if active (after user confirms)
    if (_isRecording) {
      await _stopRecording(lang);
    }

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

  Future<void> _openMeetupChat(String lang) async {
    // Use stored channel_id, or fallback to predictable pattern
    var channelId = _meetup['channel_id'] as String?;
    if (channelId == null || channelId.isEmpty) {
      channelId = 'meetup-$_meetupId';
      debugPrint('[MeetupChat] channel_id was null, using fallback: $channelId');
    }

    final client = StreamChat.of(context).client;
    final userId = _userId;

    if (userId.isEmpty) {
      debugPrint('[MeetupChat] userId is empty, cannot open chat');
      return;
    }

    try {
      // Ensure the current user is a member of the channel (server-side, idempotent).
      final memberOk = await MeetupService.ensureChannelMember(channelId, userId);
      debugPrint('[MeetupChat] ensureChannelMember($channelId, $userId) => $memberOk');

      final channel = client.channel('messaging', id: channelId);
      await channel.watch();

      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => StreamChannel(
            channel: channel,
            child: MeetupChatScreen(meetup: _meetup),
          ),
        ),
      );
    } catch (e) {
      debugPrint('[MeetupChat] Error opening chat: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${tr('meetupChat.openFailed', lang)}: $e'),
            backgroundColor: AlmaTheme.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
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
    final isCancelled = status == 'cancelled';
    final isFull = _participantCount >= maxParticipants;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          // Host action menu (edit/cancel/delete)
          if (_isHost && !isCancelled && status != 'completed')
            PopupMenuButton<String>(
              icon: const Icon(Icons.more_vert, color: Colors.white70),
              color: AlmaTheme.slateGray,
              onSelected: (value) {
                switch (value) {
                  case 'edit':
                    _showEditSheet(lang);
                  case 'cancel':
                    _cancelMeetup(lang);
                  case 'delete':
                    _deleteMeetup(lang);
                }
              },
              itemBuilder: (_) => [
                if (isUpcoming)
                  PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        const Icon(Icons.edit, color: Colors.white70, size: 18),
                        const SizedBox(width: 10),
                        Text(tr('meetup.editMeetup', lang), style: const TextStyle(color: Colors.white)),
                      ],
                    ),
                  ),
                if (isUpcoming || isInProgress)
                  PopupMenuItem(
                    value: 'cancel',
                    child: Row(
                      children: [
                        const Icon(Icons.cancel_outlined, color: AlmaTheme.warning, size: 18),
                        const SizedBox(width: 10),
                        Text(tr('meetup.cancelMeetup', lang), style: const TextStyle(color: AlmaTheme.warning)),
                      ],
                    ),
                  ),
                PopupMenuItem(
                  value: 'delete',
                  child: Row(
                    children: [
                      const Icon(Icons.delete_outline, color: AlmaTheme.error, size: 18),
                      const SizedBox(width: 10),
                      Text(tr('meetup.deleteMeetup', lang), style: const TextStyle(color: AlmaTheme.error)),
                    ],
                  ),
                ),
              ],
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openMeetupChat(lang),
        icon: const Icon(Icons.chat_bubble_outline, size: 20),
        label: Text(tr('meetupChat.openChat', lang)),
        backgroundColor: AlmaTheme.electricBlue,
        foregroundColor: Colors.white,
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
                    meetingDate != null
                        ? _formatFullDate(meetingDate, lang)
                        : '-',
                  ),
                  const SizedBox(height: 10),
                  _infoRow(
                    Icons.location_on,
                    location,
                  ),
                  const SizedBox(height: 10),
                  _infoRow(
                    Icons.person,
                    '${tr('meetup.host', lang)}: ${_hostDisplayName.isNotEmpty ? _hostDisplayName : _truncateAddress(_hostAddress)}',
                  ),
                  const SizedBox(height: 10),
                  _infoRow(
                    Icons.people,
                    '$_participantCount / $maxParticipants ${tr('meetup.participantsLabel', lang)}',
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
                  if (!_isHost && !isCancelled) ...[
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

                  // ── PARTICIPANT LIST ──
                  if (_participants.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    Row(
                      children: [
                        Text(
                          tr('meetup.participantList', lang),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AlmaTheme.electricBlue.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '${_participants.length}',
                            style: const TextStyle(
                              color: AlmaTheme.electricBlue,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ..._participants.map((p) => _participantTile(p, lang)),
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

                  // Bottom padding for FAB
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Helper widgets ──

  Widget _participantTile(Map<String, dynamic> participant, String lang) {
    final address = participant['user_address'] as String;
    final nickname = participant['nickname'] as String? ?? address;
    final avatarUrl = participant['avatar_url'] as String?;
    final isHost = address == _hostAddress;
    final displayName = (nickname != address && nickname.isNotEmpty)
        ? nickname
        : _truncateAddress(address);

    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: AlmaTheme.glassCard(opacity: 0.06, radius: 10),
      child: Row(
        children: [
          // Avatar
          CircleAvatar(
            radius: 18,
            backgroundColor: AlmaTheme.electricBlue.withValues(alpha: 0.2),
            backgroundImage: avatarUrl != null && avatarUrl.isNotEmpty
                ? NetworkImage(avatarUrl)
                : null,
            child: avatarUrl == null || avatarUrl.isEmpty
                ? Text(
                    displayName.isNotEmpty ? displayName[0].toUpperCase() : '?',
                    style: const TextStyle(
                      color: AlmaTheme.electricBlue,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  )
                : null,
          ),
          const SizedBox(width: 12),

          // Name + host badge
          Expanded(
            child: Row(
              children: [
                Flexible(
                  child: Text(
                    displayName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (isHost) ...[
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AlmaTheme.terracottaOrange.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      tr('meetup.host', lang),
                      style: const TextStyle(
                        color: AlmaTheme.terracottaOrange,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Remove button (host can remove non-host participants, only when upcoming)
          if (_isHost && !isHost && _status == 'upcoming')
            IconButton(
              icon: const Icon(Icons.close, size: 16, color: Colors.white38),
              onPressed: () => _removeParticipant(address, displayName, lang),
              visualDensity: VisualDensity.compact,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
            ),
        ],
      ),
    );
  }

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

  Widget _infoRow(IconData icon, String value) {
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
