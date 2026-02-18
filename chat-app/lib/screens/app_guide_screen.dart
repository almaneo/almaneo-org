import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../widgets/alma_logo.dart';

/// 앱 가이드 화면 (설정 → "앱 가이드" 메뉴에서 호출)
///
/// 6개 슬라이드를 독립 화면으로 표시합니다.
/// 오른쪽 상단 X 버튼 또는 하단 "확인" 버튼으로 닫습니다.
class AppGuideScreen extends ConsumerStatefulWidget {
  const AppGuideScreen({super.key});

  @override
  ConsumerState<AppGuideScreen> createState() => _AppGuideScreenState();
}

class _AppGuideScreenState extends ConsumerState<AppGuideScreen>
    with TickerProviderStateMixin {
  final _pageController = PageController();
  int _currentPage = 0;
  Timer? _autoAdvanceTimer;

  @override
  void initState() {
    super.initState();
    _startAutoAdvance();
  }

  void _startAutoAdvance() {
    _autoAdvanceTimer?.cancel();
    _autoAdvanceTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_currentPage < 5) {
        _pageController.nextPage(
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _autoAdvanceTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;
    final alma = context.alma;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final screenH = MediaQuery.of(context).size.height;
    final isCompact = screenH < 700;
    final bottomPad = isCompact ? 16.0 : 32.0;

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
                  colors: [alma.scaffold, alma.surfaceVariant, alma.surface],
                ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Top bar — close button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: Icon(Icons.close_rounded, color: alma.textSecondary),
                      tooltip: tr('common.cancel', lang),
                    ),
                  ],
                ),
              ),

              // Content
              Expanded(
                child: Column(
                  children: [
                    // Compact branding header
                    Padding(
                      padding: EdgeInsets.symmetric(vertical: isCompact ? 8.0 : 12.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          AlmaLogo(size: isCompact ? 24.0 : 32.0),
                          const SizedBox(width: 8),
                          Text(
                            tr('app.name', lang),
                            style: TextStyle(
                              fontSize: isCompact ? 16.0 : 18.0,
                              fontWeight: FontWeight.bold,
                              color: alma.textPrimary,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Full-size slides
                    Expanded(
                      child: PageView(
                        controller: _pageController,
                        onPageChanged: (index) {
                          setState(() => _currentPage = index);
                          _startAutoAdvance();
                        },
                        children: [
                          _buildSlide(
                            image: 'assets/images/Auto_Translation.webp',
                            fallbackIcon: Icons.translate_rounded,
                            iconColor: AlmaTheme.electricBlue,
                            title: tr('onboarding.slide1.title', lang),
                            desc: tr('onboarding.slide1.desc', lang),
                            compact: isCompact,
                          ),
                          _buildSlide(
                            image: 'assets/images/Global_Community.webp',
                            fallbackIcon: Icons.public_rounded,
                            iconColor: AlmaTheme.cyan,
                            title: tr('onboarding.slide2.title', lang),
                            desc: tr('onboarding.slide2.desc', lang),
                            compact: isCompact,
                          ),
                          _buildSlide(
                            image: 'assets/images/Kindness_First.webp',
                            fallbackIcon: Icons.favorite_rounded,
                            iconColor: AlmaTheme.terracottaOrange,
                            title: tr('onboarding.slide3.title', lang),
                            desc: tr('onboarding.slide3.desc', lang),
                            compact: isCompact,
                          ),
                          _buildSlide(
                            image: 'assets/images/Meetup_Together.webp',
                            fallbackIcon: Icons.event_rounded,
                            iconColor: AlmaTheme.terracottaOrange,
                            title: tr('onboarding.slide4.title', lang),
                            desc: tr('onboarding.slide4.desc', lang),
                            compact: isCompact,
                          ),
                          _buildSlide(
                            image: 'assets/images/Small_Heart.webp',
                            fallbackIcon: Icons.favorite_border_rounded,
                            iconColor: const Color(0xFFE91E63),
                            title: tr('onboarding.slide5.title', lang),
                            desc: tr('onboarding.slide5.desc', lang),
                            compact: isCompact,
                          ),
                          _buildSlide(
                            image: 'assets/images/Get_Started.webp',
                            fallbackIcon: Icons.rocket_launch_rounded,
                            iconColor: AlmaTheme.electricBlue,
                            title: tr('onboarding.slide6.title', lang),
                            desc: tr('onboarding.slide6.desc', lang),
                            compact: isCompact,
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: isCompact ? 8.0 : 12.0),

                    // Dot indicators
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(6, (index) {
                        final isActive = index == _currentPage;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: const EdgeInsets.symmetric(horizontal: 3),
                          width: isActive ? 20 : 7,
                          height: 7,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(4),
                            color: isActive
                                ? AlmaTheme.electricBlue
                                : alma.textTertiary,
                          ),
                        );
                      }),
                    ),

                    SizedBox(height: isCompact ? 12.0 : 16.0),

                    // Done button
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: SizedBox(
                        width: double.infinity,
                        height: isCompact ? 46 : 52,
                        child: ElevatedButton(
                          onPressed: () => Navigator.pop(context),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AlmaTheme.electricBlue,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            elevation: 0,
                          ),
                          child: Text(
                            tr('onboarding.letsGo', lang),
                            style: TextStyle(
                              fontSize: isCompact ? 15 : 17,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: bottomPad),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSlide({
    required String image,
    required IconData fallbackIcon,
    required Color iconColor,
    required String title,
    required String desc,
    bool compact = false,
  }) {
    final titleFontSize = compact ? 17.0 : 20.0;
    final descFontSize = compact ? 13.0 : 15.0;
    final alma = context.alma;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Full-width 16:9 image
        AspectRatio(
          aspectRatio: 16 / 9,
          child: Image.asset(
            image,
            fit: BoxFit.cover,
            errorBuilder: (ctx, err, stack) => Container(
              color: iconColor.withValues(alpha: 0.15),
              child: Center(
                child: Icon(fallbackIcon, color: iconColor, size: 56),
              ),
            ),
          ),
        ),
        // Title + desc centered in remaining space
        Expanded(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: compact ? 24.0 : 32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: titleFontSize,
                    fontWeight: FontWeight.w700,
                    color: alma.textPrimary,
                  ),
                ),
                SizedBox(height: compact ? 6.0 : 10.0),
                Text(
                  desc,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: descFontSize,
                    height: 1.5,
                    color: alma.textSecondary,
                  ),
                  maxLines: compact ? 2 : 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
