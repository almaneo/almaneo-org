import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../providers/language_provider.dart';
import '../widgets/translated_message.dart';

class ChatScreen extends ConsumerWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final channel = StreamChannel.of(context).channel;
    final channelName = channel.extraData['name'] as String? ?? 'Chat';
    final langState = ref.watch(languageProvider);

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
              'Translating to ${langState.language.nativeName} ${langState.language.flag}',
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
      ),
      body: Column(
        children: [
          Expanded(
            child: StreamMessageListView(
              messageBuilder: (context, details, messages, defaultWidget) {
                return TranslatedMessage(
                  message: details.message,
                  isMyMessage: details.isMyMessage,
                );
              },
            ),
          ),
          const StreamMessageInput(),
        ],
      ),
    );
  }
}
