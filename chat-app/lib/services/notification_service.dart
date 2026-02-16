import 'dart:async';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';

/// 백그라운드 메시지 핸들러 — top-level 함수여야 합니다.
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // FCM이 시스템 알림을 자동 표시하므로 추가 처리 불필요
  debugPrint('[Notification] Background message: ${message.messageId}');
}

/// FCM + flutter_local_notifications 기반 알림 서비스
class NotificationService {
  static final instance = NotificationService._();
  NotificationService._();

  static final _fcm = FirebaseMessaging.instance;
  static final _localNotifications = FlutterLocalNotificationsPlugin();

  static const _channelId = 'alma_chat_messages';
  static const _channelName = 'Chat Messages';

  StreamSubscription? _messageSubscription;
  String? _currentUserId;
  String? _activeChannelCid;

  /// 알림 탭 시 채널로 이동하는 콜백
  void Function(String channelCid)? onNotificationTap;

  /// FCM 초기화 + 로컬 알림 채널 설정 + Stream Chat 디바이스 등록
  Future<void> initialize(StreamChatClient client, String userId) async {
    _currentUserId = userId;

    // 1. 알림 권한 요청 (Android 13+, iOS)
    final settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus != AuthorizationStatus.authorized &&
        settings.authorizationStatus != AuthorizationStatus.provisional) {
      debugPrint('[Notification] Permission denied');
      return;
    }

    // 2. FCM 토큰 발급 + Stream Chat에 등록
    final token = await _fcm.getToken();
    if (token != null) {
      await client.addDevice(token, PushProvider.firebase,
          pushProviderName: 'almachat');
      debugPrint('[Notification] FCM token registered');
    }

    // 3. 토큰 리프레시 리스너
    _fcm.onTokenRefresh.listen((newToken) {
      client.addDevice(newToken, PushProvider.firebase,
          pushProviderName: 'almachat');
    });

    // 4. 로컬 알림 초기화 (포그라운드 알림 표시용)
    await _initLocalNotifications();

    // 5. 포그라운드 메시지 핸들러 (FCM data-only messages)
    FirebaseMessaging.onMessage.listen(_handleForegroundFCM);

    // 6. 알림 탭으로 앱 열렸을 때
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

    // 앱이 종료 상태에서 알림으로 열렸을 때
    final initialMessage = await _fcm.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }

    // 7. Stream Chat 새 메시지 이벤트 → 로컬 알림 (포그라운드)
    _messageSubscription = client
        .on(EventType.messageNew)
        .listen(_handleStreamMessage);
  }

  /// 로컬 알림 플러그인 초기화
  Future<void> _initLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );

    await _localNotifications.initialize(
      const InitializationSettings(android: androidSettings),
      onDidReceiveNotificationResponse: (response) {
        final payload = response.payload;
        if (payload != null && onNotificationTap != null) {
          onNotificationTap!(payload);
        }
      },
    );

    // Android 알림 채널 생성
    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(const AndroidNotificationChannel(
          _channelId,
          _channelName,
          importance: Importance.high,
          playSound: true,
        ));
  }

  /// Stream Chat 새 메시지 이벤트 → 로컬 알림 표시
  void _handleStreamMessage(Event event) {
    final message = event.message;
    if (message == null) return;

    // 내 메시지 무시
    if (message.user?.id == _currentUserId) return;

    // 현재 보고 있는 채널이면 무시
    if (event.cid != null && event.cid == _activeChannelCid) return;

    final senderName = message.user?.name ?? 'Unknown';
    final text = message.text;
    final body = (text != null && text.isNotEmpty) ? text : '📷';

    _showLocalNotification(
      title: senderName,
      body: body,
      channelCid: event.cid ?? '',
    );
  }

  /// FCM 포그라운드 메시지 → 로컬 알림 표시
  void _handleForegroundFCM(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    // Stream Chat에서 보낸 FCM인 경우 채널 정보 추출
    final channelCid = message.data['channel_cid'] as String? ??
        message.data['cid'] as String? ?? '';

    // 현재 보고 있는 채널이면 무시
    if (channelCid.isNotEmpty && channelCid == _activeChannelCid) return;

    _showLocalNotification(
      title: notification.title ?? 'AlmaChat',
      body: notification.body ?? '',
      channelCid: channelCid,
    );
  }

  /// 알림 탭으로 앱이 열렸을 때
  void _handleNotificationTap(RemoteMessage message) {
    final channelCid = message.data['channel_cid'] as String? ??
        message.data['cid'] as String? ?? '';
    if (channelCid.isNotEmpty && onNotificationTap != null) {
      onNotificationTap!(channelCid);
    }
  }

  /// 로컬 알림 표시
  Future<void> _showLocalNotification({
    required String title,
    required String body,
    required String channelCid,
  }) async {
    await _localNotifications.show(
      channelCid.hashCode, // 채널별 고유 ID (같은 채널은 알림 갱신)
      title,
      body,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          _channelId,
          _channelName,
          importance: Importance.high,
          priority: Priority.high,
          playSound: true,
        ),
      ),
      payload: channelCid,
    );
  }

  /// 현재 보고 있는 채널 설정 (ChatScreen 진입/퇴장 시 호출)
  void setActiveChannel(String? cid) {
    _activeChannelCid = cid;
    // 해당 채널의 기존 알림 제거
    if (cid != null) {
      _localNotifications.cancel(cid.hashCode);
    }
  }

  /// 로그아웃 시 정리
  Future<void> unregister(StreamChatClient client) async {
    _messageSubscription?.cancel();
    _messageSubscription = null;
    _currentUserId = null;
    _activeChannelCid = null;

    final token = await _fcm.getToken();
    if (token != null) {
      try {
        await client.removeDevice(token);
      } catch (_) {}
    }

    await _localNotifications.cancelAll();
  }
}
