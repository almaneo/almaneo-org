import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart' hide User;
import 'package:web3auth_flutter/web3auth_flutter.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'config/env.dart';
import 'config/theme.dart';
import 'providers/language_provider.dart';
import 'services/auth_service.dart';
import 'services/notification_service.dart';
import 'screens/login_screen.dart';
import 'screens/channel_list_screen.dart';
import 'screens/chat_screen.dart';
import 'widgets/alma_logo.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 환경변수 로드
  await dotenv.load(fileName: '.env');

  // Firebase 초기화
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

  // Supabase 초기화
  await Supabase.initialize(
    url: Env.supabaseUrl,
    anonKey: Env.supabaseAnonKey,
  );

  // Web3Auth 초기화
  await _initWeb3Auth();

  // Stream Chat 클라이언트 생성
  final client = StreamChatClient(
    Env.streamApiKey,
    logLevel: Level.WARNING,
  );

  runApp(
    ProviderScope(
      child: AlmaChatApp(client: client),
    ),
  );
}

/// Web3Auth SDK 초기화
Future<void> _initWeb3Auth() async {
  try {
    late final Uri redirectUrl;
    if (Platform.isAndroid) {
      redirectUrl = Uri.parse('w3a://org.almaneo.alma_chat/auth');
    } else if (Platform.isIOS) {
      redirectUrl = Uri.parse('org.almaneo.almachat://auth');
    } else {
      return; // 데스크톱은 지원하지 않음
    }

    await Web3AuthFlutter.init(
      Web3AuthOptions(
        clientId: Env.web3authClientId,
        network: Network.sapphire_devnet,
        redirectUrl: redirectUrl,
        whiteLabel: WhiteLabelData(
          appName: 'AlmaChat',
          mode: ThemeModes.dark,
          defaultLanguage: Language.ko,
        ),
      ),
    );

    // 기존 세션 복원 시도
    await Web3AuthFlutter.initialize();
  } catch (e) {
    debugPrint('Web3Auth init: $e');
  }
}

class AlmaChatApp extends ConsumerStatefulWidget {
  final StreamChatClient client;

  const AlmaChatApp({super.key, required this.client});

  @override
  ConsumerState<AlmaChatApp> createState() => _AlmaChatAppState();
}

class _AlmaChatAppState extends ConsumerState<AlmaChatApp> {
  final _authService = AuthService();
  final _notificationService = NotificationService.instance;
  final _navigatorKey = GlobalKey<NavigatorState>();
  bool _isConnected = false;
  bool _isCheckingSession = true;

  @override
  void initState() {
    super.initState();
    _checkExistingSession();
  }

  /// 세션 복원 순서:
  /// 1. 로컬 저장소 (SharedPreferences) → 가장 빠르고 안정적
  /// 2. Web3Auth SDK 세션 → 소셜 로그인 사용자 (로컬 세션 없을 때)
  Future<void> _checkExistingSession() async {
    try {
      // 1단계: 로컬 저장 세션 복원 시도
      final restored = await _authService.restoreSession().timeout(
        const Duration(seconds: 8),
        onTimeout: () {
          debugPrint('Session restore: timeout (8s)');
          return null;
        },
      );

      if (restored != null) {
        // 언어 설정 복원
        final langNotifier = ref.read(languageProvider.notifier);
        langNotifier.setLanguage(restored.session.languageCode);

        await widget.client.connectUser(
          User(
            id: restored.session.userId,
            name: restored.session.userName,
            image: restored.session.profileImage,
            extraData: {'preferred_language': restored.session.languageCode},
          ),
          restored.token,
        );

        await _initNotifications();
        if (mounted) setState(() => _isConnected = true);
        debugPrint('Session restored from local storage: ${restored.session.userId}');
        return;
      }

      // 2단계: Web3Auth SDK 세션 복원 (소셜 로그인 사용자)
      await _tryWeb3AuthRestore().timeout(
        const Duration(seconds: 5),
        onTimeout: () {
          debugPrint('Web3Auth restore: timeout (5s)');
        },
      );
    } catch (e) {
      debugPrint('Session check error: $e');
    } finally {
      if (mounted) setState(() => _isCheckingSession = false);
    }
  }

  /// Web3Auth SDK 세션에서 복원 시도
  Future<void> _tryWeb3AuthRestore() async {
    final privKey = await Web3AuthFlutter.getPrivKey();
    if (privKey.isEmpty) return;

    final userInfo = await Web3AuthFlutter.getUserInfo();
    final verifierId = userInfo.verifierId ?? userInfo.email ?? '';
    if (verifierId.isEmpty) return;

    final name = userInfo.name ?? userInfo.email?.split('@')[0] ?? 'User';
    final langState = ref.read(languageProvider);
    await _handleSocialLogin(verifierId, name, userInfo.profileImage, langState.languageCode, privKey);
  }

  /// 게스트 로그인
  Future<void> _handleGuestLogin(String name) async {
    final langState = ref.read(languageProvider);
    final token = await _authService.loginAsGuest(name, langState.languageCode);

    await widget.client.connectUser(
      User(
        id: _authService.userId!,
        name: _authService.userName,
        extraData: {'preferred_language': langState.languageCode},
      ),
      token,
    );

    await _initNotifications();
    setState(() => _isConnected = true);
  }

  /// 소셜 로그인 (Web3Auth 인증 후)
  Future<void> _handleSocialLogin(String verifierId, String name, String? image, [String? lang, String? privateKey]) async {
    final langCode = lang ?? ref.read(languageProvider).languageCode;
    final token = await _authService.loginWithSocial(verifierId, name, image, langCode, privateKey);

    await widget.client.connectUser(
      User(
        id: _authService.userId!,
        name: name,
        image: image,
        extraData: {'preferred_language': langCode},
      ),
      token,
    );

    await _initNotifications();
    setState(() => _isConnected = true);
  }

  /// 푸시 알림 초기화
  Future<void> _initNotifications() async {
    try {
      _notificationService.onNotificationTap = _onNotificationTap;
      await _notificationService.initialize(
        widget.client,
        _authService.userId!,
      );
    } catch (e) {
      debugPrint('Notification init: $e');
    }
  }

  /// 알림 탭 → 해당 채널로 이동
  void _onNotificationTap(String channelCid) {
    final parts = channelCid.split(':');
    if (parts.length != 2) return;

    final channelType = parts[0];
    final channelId = parts[1];
    final channel = widget.client.channel(channelType, id: channelId);

    // 기존 ChatScreen이 있으면 제거하고 새 채널로 이동 (스택 쌓임 방지)
    _navigatorKey.currentState?.pushAndRemoveUntil(
      MaterialPageRoute(
        builder: (_) => StreamChannel(
          channel: channel,
          child: const ChatScreen(),
        ),
      ),
      (route) => route.isFirst, // ChannelListScreen만 남김
    );
  }

  Future<void> _handleLogout() async {
    _navigatorKey.currentState?.popUntil((route) => route.isFirst);

    // 알림 해제
    await _notificationService.unregister(widget.client);

    // Web3Auth 로그아웃
    if (_authService.isWeb3AuthUser) {
      try {
        await Web3AuthFlutter.logout();
      } catch (e) {
        debugPrint('Web3Auth logout: $e');
      }
    }

    await widget.client.disconnectUser();
    await _authService.logout(); // 로컬 세션도 삭제
    setState(() => _isConnected = false);
  }

  @override
  void dispose() {
    widget.client.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: _navigatorKey,
      title: 'AlmaChat',
      debugShowCheckedModeBanner: false,
      theme: AlmaTheme.darkTheme,
      builder: (context, child) {
        return StreamChat(
          client: widget.client,
          streamChatThemeData: AlmaTheme.streamTheme(context),
          child: child!,
        );
      },
      home: _isCheckingSession
          ? _buildSplash()
          : _isConnected
              ? ChannelListScreen(onLogout: _handleLogout, authService: _authService)
              : LoginScreen(
                  onGuestLogin: _handleGuestLogin,
                  onSocialLogin: _handleSocialLogin,
                ),
    );
  }

  Widget _buildSplash() {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [AlmaTheme.deepNavy, Color(0xFF1A1A2E), Color(0xFF0D1520)],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const AlmaLogo(size: 72),
              const SizedBox(height: 16),
              const Text(
                'AlmaChat',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 24),
              const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AlmaTheme.electricBlue,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
