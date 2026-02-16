import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart' hide Provider;
import 'package:web3auth_flutter/web3auth_flutter.dart';
import 'package:web3auth_flutter/enums.dart';
import 'package:web3auth_flutter/input.dart';
import 'package:web3auth_flutter/output.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/web3auth_session.dart';
import 'settings_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  final Future<void> Function(String name) onGuestLogin;
  final Future<void> Function(String verifierId, String name, String? image, [String? lang]) onSocialLogin;

  const LoginScreen({
    super.key,
    required this.onGuestLogin,
    required this.onSocialLogin,
  });

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with TickerProviderStateMixin, WidgetsBindingObserver {
  static const _redirectChannel = MethodChannel('org.almaneo.alma_chat/web3auth_redirect');

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _pageController = PageController();
  bool _isLoading = false;
  String? _error;
  String? _loadingProvider; // 어떤 소셜 로그인 중인지
  int _currentPage = 0;
  bool _showLogin = false;
  bool _loginCompletedViaRedirect = false;

  Timer? _autoAdvanceTimer;

  late final AnimationController _fadeController;
  late final Animation<double> _fadeAnimation;

  String get _lang => ref.read(languageProvider).languageCode;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _setupRedirectChannel();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeInOut,
    );
    _startAutoAdvance();
  }

  @override
  void didChangeAppLifecycleState(final AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (_isLoading && _loadingProvider != null && _loadingProvider != 'guest') {
        // 소셜 로그인 진행 중 — setCustomTabsClosed() 호출 금지.
        // 내부에서 setResultUrl(null)로 세션 데이터를 지우기 때문.
        return;
      }
      Web3AuthFlutter.setCustomTabsClosed();
    }
  }

  void _startAutoAdvance() {
    _autoAdvanceTimer?.cancel();
    _autoAdvanceTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (_showLogin || !mounted) {
        timer.cancel();
        return;
      }
      if (_currentPage < 2) {
        _pageController.nextPage(
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  void _goToLogin() {
    _autoAdvanceTimer?.cancel();
    setState(() => _showLogin = true);
    _fadeController.forward();
  }

  // ── MethodChannel: 네이티브에서 redirect URL 수신 ──

  void _setupRedirectChannel() {
    _redirectChannel.setMethodCallHandler((call) async {
      if (call.method == 'onRedirectUrl') {
        final url = call.arguments as String;
        debugPrint('[Web3Auth] Redirect URL received');
        _handleNativeRedirect(url);
      }
    });
  }

  /// 네이티브에서 redirect URL 수신 → 직접 세션 복구 후 로그인 완료.
  Future<void> _handleNativeRedirect(String url) async {
    // Chrome Custom Tab이 닫힐 때까지 짧게 대기
    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;

    try {
      final sessionData = await Web3AuthSessionRecovery.recoverSession(url);

      if (sessionData != null) {
        final userInfo = sessionData['userInfo'] as Map<String, dynamic>?;
        if (userInfo != null) {
          final verifierId = (userInfo['verifierId'] as String?) ??
              (userInfo['email'] as String?) ??
              '';
          final name = (userInfo['name'] as String?) ??
              (userInfo['email'] as String?)?.split('@')[0] ??
              'User';
          final image = userInfo['profileImage'] as String?;

          if (verifierId.isNotEmpty) {
            debugPrint('[Web3Auth] Session recovered: $verifierId');
            _completeRedirectLogin(verifierId, name, image);
            return;
          }
        }
      }

      // 직접 복구 실패 — SDK 폴백 시도
      await _trySDKFallback();
    } catch (e) {
      debugPrint('[Web3Auth] handleNativeRedirect error: $e');
    }
  }

  /// 직접 세션 복구 실패 시 SDK를 통한 폴백 시도
  Future<void> _trySDKFallback() async {
    try {
      await Web3AuthFlutter.initialize();
      final privKey = await Web3AuthFlutter.getPrivKey();
      if (privKey.isNotEmpty) {
        final userInfo = await Web3AuthFlutter.getUserInfo();
        final verifierId = userInfo.verifierId ?? userInfo.email ?? '';
        if (verifierId.isNotEmpty) {
          final name = userInfo.name ?? userInfo.email?.split('@')[0] ?? 'User';
          debugPrint('[Web3Auth] SDK fallback succeeded: $verifierId');
          _completeRedirectLogin(verifierId, name, userInfo.profileImage);
          return;
        }
      }
    } catch (e) {
      debugPrint('[Web3Auth] SDK fallback failed: $e');
    }
  }

  /// redirect 기반 로그인 완료 처리 (상태 업데이트 + 콜백)
  void _completeRedirectLogin(String verifierId, String name, String? image) {
    _loginCompletedViaRedirect = true;
    if (mounted) {
      setState(() {
        _isLoading = false;
        _loadingProvider = null;
      });
    }
    widget.onSocialLogin(verifierId, name, image);
  }

  // ── 소셜 로그인 ──

  Future<void> _loginWithGoogle() => _loginWithProvider(Provider.google, 'google');
  Future<void> _loginWithApple() => _loginWithProvider(Provider.apple, 'apple');

  Future<void> _loginWithProvider(Provider provider, String label) async {
    setState(() {
      _isLoading = true;
      _loadingProvider = label;
      _error = null;
      _loginCompletedViaRedirect = false;
    });

    try {
      final response = await Web3AuthFlutter.login(
        LoginParams(loginProvider: provider),
      ).timeout(
        const Duration(seconds: 60),
        onTimeout: () => throw TimeoutException('Login timeout'),
      );
      if (_loginCompletedViaRedirect) return;
      await _handleWeb3AuthResponse(response);
    } on TimeoutException {
      if (_loginCompletedViaRedirect) return;
      final recovered = await _tryRecoverSession();
      if (!recovered && mounted && !_loginCompletedViaRedirect) {
        setState(() => _error = tr('login.timeout', _lang));
      }
    } on UserCancelledException {
      if (_loginCompletedViaRedirect) return;
    } catch (e) {
      if (_loginCompletedViaRedirect) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted && !_loginCompletedViaRedirect) {
        setState(() {
          _isLoading = false;
          _loadingProvider = null;
        });
      }
    }
  }

  /// 타임아웃 후 SDK 세션이 생성되었는지 재확인 (최대 3회)
  Future<bool> _tryRecoverSession() async {
    for (int attempt = 1; attempt <= 3; attempt++) {
      try {
        if (attempt > 1) await Web3AuthFlutter.initialize();

        final privKey = await Web3AuthFlutter.getPrivKey();
        if (privKey.isNotEmpty) {
          final userInfo = await Web3AuthFlutter.getUserInfo();
          final verifierId = userInfo.verifierId ?? userInfo.email ?? '';
          if (verifierId.isNotEmpty) {
            final name = userInfo.name ?? userInfo.email?.split('@')[0] ?? 'User';
            await widget.onSocialLogin(verifierId, name, userInfo.profileImage);
            return true;
          }
        }

        if (attempt < 3) await Future.delayed(const Duration(seconds: 2));
      } catch (_) {
        if (attempt < 3) await Future.delayed(const Duration(seconds: 2));
      }
    }
    return false;
  }

  Future<void> _loginWithEmail() async {
    final email = _emailController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _error = tr('login.invalidEmail', _lang));
      return;
    }

    setState(() {
      _isLoading = true;
      _loadingProvider = 'email';
      _error = null;
    });

    try {
      final response = await Web3AuthFlutter.login(
        LoginParams(
          loginProvider: Provider.email_passwordless,
          extraLoginOptions: ExtraLoginOptions(login_hint: email),
        ),
      ).timeout(
        const Duration(seconds: 60),
        onTimeout: () => throw TimeoutException('Login timeout'),
      );
      if (_loginCompletedViaRedirect) return;
      await _handleWeb3AuthResponse(response);
    } on TimeoutException {
      if (_loginCompletedViaRedirect) return;
      final recovered = await _tryRecoverSession();
      if (!recovered && mounted && !_loginCompletedViaRedirect) {
        setState(() => _error = tr('login.timeout', _lang));
      }
    } on UserCancelledException {
      if (_loginCompletedViaRedirect) return;
    } catch (e) {
      if (_loginCompletedViaRedirect) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted && !_loginCompletedViaRedirect) {
        setState(() {
          _isLoading = false;
          _loadingProvider = null;
        });
      }
    }
  }

  Future<void> _handleWeb3AuthResponse(Web3AuthResponse response) async {
    final userInfo = response.userInfo;
    if (userInfo == null) throw Exception('No user info');

    final verifierId = userInfo.verifierId ?? userInfo.email ?? '';
    if (verifierId.isEmpty) throw Exception('No verifier ID');

    final name = userInfo.name ?? userInfo.email?.split('@')[0] ?? 'User';
    final image = userInfo.profileImage;

    await widget.onSocialLogin(verifierId, name, image);
  }

  // ── 게스트 로그인 ──

  Future<void> _handleGuestLogin() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      setState(() => _error = tr('login.nameRequired', _lang));
      return;
    }

    setState(() {
      _isLoading = true;
      _loadingProvider = 'guest';
      _error = null;
    });

    try {
      await widget.onGuestLogin(name);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _loadingProvider = null;
        });
      }
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _redirectChannel.setMethodCallHandler(null);
    _nameController.dispose();
    _emailController.dispose();
    _pageController.dispose();
    _autoAdvanceTimer?.cancel();
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;
    final langState = ref.watch(languageProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [AlmaTheme.deepNavy, Color(0xFF1A1A2E), Color(0xFF0D1520)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Top bar — language selector
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const SettingsScreen()),
                        );
                      },
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(langState.language.flag, style: const TextStyle(fontSize: 16)),
                            const SizedBox(width: 6),
                            Text(
                              langState.language.nativeName,
                              style: TextStyle(fontSize: 13, color: Colors.white.withValues(alpha: 0.7)),
                            ),
                            const SizedBox(width: 4),
                            Icon(Icons.expand_more, size: 16, color: Colors.white.withValues(alpha: 0.5)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Main content
              Expanded(
                child: _showLogin ? _buildLoginView(lang) : _buildOnboardingView(lang),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ════════════════════════════════════════════════
  //  온보딩 슬라이드 (기존과 동일)
  // ════════════════════════════════════════════════

  Widget _buildOnboardingView(String lang) {
    return Column(
      children: [
        const Spacer(flex: 1),
        _buildLogo(),
        const SizedBox(height: 16),
        Text(
          tr('app.name', lang),
          style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1),
        ),
        const SizedBox(height: 6),
        Text(
          tr('app.tagline', lang),
          style: TextStyle(fontSize: 14, color: Colors.white.withValues(alpha: 0.5)),
          textAlign: TextAlign.center,
        ),
        const Spacer(flex: 1),
        SizedBox(
          height: 200,
          child: PageView(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() => _currentPage = index);
              _startAutoAdvance();
            },
            children: [
              _buildSlide(icon: Icons.translate_rounded, iconColor: AlmaTheme.electricBlue, title: tr('onboarding.slide1.title', lang), desc: tr('onboarding.slide1.desc', lang)),
              _buildSlide(icon: Icons.public_rounded, iconColor: AlmaTheme.cyan, title: tr('onboarding.slide2.title', lang), desc: tr('onboarding.slide2.desc', lang)),
              _buildSlide(icon: Icons.favorite_rounded, iconColor: AlmaTheme.terracottaOrange, title: tr('onboarding.slide3.title', lang), desc: tr('onboarding.slide3.desc', lang)),
            ],
          ),
        ),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(3, (index) {
            final isActive = index == _currentPage;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: isActive ? 24 : 8,
              height: 8,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(4),
                color: isActive ? AlmaTheme.electricBlue : Colors.white.withValues(alpha: 0.2),
              ),
            );
          }),
        ),
        const Spacer(flex: 2),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: _goToLogin,
              style: ElevatedButton.styleFrom(
                backgroundColor: AlmaTheme.electricBlue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                elevation: 0,
              ),
              child: Text(
                tr('onboarding.getStarted', lang),
                style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  // ════════════════════════════════════════════════
  //  로그인 뷰 (소셜 + 이메일 + 게스트)
  // ════════════════════════════════════════════════

  Widget _buildLoginView(String lang) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          children: [
            const SizedBox(height: 24),

            // Logo + welcome
            _buildLogo(size: 64),
            const SizedBox(height: 12),
            Text(
              tr('onboarding.welcome', lang),
              style: TextStyle(fontSize: 15, color: Colors.white.withValues(alpha: 0.5)),
            ),
            const SizedBox(height: 4),
            Text(
              tr('app.name', lang),
              style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 28),

            // ── 소셜 로그인 버튼 ──
            _buildSocialButton(
              label: tr('login.continueGoogle', lang),
              icon: _googleIcon(),
              color: Colors.white,
              textColor: Colors.black87,
              onPressed: _isLoading ? null : _loginWithGoogle,
              isLoading: _loadingProvider == 'google',
            ),
            const SizedBox(height: 10),
            _buildSocialButton(
              label: tr('login.continueApple', lang),
              icon: const Icon(Icons.apple, color: Colors.white, size: 22),
              color: Colors.black,
              textColor: Colors.white,
              borderColor: Colors.white.withValues(alpha: 0.2),
              onPressed: _isLoading ? null : _loginWithApple,
              isLoading: _loadingProvider == 'apple',
            ),

            const SizedBox(height: 20),

            // ── 구분선: or ──
            _buildDivider(lang),
            const SizedBox(height: 20),

            // ── 이메일 로그인 ──
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                tr('login.emailLabel', lang),
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: Colors.white.withValues(alpha: 0.6)),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _emailController,
                    style: const TextStyle(color: Colors.white, fontSize: 15),
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      hintText: tr('login.emailHint', lang),
                      prefixIcon: Icon(Icons.mail_outline_rounded, color: Colors.white.withValues(alpha: 0.3), size: 20),
                      filled: true,
                      fillColor: Colors.white.withValues(alpha: 0.06),
                      contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AlmaTheme.electricBlue, width: 1.5),
                      ),
                    ),
                    onSubmitted: (_) => _loginWithEmail(),
                  ),
                ),
                const SizedBox(width: 8),
                SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _loginWithEmail,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AlmaTheme.electricBlue,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      elevation: 0,
                    ),
                    child: _loadingProvider == 'email'
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : Icon(Icons.arrow_forward_rounded, size: 20),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                tr('login.magicLinkNote', lang),
                style: TextStyle(fontSize: 11, color: Colors.white.withValues(alpha: 0.3)),
              ),
            ),

            const SizedBox(height: 20),

            // ── 구분선: or ──
            _buildDivider(lang),
            const SizedBox(height: 16),

            // ── 게스트 로그인 ──
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                tr('login.guestSection', lang),
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: Colors.white.withValues(alpha: 0.6)),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _nameController,
                    style: const TextStyle(color: Colors.white, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: tr('login.enterName', lang),
                      prefixIcon: Icon(Icons.person_outline_rounded, color: Colors.white.withValues(alpha: 0.3), size: 20),
                      filled: true,
                      fillColor: Colors.white.withValues(alpha: 0.06),
                      contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AlmaTheme.terracottaOrange, width: 1.5),
                      ),
                    ),
                    textInputAction: TextInputAction.go,
                    onSubmitted: (_) => _handleGuestLogin(),
                  ),
                ),
                const SizedBox(width: 8),
                SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _handleGuestLogin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AlmaTheme.terracottaOrange.withValues(alpha: 0.8),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      elevation: 0,
                    ),
                    child: _loadingProvider == 'guest'
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Icon(Icons.arrow_forward_rounded, size: 20),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                tr('login.guestNote', lang),
                style: TextStyle(fontSize: 11, color: Colors.white.withValues(alpha: 0.3)),
              ),
            ),

            // 에러 메시지
            if (_error != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _error!,
                        style: const TextStyle(color: Colors.red, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 20),

            // ← Back to slides
            TextButton(
              onPressed: () {
                _fadeController.reverse().then((_) {
                  setState(() => _showLogin = false);
                  _startAutoAdvance();
                });
              },
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.arrow_back_rounded, size: 16, color: Colors.white.withValues(alpha: 0.4)),
                  const SizedBox(width: 6),
                  Text(
                    tr('onboarding.skip', lang),
                    style: TextStyle(fontSize: 13, color: Colors.white.withValues(alpha: 0.4)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  // ════════════════════════════════════════════════
  //  공통 위젯
  // ════════════════════════════════════════════════

  Widget _buildSocialButton({
    required String label,
    required Widget icon,
    required Color color,
    required Color textColor,
    Color? borderColor,
    VoidCallback? onPressed,
    bool isLoading = false,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: textColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
            side: borderColor != null ? BorderSide(color: borderColor) : BorderSide.none,
          ),
          elevation: 0,
        ),
        child: isLoading
            ? SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(strokeWidth: 2, color: textColor),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  icon,
                  const SizedBox(width: 10),
                  Text(label, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: textColor)),
                ],
              ),
      ),
    );
  }

  Widget _buildDivider(String lang) {
    return Row(
      children: [
        Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.1))),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Text(
            tr('login.or', lang),
            style: TextStyle(fontSize: 12, color: Colors.white.withValues(alpha: 0.3)),
          ),
        ),
        Expanded(child: Divider(color: Colors.white.withValues(alpha: 0.1))),
      ],
    );
  }

  Widget _googleIcon() {
    // Google "G" 로고 (간소화 버전)
    return SizedBox(
      width: 20,
      height: 20,
      child: CustomPaint(painter: _GoogleLogoPainter()),
    );
  }

  Widget _buildLogo({double size = 80}) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AlmaTheme.electricBlue, AlmaTheme.terracottaOrange],
        ),
        boxShadow: [
          BoxShadow(color: AlmaTheme.electricBlue.withValues(alpha: 0.3), blurRadius: 24, spreadRadius: 2),
          BoxShadow(color: AlmaTheme.terracottaOrange.withValues(alpha: 0.15), blurRadius: 24, offset: const Offset(4, 4)),
        ],
      ),
      child: Icon(Icons.chat_bubble_outline_rounded, color: Colors.white, size: size * 0.45),
    );
  }

  Widget _buildSlide({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String desc,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(shape: BoxShape.circle, color: iconColor.withValues(alpha: 0.12)),
            child: Icon(icon, color: iconColor, size: 28),
          ),
          const SizedBox(height: 20),
          Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Colors.white)),
          const SizedBox(height: 10),
          Text(
            desc,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 15, height: 1.5, color: Colors.white.withValues(alpha: 0.55)),
          ),
        ],
      ),
    );
  }
}

/// Google "G" 로고 커스텀 페인터
class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    final double cx = w / 2;
    final double cy = h / 2;
    final double r = w * 0.45;

    // Blue arc (top-right)
    final bluePaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * 0.18
      ..strokeCap = StrokeCap.butt;
    canvas.drawArc(Rect.fromCircle(center: Offset(cx, cy), radius: r), -0.8, 1.6, false, bluePaint);

    // Green arc (bottom-right)
    final greenPaint = Paint()
      ..color = const Color(0xFF34A853)
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * 0.18
      ..strokeCap = StrokeCap.butt;
    canvas.drawArc(Rect.fromCircle(center: Offset(cx, cy), radius: r), 0.8, 1.2, false, greenPaint);

    // Yellow arc (bottom-left)
    final yellowPaint = Paint()
      ..color = const Color(0xFFFBBC05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * 0.18
      ..strokeCap = StrokeCap.butt;
    canvas.drawArc(Rect.fromCircle(center: Offset(cx, cy), radius: r), 2.0, 1.2, false, yellowPaint);

    // Red arc (top-left)
    final redPaint = Paint()
      ..color = const Color(0xFFEA4335)
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * 0.18
      ..strokeCap = StrokeCap.butt;
    canvas.drawArc(Rect.fromCircle(center: Offset(cx, cy), radius: r), 3.2, 1.27, false, redPaint);

    // Horizontal bar
    final barPaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;
    canvas.drawRect(Rect.fromLTWH(cx, cy - w * 0.09, r + w * 0.05, w * 0.18), barPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
