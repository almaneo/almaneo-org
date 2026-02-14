import 'package:flutter/material.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../widgets/translated_message.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final channel = StreamChannel.of(context).channel;
    final channelName = channel.extraData['name'] as String? ?? 'Chat';

    return Scaffold(
      appBar: StreamChannelHeader(
        title: Text(
          channelName,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        showBackButton: true,
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
