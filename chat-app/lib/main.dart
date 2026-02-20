import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
import 'providers/theme_provider.dart';
import 'services/auth_service.dart';
import 'services/deep_link_service.dart';
import 'services/notification_service.dart';
import 'services/profile_service.dart';
import 'screens/login_screen.dart';
import 'screens/channel_list_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/home_screen.dart';
import 'screens/partner_list_screen.dart';
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

class _AlmaChatAppState extends ConsumerState<AlmaChatApp>
    with WidgetsBindingObserver {
  final _authService = AuthService();
  final _notificationService = NotificationService.instance;
  final _deepLinkService = DeepLinkService();
  final _navigatorKey = GlobalKey<NavigatorState>();
  bool _isConnected = false;
  bool _isCheckingSession = true;
  bool _isReconnecting = false; // 중복 재연결 방지 플래그
  StreamSubscription? _connectionStatusSub; // 단일 구독 유지
  ConnectionStatus _lastKnownStatus = ConnectionStatus.disconnected; // 마지막 연결 상태 캐시

  // 3-Tier 재연결 시스템
  Timer? _tier1WaitTimer;
  static const _tier1Duration = Duration(seconds: 30);

  int _softReconnectAttempts = 0;
  static const _maxSoftReconnectAttempts = 2;

  int _hardReconnectAttempts = 0;
  static const _maxHardReconnectAttempts = 3;
  static const _hardReconnectBackoffs = [
    Duration(seconds: 30),
    Duration(seconds: 60),
    Duration(seconds: 120),
  ];

  DateTime? _disconnectedSince;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this); // 앱 생명주기 감시 등록
    _checkExistingSession();
  }

  /// 앱 생명주기 변화 감지
  /// resumed: 포그라운드 복귀 시 WebSocket 끊겼으면 Tier 2 직접 시작
  /// (백그라운드에서 SDK 내부 재연결이 이미 소진되었으므로 Tier 1 건너뜀)
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && _isConnected && !_isReconnecting) {
      if (_lastKnownStatus == ConnectionStatus.disconnected) {
        debugPrint('[Lifecycle] App resumed — WebSocket disconnected, starting Tier 2');
        _attemptSoftReconnect();
      } else {
        debugPrint('[Lifecycle] App resumed — WebSocket status: $_lastKnownStatus (OK)');
      }
    }
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
        debugPrint('[Session] Restoring: userId=${restored.session.userId}, '
            'profileImage=${restored.session.profileImage ?? "null"}');

        // 언어 설정 복원
        final langNotifier = ref.read(languageProvider.notifier);
        langNotifier.setLanguage(restored.session.languageCode);

        await _connectUserWithRetry(
          User(
            id: restored.session.userId,
            name: restored.session.userName,
            extraData: {'preferred_language': restored.session.languageCode},
          ),
        );

        // DB에서 프로필 이미지 읽어 Stream에 동기화
        await _syncProfileImageFromDB();

        await _initNotifications();
        await _initDeepLinks();
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
    await _authService.loginAsGuest(name, langState.languageCode);

    try {
      await _connectUserWithRetry(
        User(
          id: _authService.userId!,
          name: _authService.userName,
          extraData: {'preferred_language': langState.languageCode},
        ),
      );

      await _syncProfileImageFromDB();
      await _initNotifications();
      await _initDeepLinks();
    } catch (e) {
      debugPrint('Guest login post-connect error: $e');
    }

    if (mounted) setState(() => _isConnected = true);
  }

  /// 소셜 로그인 (Web3Auth 인증 후)
  Future<void> _handleSocialLogin(String verifierId, String name, String? image, [String? lang, String? privateKey]) async {
    debugPrint('[SocialLogin] verifier=$verifierId, name=$name, '
        'socialAvatar=${image ?? "null"}');

    final langCode = lang ?? ref.read(languageProvider).languageCode;
    await _authService.loginWithSocial(verifierId, name, image, langCode, privateKey);

    try {
      await _connectUserWithRetry(
        User(
          id: _authService.userId!,
          name: name,
          extraData: {'preferred_language': langCode},
        ),
      );

      // DB에서 프로필 이미지 읽어 Stream에 동기화 (없으면 소셜 아바타 폴백)
      await _syncProfileImageFromDB(socialAvatar: image);

      await _initNotifications();
      await _initDeepLinks();
    } catch (e) {
      debugPrint('Social login post-connect error: $e');
      // 세션은 이미 저장됨 — Stream 연결 실패해도 홈 화면으로 진입
    }

    if (mounted) setState(() => _isConnected = true);
  }

  /// 프로필 이미지 동기화 — DB에서 읽어 Stream에 설정
  ///
  /// Single Source of Truth: Supabase chat_profiles 테이블
  /// DB에 없으면 소셜 아바타를 폴백으로 사용 (최초 로그인)
  Future<void> _syncProfileImageFromDB({String? socialAvatar}) async {
    if (_authService.userId == null) return;
    final userId = _authService.userId!;

    try {
      final dbImage = await ProfileService.getProfileImage(userId);

      if (dbImage != null && dbImage.isNotEmpty) {
        // DB에 이미지가 있으면 → Stream에 동기화
        final imageUrl = '$dbImage?v=${DateTime.now().millisecondsSinceEpoch}';
        await widget.client.partialUpdateUser(userId, set: {'image': imageUrl});
        _authService.setProfileImage(imageUrl);
        debugPrint('[ProfileImage] Synced from DB: $imageUrl');
      } else if (socialAvatar != null && socialAvatar.isNotEmpty) {
        // DB에 없고 소셜 아바타가 있으면 → 폴백 (최초 로그인)
        await widget.client.partialUpdateUser(userId, set: {'image': socialAvatar});
        _authService.setProfileImage(socialAvatar);
        debugPrint('[ProfileImage] Using social avatar fallback');
      }
    } catch (e) {
      debugPrint('[ProfileImage] DB sync failed: $e');
    }
  }

  /// Stream Chat 연결 — tokenProvider 방식 사용
  /// SDK가 401/토큰만료 시 자동으로 tokenProvider를 호출하여 토큰 갱신
  Future<void> _connectUserWithRetry(User user, {int retries = 1}) async {
    try {
      await widget.client.connectUserWithProvider(
        user,
        (userId) async {
          final freshToken = await _authService.refreshToken();
          if (freshToken == null) {
            throw Exception('Failed to refresh Stream token');
          }
          return freshToken;
        },
      );
    } catch (e) {
      debugPrint('connectUserWithProvider failed: $e');
      if (retries > 0) {
        debugPrint('Retrying connection...');
        await Future.delayed(const Duration(seconds: 2));
        return _connectUserWithRetry(user, retries: retries - 1);
      }
      rethrow;
    }

    // WebSocket 상태 감시 — 기존 구독 취소 후 재등록 (중복 방지)
    _listenConnectionStatus();
  }

  /// 3-Tier 재연결 전략:
  /// Tier 1 (0-30초): SDK 내부 재연결에 맡김 — 아무것도 하지 않음
  /// Tier 2 (30-60초): Soft reconnect — closeConnection + openConnection (유저/토큰 보존)
  /// Tier 3 (60초+): Hard reconnect — disconnectUser + connectUserWithProvider (최후 수단, 최대 3회)
  void _listenConnectionStatus() {
    _connectionStatusSub?.cancel();
    _connectionStatusSub = widget.client.wsConnectionStatusStream.listen((status) {
      _lastKnownStatus = status; // 상태 캐시 업데이트

      if (status == ConnectionStatus.connected) {
        // 연결 복구 — 모든 재연결 상태 리셋
        _onConnectionRestored();
        return;
      }

      if (status == ConnectionStatus.connecting) {
        // SDK가 재연결 시도 중 — 간섭하지 않음
        debugPrint('[Reconnect] SDK reconnecting... (Tier 1 active)');
        return;
      }

      // disconnected — Tier 1 타이머 시작
      if (_isConnected && !_isReconnecting) {
        _disconnectedSince ??= DateTime.now();
        _tier1WaitTimer?.cancel();
        _tier1WaitTimer = Timer(_tier1Duration, () {
          // 30초 후에도 여전히 disconnected면 Tier 2로 에스컬레이션
          if (_lastKnownStatus != ConnectionStatus.connected && _isConnected && !_isReconnecting) {
            debugPrint('[Reconnect] Tier 1 expired (30s) — escalating to Tier 2');
            _attemptSoftReconnect();
          }
        });
        debugPrint('[Reconnect] Disconnected — Tier 1 started (waiting 30s for SDK auto-reconnect)');
      }
    });
  }

  /// 연결 복구 시 모든 재연결 상태 리셋
  void _onConnectionRestored() {
    _tier1WaitTimer?.cancel();
    _softReconnectAttempts = 0;
    _hardReconnectAttempts = 0;
    _isReconnecting = false;
    _disconnectedSince = null;
    debugPrint('[Reconnect] Connection restored — all counters reset');
  }

  /// Tier 2: 비파괴적 재연결 — closeConnection + openConnection
  /// 유저/토큰을 보존한 상태에서 WebSocket만 재연결
  /// 백엔드 HTTP 요청 불필요 (가장 중요한 차이)
  Future<void> _attemptSoftReconnect() async {
    if (_isReconnecting) return;
    _isReconnecting = true;

    while (_softReconnectAttempts < _maxSoftReconnectAttempts) {
      _softReconnectAttempts++;
      debugPrint('[Reconnect] Tier 2 attempt $_softReconnectAttempts/$_maxSoftReconnectAttempts');

      try {
        widget.client.closeConnection();
        await Future.delayed(const Duration(seconds: 1));
        await widget.client.openConnection();

        // 리스너 재등록 (closeConnection 후 필요)
        _listenConnectionStatus();

        // 연결 성공 확인 대기 (최대 10초)
        final connected = await _waitForConnection(const Duration(seconds: 10));
        if (connected) {
          debugPrint('[Reconnect] Tier 2 succeeded on attempt $_softReconnectAttempts');
          _onConnectionRestored();
          return;
        }
      } catch (e) {
        debugPrint('[Reconnect] Tier 2 attempt $_softReconnectAttempts failed: $e');
      }

      // 실패 시 5초 대기 후 재시도
      if (_softReconnectAttempts < _maxSoftReconnectAttempts) {
        await Future.delayed(const Duration(seconds: 5));
        // 대기 중 연결이 복구되면 중단
        if (_lastKnownStatus == ConnectionStatus.connected) {
          _onConnectionRestored();
          return;
        }
      }
    }

    // Tier 2 실패 — Tier 3로 에스컬레이션
    debugPrint('[Reconnect] Tier 2 exhausted — escalating to Tier 3');
    _isReconnecting = false;
    _attemptHardReconnect();
  }

  /// Tier 3: 파괴적 재연결 — disconnectUser + connectUserWithProvider
  /// 최후 수단, 최대 3회, 지수 백오프 (30초, 60초, 120초)
  Future<void> _attemptHardReconnect() async {
    if (_isReconnecting) return;
    _isReconnecting = true;

    while (_hardReconnectAttempts < _maxHardReconnectAttempts) {
      final attempt = _hardReconnectAttempts;
      _hardReconnectAttempts++;
      debugPrint('[Reconnect] Tier 3 attempt $_hardReconnectAttempts/$_maxHardReconnectAttempts');

      try {
        final userId = _authService.userId;
        if (userId == null) {
          debugPrint('[Reconnect] Tier 3 — no userId, aborting');
          _isReconnecting = false;
          return;
        }

        // 기존 연결 해제
        try {
          await widget.client.disconnectUser();
        } catch (e) {
          debugPrint('[Reconnect] disconnectUser: $e');
        }

        // 새 토큰 발급 (백엔드 HTTP 요청)
        final newToken = await _authService.refreshToken();
        if (newToken == null) {
          debugPrint('[Reconnect] Token refresh returned null');
          // 백오프 후 재시도
        } else {
          await widget.client.connectUserWithProvider(
            User(id: userId, name: _authService.userName),
            (uid) async {
              final t = await _authService.refreshToken();
              if (t == null) throw Exception('Token refresh failed');
              return t;
            },
          );

          // 리스너 재등록 (기존 누락 수정)
          _listenConnectionStatus();

          await _syncProfileImageFromDB();
          debugPrint('[Reconnect] Tier 3 succeeded on attempt $_hardReconnectAttempts');
          _onConnectionRestored();
          return;
        }
      } catch (e) {
        debugPrint('[Reconnect] Tier 3 attempt $_hardReconnectAttempts failed: $e');
      }

      // 지수 백오프 대기
      if (_hardReconnectAttempts < _maxHardReconnectAttempts) {
        final backoff = _hardReconnectBackoffs[attempt];
        debugPrint('[Reconnect] Tier 3 backoff: ${backoff.inSeconds}s');
        await Future.delayed(backoff);
        // 백오프 대기 중 연결 복구 시 중단
        if (_lastKnownStatus == ConnectionStatus.connected) {
          _onConnectionRestored();
          return;
        }
      }
    }

    // 모든 시도 소진 (~4분 후)
    debugPrint('[Reconnect] All tiers exhausted after $_hardReconnectAttempts hard attempts. Giving up.');
    _isReconnecting = false;
  }

  /// 연결 상태가 connected가 될 때까지 대기 (최대 timeout)
  Future<bool> _waitForConnection(Duration timeout) async {
    final deadline = DateTime.now().add(timeout);
    while (DateTime.now().isBefore(deadline)) {
      if (_lastKnownStatus == ConnectionStatus.connected) return true;
      await Future.delayed(const Duration(milliseconds: 500));
    }
    return _lastKnownStatus == ConnectionStatus.connected;
  }

  /// 딥링크 서비스 초기화 (almachat://invite/{code})
  Future<void> _initDeepLinks() async {
    _deepLinkService.userId = _authService.userId;
    _deepLinkService.onJoinChannel = _onDeepLinkJoin;
    _deepLinkService.onError = _onDeepLinkError;
    await _deepLinkService.initialize();
  }

  /// 딥링크로 채널 참여 성공 시 → 채널로 이동
  void _onDeepLinkJoin(String channelId, String channelType) async {
    try {
      final channel = widget.client.channel(channelType, id: channelId);
      await channel.watch();

      _navigatorKey.currentState?.push(
        MaterialPageRoute(
          builder: (_) => StreamChannel(
            channel: channel,
            child: const ChatScreen(),
          ),
        ),
      );
    } catch (e) {
      debugPrint('[DeepLink] Navigate error: $e');
    }
  }

  /// 딥링크 에러 → SnackBar 표시
  void _onDeepLinkError(String errorType) {
    final context = _navigatorKey.currentContext;
    if (context == null) return;

    String message;
    switch (errorType) {
      case 'invalid_code':
        message = 'Invalid invite code';
      case 'expired_code':
        message = 'Invite code has expired';
      default:
        message = 'Failed to join channel';
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AlmaTheme.error,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
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
    WidgetsBinding.instance.removeObserver(this); // 생명주기 감시 해제
    _tier1WaitTimer?.cancel();
    _connectionStatusSub?.cancel();
    _deepLinkService.dispose();
    widget.client.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeState = ref.watch(themeProvider);
    final almaColors = themeState.isDark ? AlmaTheme.darkColors : AlmaTheme.lightColors;
    final brightness = themeState.isDark ? Brightness.dark : Brightness.light;

    return MaterialApp(
      navigatorKey: _navigatorKey,
      title: 'AlmaChat',
      debugShowCheckedModeBanner: false,
      theme: AlmaTheme.theme(almaColors),
      builder: (context, child) {
        return StreamChat(
          client: widget.client,
          streamChatThemeData: AlmaTheme.streamTheme(context, brightness: brightness),
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
    final themeState = ref.read(themeProvider);
    final isDark = themeState.isDark;
    final colors = isDark ? AlmaTheme.darkColors : AlmaTheme.lightColors;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: isDark
              ? const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AlmaTheme.deepNavy, Color(0xFF1A1A2E), Color(0xFF0D1520)],
                )
              : LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [colors.scaffold, colors.surface, colors.surfaceVariant],
                ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const AlmaLogo(size: 72),
              const SizedBox(height: 16),
              Text(
                'AlmaChat',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: colors.textPrimary,
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

/// Bottom navigation shell with 4 tabs: Home | Chat | Partners | Profile
class _MainShell extends ConsumerStatefulWidget {
  final VoidCallback onLogout;
  final AuthService authService;

  const _MainShell({required this.onLogout, required this.authService});

  @override
  ConsumerState<_MainShell> createState() => _MainShellState();
}

class _MainShellState extends ConsumerState<_MainShell> {
  int _currentIndex = 1; // Start on Chat tab
  DateTime? _lastBackPress;
  StreamSubscription? _userSub;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Stream 사용자 프로필 변경 시 하단 네비 프로필 아이콘 갱신
    _userSub?.cancel();
    _userSub = StreamChat.of(context).client.state.currentUserStream.listen((_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _userSub?.cancel();
    super.dispose();
  }

  Widget _buildProfileIcon({required bool isActive}) {
    final user = StreamChat.of(context).currentUser;
    final imageUrl = user?.image;
    final hasImage = imageUrl != null && imageUrl.isNotEmpty;
    final colors = context.alma;

    if (hasImage) {
      return Container(
        width: 26,
        height: 26,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: isActive
                ? AlmaTheme.electricBlue
                : colors.textTertiary,
            width: 1.5,
          ),
        ),
        child: ClipOval(
          child: Image.network(
            imageUrl,
            width: 26,
            height: 26,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stack) => Icon(
              isActive ? Icons.person : Icons.person_outline,
              size: 20,
            ),
          ),
        ),
      );
    }
    return Icon(isActive ? Icons.person : Icons.person_outline);
  }

  Widget _buildChatIcon({required bool isActive}) {
    final icon = Icon(
      isActive ? Icons.chat_bubble : Icons.chat_bubble_outline,
    );
    return StreamBuilder<int>(
      stream: StreamChat.of(context).client.state.totalUnreadCountStream,
      initialData: StreamChat.of(context).client.state.totalUnreadCount,
      builder: (context, snapshot) {
        final count = snapshot.data ?? 0;
        if (count == 0) return icon;
        return Badge(
          label: Text(
            count > 99 ? '99+' : '$count',
            style: const TextStyle(fontSize: 10, color: Colors.white),
          ),
          backgroundColor: AlmaTheme.error,
          child: icon,
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (didPop) return;

        // 채팅 탭(1)이 아니면 채팅 탭으로 이동
        if (_currentIndex != 1) {
          setState(() => _currentIndex = 1);
          return;
        }

        // 채팅 탭에서 2초 내 두 번 누르면 앱 종료
        final now = DateTime.now();
        if (_lastBackPress != null &&
            now.difference(_lastBackPress!) < const Duration(seconds: 2)) {
          SystemNavigator.pop(); // 앱 종료
          return;
        }
        _lastBackPress = now;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(tr('app.pressBackToExit', lang)),
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 2),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        );
      },
      child: Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          const HomeScreen(),
          ChannelListScreen(
            onLogout: widget.onLogout,
            authService: widget.authService,
          ),
          const PartnerListScreen(),
          ProfileScreen(
            onLogout: widget.onLogout,
            authService: widget.authService,
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: context.alma.navBg,
          border: Border(
            top: BorderSide(color: context.alma.navBorder),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: AlmaTheme.electricBlue,
          unselectedItemColor: context.alma.textTertiary,
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
              icon: _buildChatIcon(isActive: false),
              activeIcon: _buildChatIcon(isActive: true),
              label: tr('nav.chat', lang),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.storefront_outlined),
              activeIcon: const Icon(Icons.storefront),
              label: tr('nav.partners', lang),
            ),
            BottomNavigationBarItem(
              icon: _buildProfileIcon(isActive: false),
              activeIcon: _buildProfileIcon(isActive: true),
              label: tr('nav.profile', lang),
            ),
          ],
        ),
      ),
    ),  // PopScope child: Scaffold end
    );  // PopScope end
  }
}
