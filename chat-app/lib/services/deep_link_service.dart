import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:app_links/app_links.dart';
import '../config/env.dart';

/// Handles `almachat://invite/{code}` deep links.
///
/// Usage:
/// 1. Call [initialize] once during app startup (after login).
/// 2. Provide [onJoinChannel] callback to navigate to the joined channel.
/// 3. Call [dispose] when no longer needed.
class DeepLinkService {
  final AppLinks _appLinks = AppLinks();
  StreamSubscription? _linkSub;

  /// Callback: (channelId, channelType) → navigate to the channel
  void Function(String channelId, String channelType)? onJoinChannel;

  /// Callback: (error message) → show error to user
  void Function(String message)? onError;

  /// Current user ID (set after login)
  String? userId;

  /// Initialize deep link listening.
  /// Handles both cold-start (initial link) and warm-start (stream) links.
  Future<void> initialize() async {
    // Handle cold start — app was opened via deep link
    try {
      final initialUri = await _appLinks.getInitialLink();
      if (initialUri != null) {
        _handleUri(initialUri);
      }
    } catch (e) {
      debugPrint('[DeepLink] Initial link error: $e');
    }

    // Listen for incoming links while app is running
    _linkSub = _appLinks.uriLinkStream.listen(
      _handleUri,
      onError: (e) => debugPrint('[DeepLink] Stream error: $e'),
    );
  }

  void _handleUri(Uri uri) {
    debugPrint('[DeepLink] Received: $uri');

    // Support both almachat://invite/{code} and https://chat.almaneo.org/invite/{code}
    if (uri.pathSegments.length >= 2 && uri.pathSegments[0] == 'invite') {
      final code = uri.pathSegments[1];
      if (code.isNotEmpty) {
        _joinByCode(code);
      }
    } else if (uri.pathSegments.length == 1 && uri.pathSegments[0].isNotEmpty) {
      // almachat://invite?code=ABC123 (query param fallback)
      final code = uri.queryParameters['code'];
      if (uri.pathSegments[0] == 'invite' && code != null && code.isNotEmpty) {
        _joinByCode(code);
      }
    }
  }

  Future<void> _joinByCode(String code) async {
    if (userId == null) {
      debugPrint('[DeepLink] No userId — cannot join');
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('${Env.chatApiUrl}/api/join-invite'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'code': code.toUpperCase(),
        }),
      );

      final data = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode != 200) {
        final errorType = data['error'] as String? ?? '';
        onError?.call(errorType);
        return;
      }

      final channelId = data['channelId'] as String;
      final channelType = data['channelType'] as String? ?? 'messaging';

      onJoinChannel?.call(channelId, channelType);
    } catch (e) {
      debugPrint('[DeepLink] Join error: $e');
      onError?.call('join_failed');
    }
  }

  void dispose() {
    _linkSub?.cancel();
  }
}
