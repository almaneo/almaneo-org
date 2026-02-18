import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/notification_service.dart';
import '../widgets/chat_widgets.dart';
import '../widgets/message_actions_sheet.dart';
import '../widgets/translated_message.dart';
import '../widgets/user_profile_sheet.dart';
import 'channel_info_screen.dart';

/// Meetup-specific chat screen with pinned meetup info header
class MeetupChatScreen extends ConsumerStatefulWidget {
  final Map<String, dynamic> meetup;

  const MeetupChatScreen({super.key, required this.meetup});

  @override
  ConsumerState<MeetupChatScreen> createState() => _MeetupChatScreenState();
}

class _MeetupChatScreenState extends ConsumerState<MeetupChatScreen> {
  bool _showInfo = true;
  late StreamMessageInputController _messageInputController;

  @override
  void initState() {
    super.initState();
    _messageInputController = StreamMessageInputController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final cid = StreamChannel.of(context).channel.cid;
    NotificationService.instance.setActiveChannel(cid);
  }

  @override
  void dispose() {
    _messageInputController.dispose();
    NotificationService.instance.setActiveChannel(null);
    super.dispose();
  }

  void _showMessageActions(Message message, bool isMyMessage, Channel channel, String lang) {
    showModalBottomSheet(
      context: context,
      backgroundColor: context.alma.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => MessageActionsSheet(
        message: message,
        isMyMessage: isMyMessage,
        channel: channel,
        lang: lang,
        onReply: () {
          setState(() {
            _messageInputController.quotedMessage = message;
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final channel = StreamChannel.of(context).channel;
    final currentUserId = StreamChat.of(context).currentUser?.id;
    final langState = ref.watch(languageProvider);
    final lang = langState.languageCode;

    final title = widget.meetup['title'] as String? ?? 'Meetup';
    final status = widget.meetup['status'] as String? ?? 'upcoming';
    final location = widget.meetup['location'] as String? ?? '';
    final meetingDateStr = widget.meetup['meeting_date'] as String?;

    DateTime? meetingDate;
    try {
      if (meetingDateStr != null) meetingDate = DateTime.parse(meetingDateStr);
    } catch (_) {}

    return Scaffold(
      appBar: AppBar(
        title: GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ChannelInfoScreen(channel: channel),
              ),
            );
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                overflow: TextOverflow.ellipsis,
              ),
              Text(
                tr('chat.translatingTo', lang, args: {
                  'lang': langState.language.nativeName,
                  'flag': langState.language.flag,
                }),
                style: TextStyle(
                  fontSize: 11,
                  color: AlmaTheme.terracottaOrange.withValues(alpha: 0.8),
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(
              _showInfo ? Icons.info : Icons.info_outline,
              size: 20,
              color: _showInfo
                  ? AlmaTheme.terracottaOrange
                  : alma.textSecondary,
            ),
            onPressed: () => setState(() => _showInfo = !_showInfo),
            tooltip: tr('meetupChat.toggleInfo', lang),
          ),
          MemberCountBadge(channel: channel),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          ConnectionBanner(lang: lang),
          // Collapsible meetup info header
          AnimatedCrossFade(
            firstChild: _MeetupInfoHeader(
              status: status,
              meetingDate: meetingDate,
              location: location,
              lang: lang,
            ),
            secondChild: const SizedBox.shrink(),
            crossFadeState:
                _showInfo ? CrossFadeState.showFirst : CrossFadeState.showSecond,
            duration: const Duration(milliseconds: 200),
          ),
          Expanded(
            child: StreamMessageListView(
              scrollToBottomBuilder: (unreadCount, scrollToBottom) {
                return GestureDetector(
                  onTap: () => scrollToBottom(unreadCount),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: alma.cardBg,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.15),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Badge(
                      isLabelVisible: unreadCount > 0,
                      label: Text(
                        unreadCount > 99 ? '99+' : '$unreadCount',
                        style: const TextStyle(fontSize: 9, color: Colors.white),
                      ),
                      backgroundColor: AlmaTheme.error,
                      child: Icon(Icons.keyboard_arrow_down, color: alma.textPrimary, size: 22),
                    ),
                  ),
                );
              },
              messageBuilder: (context, details, messages, defaultWidget) {
                return TranslatedMessage(
                  message: details.message,
                  isMyMessage: details.isMyMessage,
                  onLongPress: () => _showMessageActions(
                    details.message,
                    details.isMyMessage,
                    channel,
                    lang,
                  ),
                  onReply: () {
                    setState(() {
                      _messageInputController.quotedMessage = details.message;
                    });
                  },
                  currentUserId: currentUserId,
                  channel: channel,
                  onAvatarTap: (user) {
                    UserProfileSheet.show(context, user: user, lang: lang);
                  },
                );
              },
            ),
          ),
          TypingIndicator(lang: lang),
          StreamMessageInput(
            messageInputController: _messageInputController,
          ),
        ],
      ),
    );
  }
}

/// Pinned meetup info header (collapsible)
class _MeetupInfoHeader extends StatelessWidget {
  final String status;
  final DateTime? meetingDate;
  final String location;
  final String lang;

  const _MeetupInfoHeader({
    required this.status,
    required this.meetingDate,
    required this.location,
    required this.lang,
  });

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: alma.cardBg.withValues(alpha: 0.5),
        border: Border(
          bottom: BorderSide(
            color: alma.divider,
          ),
        ),
      ),
      child: Row(
        children: [
          // Status badge
          _statusBadge(status, lang),
          const SizedBox(width: 12),
          // Date & Location
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (meetingDate != null)
                  Row(
                    children: [
                      Icon(Icons.calendar_today,
                          size: 13,
                          color: alma.textTertiary),
                      const SizedBox(width: 5),
                      Text(
                        _formatDate(meetingDate!, lang),
                        style: TextStyle(
                          fontSize: 12,
                          color: alma.textSecondary,
                        ),
                      ),
                    ],
                  ),
                if (location.isNotEmpty) ...[
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      Icon(Icons.location_on,
                          size: 13,
                          color: alma.textTertiary),
                      const SizedBox(width: 5),
                      Expanded(
                        child: Text(
                          location,
                          style: TextStyle(
                            fontSize: 12,
                            color: alma.textSecondary,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ],
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
      default:
        color = Colors.grey;
        label = status;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
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
    final dateStr =
        '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    final timeStr =
        '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    return '$dateStr $timeStr';
  }
}
