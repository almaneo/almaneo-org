import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../services/meetup_service.dart';
import '../widgets/alma_logo.dart';
import 'meetup_detail_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  List<Map<String, dynamic>>? _meetups;
  bool _isLoading = true;
  String _filter = 'upcoming'; // 'upcoming', 'in_progress', 'completed', 'all'

  @override
  void initState() {
    super.initState();
    _loadMeetups();
  }

  Future<void> _loadMeetups() async {
    setState(() => _isLoading = true);
    try {
      final meetups = await MeetupService.getMeetups(
        status: _filter == 'all' ? null : _filter,
        limit: 30,
      );
      // Get participant counts
      for (final meetup in meetups) {
        meetup['participant_count'] =
            await MeetupService.getParticipantCount(meetup['id']);
      }
      if (mounted) {
        setState(() {
          _meetups = meetups;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Load meetups error: $e');
      if (mounted) {
        setState(() {
          _meetups = [];
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const AlmaLogo(size: 28, showShadow: false),
            const SizedBox(width: 8),
            Text(
              tr('home.title', lang),
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Filter tabs
          _buildFilterTabs(lang),
          // Meetup list
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                      color: AlmaTheme.electricBlue,
                      strokeWidth: 2,
                    ),
                  )
                : _meetups == null || _meetups!.isEmpty
                    ? _buildEmptyState(lang)
                    : RefreshIndicator(
                        onRefresh: _loadMeetups,
                        color: AlmaTheme.electricBlue,
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 8),
                          itemCount: _meetups!.length,
                          itemBuilder: (context, index) {
                            return _MeetupCard(
                              meetup: _meetups![index],
                              lang: lang,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => MeetupDetailScreen(
                                      meetup: _meetups![index],
                                    ),
                                  ),
                                ).then((_) => _loadMeetups());
                              },
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showCreateMeetup(context, lang),
        icon: const Icon(Icons.add),
        label: Text(tr('home.createMeetup', lang)),
        backgroundColor: AlmaTheme.electricBlue,
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildFilterTabs(String lang) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: [
          _filterChip('upcoming', tr('home.upcoming', lang), lang),
          const SizedBox(width: 8),
          _filterChip('in_progress', tr('home.inProgress', lang), lang),
          const SizedBox(width: 8),
          _filterChip('completed', tr('home.completed', lang), lang),
          const SizedBox(width: 8),
          _filterChip('all', tr('channels.filterAll', lang), lang),
        ],
      ),
    );
  }

  Widget _filterChip(String value, String label, String lang) {
    final isSelected = _filter == value;
    return GestureDetector(
      onTap: () {
        setState(() => _filter = value);
        _loadMeetups();
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected
              ? AlmaTheme.terracottaOrange.withValues(alpha: 0.2)
              : AlmaTheme.slateGray.withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? AlmaTheme.terracottaOrange.withValues(alpha: 0.5)
                : Colors.transparent,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected
                ? AlmaTheme.terracottaOrange
                : Colors.white.withValues(alpha: 0.5),
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(String lang) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/images/Small_Heart.webp',
            width: 80,
            height: 80,
            fit: BoxFit.contain,
            errorBuilder: (_, __, ___) => Icon(
              Icons.event_available,
              size: 56,
              color: Colors.white.withValues(alpha: 0.15),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            tr('home.noMeetups', lang),
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.5),
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            tr('home.createFirst', lang),
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.3),
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  void _showCreateMeetup(BuildContext context, String lang) {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    final locationController = TextEditingController();
    DateTime selectedDate = DateTime.now().add(const Duration(days: 1));

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AlmaTheme.slateGray,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 16,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Handle
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                Text(
                  tr('home.createMeetup', lang),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                // Title
                _inputField(titleController, tr('home.meetupTitle', lang)),
                const SizedBox(height: 12),
                // Description
                _inputField(descController, tr('home.meetupDesc', lang),
                    maxLines: 3),
                const SizedBox(height: 12),
                // Location
                _inputField(locationController, tr('home.meetupLocation', lang),
                    icon: Icons.location_on),
                const SizedBox(height: 12),
                // Date picker
                GestureDetector(
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: ctx,
                      initialDate: selectedDate,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null) {
                      final time = await showTimePicker(
                        context: ctx,
                        initialTime: TimeOfDay.fromDateTime(selectedDate),
                      );
                      if (time != null) {
                        setModalState(() {
                          selectedDate = DateTime(
                            picked.year,
                            picked.month,
                            picked.day,
                            time.hour,
                            time.minute,
                          );
                        });
                      }
                    }
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AlmaTheme.deepNavy,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: AlmaTheme.electricBlue.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.calendar_today,
                            size: 18,
                            color: Colors.white.withValues(alpha: 0.5)),
                        const SizedBox(width: 10),
                        Text(
                          '${selectedDate.year}-${selectedDate.month.toString().padLeft(2, '0')}-${selectedDate.day.toString().padLeft(2, '0')} '
                          '${selectedDate.hour.toString().padLeft(2, '0')}:${selectedDate.minute.toString().padLeft(2, '0')}',
                          style: const TextStyle(
                              color: Colors.white, fontSize: 15),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                // Submit
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () async {
                      if (titleController.text.trim().isEmpty ||
                          locationController.text.trim().isEmpty) {
                        return;
                      }
                      Navigator.pop(ctx);
                      // For now, we don't have wallet address from chat user
                      // Use Stream user ID as a placeholder
                      final userId =
                          StreamChat.of(context).currentUser?.id ?? '';
                      final result = await MeetupService.createMeetup(
                        title: titleController.text.trim(),
                        description: descController.text.trim().isNotEmpty
                            ? descController.text.trim()
                            : null,
                        hostAddress: userId,
                        location: locationController.text.trim(),
                        meetingDate: selectedDate,
                      );
                      if (result != null) {
                        _loadMeetups();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AlmaTheme.electricBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(tr('home.create', lang)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _inputField(TextEditingController controller, String hint,
      {int maxLines = 1, IconData? icon}) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      style: const TextStyle(color: Colors.white, fontSize: 15),
      cursorColor: AlmaTheme.electricBlue,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.3)),
        prefixIcon: icon != null
            ? Icon(icon, size: 18, color: Colors.white.withValues(alpha: 0.4))
            : null,
        filled: true,
        fillColor: AlmaTheme.deepNavy,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              BorderSide(color: AlmaTheme.electricBlue.withValues(alpha: 0.3)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              BorderSide(color: AlmaTheme.electricBlue.withValues(alpha: 0.15)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              BorderSide(color: AlmaTheme.electricBlue.withValues(alpha: 0.5)),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
    );
  }
}

/// Meetup card widget
class _MeetupCard extends StatelessWidget {
  final Map<String, dynamic> meetup;
  final String lang;
  final VoidCallback? onTap;

  const _MeetupCard({required this.meetup, required this.lang, this.onTap});

  @override
  Widget build(BuildContext context) {
    final title = meetup['title'] as String? ?? '';
    final description = meetup['description'] as String? ?? '';
    final location = meetup['location'] as String? ?? '';
    final status = meetup['status'] as String? ?? 'upcoming';
    final photoUrl = meetup['photo_url'] as String?;
    final participantCount = meetup['participant_count'] as int? ?? 0;
    final maxParticipants = meetup['max_participants'] as int? ?? 20;

    DateTime? meetingDate;
    try {
      meetingDate = DateTime.parse(meetup['meeting_date'] as String);
    } catch (_) {}

    final isActive = status == 'upcoming' || status == 'in_progress';

    return GestureDetector(
      onTap: onTap,
      child: Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AlmaTheme.slateGray.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isActive
              ? AlmaTheme.electricBlue.withValues(alpha: 0.15)
              : Colors.white.withValues(alpha: 0.05),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Photo (if available)
          if (photoUrl != null && photoUrl.isNotEmpty)
            ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(14)),
              child: Image.network(
                photoUrl,
                width: double.infinity,
                height: 150,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const SizedBox.shrink(),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status badge + date
                Row(
                  children: [
                    _statusBadge(status, lang),
                    const Spacer(),
                    if (meetingDate != null)
                      Text(
                        _formatDate(meetingDate, lang),
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.4),
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                // Title
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (description.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.5),
                      fontSize: 13,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
                const SizedBox(height: 10),
                // Location + Participants
                Row(
                  children: [
                    Icon(Icons.location_on,
                        size: 14,
                        color: AlmaTheme.terracottaOrange.withValues(alpha: 0.7)),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        location,
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.5),
                          fontSize: 12,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Icon(Icons.people_outline,
                        size: 14,
                        color: Colors.white.withValues(alpha: 0.4)),
                    const SizedBox(width: 4),
                    Text(
                      '$participantCount/$maxParticipants',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.4),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
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
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  String _formatDate(DateTime date, String lang) {
    final now = DateTime.now();
    final diff = date.difference(now);

    if (diff.inDays == 0) {
      return '${tr('home.today', lang)} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    } else if (diff.inDays == 1) {
      return '${tr('home.tomorrow', lang)} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    }
    return '${date.month}/${date.day} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
