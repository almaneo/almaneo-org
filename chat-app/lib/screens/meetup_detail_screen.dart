import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/meetup_service.dart';

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

  @override
  void initState() {
    super.initState();
    _meetup = Map<String, dynamic>.from(widget.meetup);
    _loadDetails();
  }

  Future<void> _loadDetails() async {
    final userId = StreamChat.of(context).currentUser?.id ?? '';
    final meetupId = _meetup['id'] as String;

    try {
      final results = await Future.wait([
        MeetupService.isParticipant(meetupId, userId),
        MeetupService.getParticipantCount(meetupId),
        MeetupService.getMeetupById(meetupId),
      ]);

      if (mounted) {
        setState(() {
          _isParticipant = results[0] as bool;
          _participantCount = results[1] as int;
          if (results[2] != null) {
            _meetup = results[2] as Map<String, dynamic>;
          }
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Load meetup details error: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _toggleParticipation() async {
    final userId = StreamChat.of(context).currentUser?.id ?? '';
    final meetupId = _meetup['id'] as String;

    setState(() => _isLoading = true);

    bool success;
    if (_isParticipant) {
      success = await MeetupService.leaveMeetup(meetupId, userId);
    } else {
      success = await MeetupService.joinMeetup(meetupId, userId);
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

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;
    final title = _meetup['title'] as String? ?? '';
    final description = _meetup['description'] as String? ?? '';
    final location = _meetup['location'] as String? ?? '';
    final status = _meetup['status'] as String? ?? 'upcoming';
    final hostAddress = _meetup['host_address'] as String? ?? '';
    final maxParticipants = _meetup['max_participants'] as int? ?? 20;
    final photoUrl = _meetup['photo_url'] as String?;

    DateTime? meetingDate;
    try {
      meetingDate = DateTime.parse(_meetup['meeting_date'] as String);
    } catch (_) {}

    final isUpcoming = status == 'upcoming';
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
                  // Status badge
                  _statusBadge(status, lang),
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
                    _truncateAddress(hostAddress),
                  ),
                  const SizedBox(height: 10),
                  _infoRow(
                    Icons.people,
                    tr('home.participants', lang,
                        args: {'count': '$_participantCount'}),
                    '$_participantCount / $maxParticipants',
                  ),

                  const SizedBox(height: 24),

                  // Action buttons
                  if (isUpcoming)
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed:
                            _isLoading || (isFull && !_isParticipant)
                                ? null
                                : _toggleParticipation,
                        icon: Icon(
                          _isParticipant
                              ? Icons.logout
                              : Icons.login,
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

                  if (_isParticipant && isUpcoming) ...[
                    const SizedBox(height: 12),
                    // Participant badge
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

                  // Kindness points info for completed meetups
                  if (status == 'completed' && _isParticipant) ...[
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

  Widget _statusBadge(String status, String lang) {
    final Color color;
    final String label;
    switch (status) {
      case 'upcoming':
        color = AlmaTheme.electricBlue;
        label = tr('home.upcoming', lang);
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

  String _truncateAddress(String address) {
    if (address.length <= 12) return address;
    return '${address.substring(0, 6)}...${address.substring(address.length - 4)}';
  }
}
