import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:share_plus/share_plus.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/env.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/notification_service.dart';
import '../widgets/chat_widgets.dart';
import '../widgets/message_actions_sheet.dart';
import '../widgets/translated_message.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
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

  Future<void> _shareInviteLink(Channel channel, String channelName, String lang) async {
    final channelId = channel.id;
    final user = StreamChat.of(context).currentUser;
    if (channelId == null || user == null) return;

    // Show loading
    if (!mounted) return;
    final alma = context.alma;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Center(
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: alma.cardBg,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(
                width: 24, height: 24,
                child: CircularProgressIndicator(strokeWidth: 2, color: AlmaTheme.electricBlue),
              ),
              const SizedBox(height: 12),
              Text(
                tr('invite.creating', lang),
                style: TextStyle(color: alma.textPrimary, fontSize: 14, decoration: TextDecoration.none),
              ),
            ],
          ),
        ),
      ),
    );

    bool dialogDismissed = false;
    try {
      final response = await http.post(
        Uri.parse('${Env.chatApiUrl}/api/create-invite'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': user.id,
          'channelId': channelId,
          'channelType': channel.type,
        }),
      );

      if (!mounted) return;
      Navigator.pop(context); // dismiss loading
      dialogDismissed = true;

      if (response.statusCode != 200) {
        throw Exception('Server error: ${response.statusCode}');
      }

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final inviteCode = data['code'] as String;
      final inviteUrl = data['inviteUrl'] as String;

      final shareText = tr('invite.message', lang, args: {
        'name': channelName,
        'link': inviteUrl,
      });

      if (!mounted) return;
      _showInviteBottomSheet(inviteCode, inviteUrl, shareText, lang);
    } catch (e) {
      if (mounted) {
        if (!dialogDismissed) Navigator.pop(context); // dismiss loading only if not yet dismissed
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(tr('invite.createFailed', lang)),
            backgroundColor: AlmaTheme.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    }
  }

  void _showInviteBottomSheet(String code, String inviteUrl, String shareText, String lang) {
    final alma = context.alma;
    showModalBottomSheet(
      context: context,
      backgroundColor: alma.cardBg,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: alma.textTertiary,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Text(
                tr('invite.title', lang),
                style: TextStyle(
                  color: alma.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              // Invite code display (large, prominent)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
                decoration: BoxDecoration(
                  color: alma.inputBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: AlmaTheme.electricBlue.withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  children: [
                    Text(
                      tr('invite.codeLabel', lang),
                      style: TextStyle(
                        color: alma.textTertiary,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      code,
                      style: const TextStyle(
                        color: AlmaTheme.electricBlue,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'monospace',
                        letterSpacing: 6,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      inviteUrl,
                      style: TextStyle(
                        color: alma.textTertiary,
                        fontSize: 11,
                        fontFamily: 'monospace',
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Copy button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: inviteUrl));
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(tr('invite.copied', lang)),
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  icon: const Icon(Icons.copy, size: 18),
                  label: Text(tr('invite.copyLink', lang)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: alma.textPrimary,
                    side: BorderSide(color: alma.borderDefault),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              // Share button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    SharePlus.instance.share(ShareParams(text: shareText));
                  },
                  icon: const Icon(Icons.share, size: 18),
                  label: Text(tr('invite.share', lang)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AlmaTheme.electricBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final channel = StreamChannel.of(context).channel;
    final currentUserId = StreamChat.of(context).currentUser?.id;
    final channelName = channel.extraData['name'] as String? ?? 'Chat';
    final langState = ref.watch(languageProvider);
    final lang = langState.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              channelName,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        actions: [
          // Share invite link
          IconButton(
            icon: const Icon(Icons.share_outlined, size: 20),
            onPressed: () => _shareInviteLink(channel, channelName, lang),
            tooltip: tr('invite.share', lang),
          ),
          MemberCountBadge(channel: channel),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          ConnectionBanner(lang: lang),
          Expanded(
            child: StreamMessageListView(
              scrollToBottomBuilder: (unreadCount, scrollToBottom) {
                final alma = context.alma;
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
