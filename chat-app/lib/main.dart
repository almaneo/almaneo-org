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
import 'l10n/app_strings.dart';
import 'providers/language_provider.dart';
import 'services/auth_service.dart';
import 'services/notification_service.dart';
import 'screens/login_screen.dart';
import 'screens/channel_list_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/home_screen.dart';
import 'screens/profile_screen.dart';
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

        await _connectUserWithRetry(
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

    await _connectUserWithRetry(
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

    await _connectUserWithRetry(
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

  /// Stream Chat 연결 (401 등 간헐적 에러 시 1회 재시도)
  Future<void> _connectUserWithRetry(User user, String token, {int retries = 1}) async {
    try {
      await widget.client.connectUser(user, token);
    } catch (e) {
      debugPrint('connectUser failed: $e');
      if (retries > 0 && e.toString().contains('401')) {
        debugPrint('Retrying connectUser after 401...');
        await Future.delayed(const Duration(seconds: 1));
        // 토큰 재발급 후 재시도
        final newToken = await _authService.refreshToken();
        if (newToken != null) {
          await widget.client.connectUser(user, newToken);
        } else {
          rethrow;
        }
      } else {
        rethrow;
      }
    }
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
              ? _MainShell(onLogout: _handleLogout, authService: _authService)
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

/// Bottom navigation shell with 3 tabs: Home | Chat | Profile
class _MainShell extends ConsumerStatefulWidget {
  final VoidCallback onLogout;
  final AuthService authService;

  const _MainShell({required this.onLogout, required this.authService});

  @override
  ConsumerState<_MainShell> createState() => _MainShellState();
}

class _MainShellState extends ConsumerState<_MainShell> {
  int _currentIndex = 1; // Start on Chat tab

  Widget _buildProfileIcon({required bool isActive}) {
    final user = StreamChat.of(context).currentUser;
    final imageUrl = user?.image;
    final hasImage = imageUrl != null && imageUrl.isNotEmpty;

    if (hasImage) {
      return Container(
        width: 26,
        height: 26,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: isActive
                ? AlmaTheme.electricBlue
                : Colors.white.withValues(alpha: 0.2),
            width: 1.5,
          ),
        ),
        child: ClipOval(
          child: Image.network(
            imageUrl,
            width: 26,
            height: 26,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Icon(
              isActive ? Icons.person : Icons.person_outline,
              size: 20,
            ),
          ),
        ),
      );
    }
    return Icon(isActive ? Icons.person : Icons.person_outline);
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          const HomeScreen(),
          ChannelListScreen(
            onLogout: widget.onLogout,
            authService: widget.authService,
          ),
          ProfileScreen(
            onLogout: widget.onLogout,
            authService: widget.authService,
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AlmaTheme.deepNavy,
          border: Border(
            top: BorderSide(
              color: Colors.white.withValues(alpha: 0.05),
            ),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: AlmaTheme.electricBlue,
          unselectedItemColor: Colors.white.withValues(alpha: 0.35),
          selectedFontSize: 11,
          unselectedFontSize: 11,
          type: BottomNavigationBarType.fixed,
          items: [
            BottomNavigationBarItem(
              icon: const Icon(Icons.home_outlined),
              activeIcon: const Icon(Icons.home),
              label: tr('nav.home', lang),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.chat_bubble_outline),
              activeIcon: const Icon(Icons.chat_bubble),
              label: tr('nav.chat', lang),
            ),
            BottomNavigationBarItem(
              icon: _buildProfileIcon(isActive: false),
              activeIcon: _buildProfileIcon(isActive: true),
              label: tr('nav.profile', lang),
            ),
          ],
        ),
      ),
    );
  }
}
