import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import 'settings_screen.dart';

/// 사용자 프로필 화면
class ProfileScreen extends ConsumerStatefulWidget {
  final VoidCallback onLogout;

  const ProfileScreen({super.key, required this.onLogout});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  late final TextEditingController _nameController;
  bool _isEditing = false;
  bool _isSaving = false;
  String? _originalName;
  bool _initialized = false;

  String get _lang => ref.read(languageProvider).languageCode;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialized) {
      final user = StreamChat.of(context).currentUser;
      _originalName = user?.name ?? '';
      _nameController.text = _originalName!;
      _initialized = true;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _saveName() async {
    final newName = _nameController.text.trim();
    if (newName.isEmpty || newName == _originalName) {
      setState(() => _isEditing = false);
      return;
    }

    setState(() => _isSaving = true);

    try {
      final client = StreamChat.of(context).client;
      final user = StreamChat.of(context).currentUser;
      if (user != null) {
        await client.partialUpdateUser(
          user.id,
          set: {'name': newName},
        );
      }

      setState(() {
        _originalName = newName;
        _isEditing = false;
        _isSaving = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(tr('profile.nameUpdated', _lang)),
              ],
            ),
            behavior: SnackBarBehavior.floating,
            backgroundColor: AlmaTheme.success.withValues(alpha: 0.9),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      setState(() => _isSaving = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(tr('profile.nameUpdateFailed', _lang)),
              ],
            ),
            behavior: SnackBarBehavior.floating,
            backgroundColor: AlmaTheme.error,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        );
      }
    }
  }

  void _confirmLogout() {
    final lang = _lang;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AlmaTheme.slateGray,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(
          tr('profile.logout', lang),
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        content: Text(
          tr('profile.logoutConfirm', lang),
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              tr('profile.cancel', lang),
              style: const TextStyle(color: Colors.white54),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              widget.onLogout();
            },
            child: Text(
              tr('profile.logout', lang),
              style: const TextStyle(color: AlmaTheme.error),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = StreamChat.of(context).currentUser;
    final langState = ref.watch(languageProvider);
    final lang = langState.languageCode;
    final displayName = _originalName ?? user?.name ?? 'Guest';
    final isGuest = user?.id.startsWith('guest_') ?? true;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          tr('profile.title', lang),
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildAvatarSection(displayName, lang),
          const SizedBox(height: 28),

          _buildSectionLabel(tr('profile.account', lang)),
          const SizedBox(height: 8),
          _buildInfoTile(
            icon: Icons.badge_outlined,
            iconColor: AlmaTheme.electricBlue,
            title: tr('profile.displayName', lang),
            trailing: _isEditing
                ? _buildNameEditor()
                : _buildNameDisplay(displayName),
            onTap: () {
              if (!_isEditing) {
                setState(() => _isEditing = true);
              }
            },
          ),
          const SizedBox(height: 4),
          _buildInfoTile(
            icon: isGuest ? Icons.person_outline : Icons.verified_user_outlined,
            iconColor: isGuest ? Colors.white54 : AlmaTheme.success,
            title: tr('profile.accountType', lang),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isGuest ? Icons.person : Icons.shield_outlined,
                  size: 16,
                  color: isGuest ? Colors.white54 : AlmaTheme.success,
                ),
                const SizedBox(width: 6),
                Text(
                  isGuest ? tr('profile.loginGuest', lang) : tr('profile.loginSocial', lang),
                  style: TextStyle(
                    color: isGuest ? Colors.white54 : AlmaTheme.success,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          _buildInfoTile(
            icon: Icons.fingerprint,
            iconColor: Colors.white38,
            title: tr('profile.userId', lang),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _truncateId(user?.id ?? ''),
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.4),
                    fontSize: 13,
                    fontFamily: 'monospace',
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: user?.id ?? ''));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(tr('profile.userIdCopied', lang)),
                        behavior: SnackBarBehavior.floating,
                        duration: const Duration(seconds: 1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    );
                  },
                  child: Icon(
                    Icons.copy,
                    size: 16,
                    color: Colors.white.withValues(alpha: 0.3),
                  ),
                ),
              ],
            ),
          ),
          if (user?.createdAt != null) ...[
            const SizedBox(height: 4),
            _buildInfoTile(
              icon: Icons.calendar_today_outlined,
              iconColor: AlmaTheme.cyan,
              title: tr('profile.memberSince', lang),
              trailing: Text(
                _formatDate(user!.createdAt!, lang),
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.5),
                  fontSize: 13,
                ),
              ),
            ),
          ],

          const SizedBox(height: 24),

          _buildSectionLabel(tr('profile.settings', lang)),
          const SizedBox(height: 8),
          _buildInfoTile(
            icon: Icons.translate,
            iconColor: AlmaTheme.terracottaOrange,
            title: tr('profile.translationLang', lang),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  langState.language.flag,
                  style: const TextStyle(fontSize: 18),
                ),
                const SizedBox(width: 8),
                Text(
                  langState.language.nativeName,
                  style: const TextStyle(color: Colors.white70, fontSize: 14),
                ),
                const SizedBox(width: 4),
                Icon(
                  Icons.chevron_right,
                  color: Colors.white.withValues(alpha: 0.3),
                  size: 20,
                ),
              ],
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
            },
          ),
          const SizedBox(height: 4),
          _buildInfoTile(
            icon: Icons.settings_outlined,
            iconColor: Colors.white54,
            title: tr('settings.title', lang),
            trailing: Icon(
              Icons.chevron_right,
              color: Colors.white.withValues(alpha: 0.3),
              size: 20,
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
            },
          ),

          const SizedBox(height: 32),

          _buildLogoutButton(lang),

          const SizedBox(height: 16),

          if (StreamChat.of(context).currentUser?.id.startsWith('guest_') ?? true)
            Center(
              child: Text(
                tr('profile.guestNote', lang),
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.2),
                  fontSize: 12,
                ),
              ),
            ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildAvatarSection(String displayName, String lang) {
    final user = StreamChat.of(context).currentUser;
    final isGuest = user?.id.startsWith('guest_') ?? true;
    final userImage = user?.image;
    final badgeLabel = isGuest ? tr('profile.guest', lang) : tr('profile.verified', lang);
    final badgeColor = isGuest ? AlmaTheme.electricBlue : AlmaTheme.success;

    return Column(
      children: [
        Container(
          width: 88,
          height: 88,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              colors: isGuest
                  ? [AlmaTheme.terracottaOrange, const Color(0xFFFF8C33)]
                  : [AlmaTheme.electricBlue, AlmaTheme.cyan],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                color: (isGuest ? AlmaTheme.terracottaOrange : AlmaTheme.electricBlue)
                    .withValues(alpha: 0.3),
                blurRadius: 16,
                spreadRadius: 2,
              ),
            ],
          ),
          child: ClipOval(
            child: userImage != null && userImage.isNotEmpty
                ? Image.network(
                    userImage,
                    width: 88,
                    height: 88,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Center(
                      child: Text(
                        displayName.isNotEmpty ? displayName[0].toUpperCase() : '?',
                        style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold),
                      ),
                    ),
                  )
                : Center(
                    child: Text(
                      displayName.isNotEmpty ? displayName[0].toUpperCase() : '?',
                      style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold),
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          displayName,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
          decoration: BoxDecoration(
            color: badgeColor.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: badgeColor.withValues(alpha: 0.3),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (!isGuest) ...[
                Icon(Icons.verified, color: badgeColor, size: 14),
                const SizedBox(width: 4),
              ],
              Text(
                badgeLabel,
                style: TextStyle(
                  color: badgeColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSectionLabel(String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Text(
        label,
        style: TextStyle(
          color: Colors.white.withValues(alpha: 0.5),
          fontSize: 13,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required Color iconColor,
    required String title,
    required Widget trailing,
    VoidCallback? onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AlmaTheme.slateGray,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: iconColor.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        title: Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: trailing,
        onTap: onTap,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  Widget _buildNameDisplay(String name) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          name,
          style: const TextStyle(color: Colors.white70, fontSize: 14),
        ),
        const SizedBox(width: 6),
        Icon(
          Icons.edit,
          size: 16,
          color: AlmaTheme.electricBlue.withValues(alpha: 0.6),
        ),
      ],
    );
  }

  Widget _buildNameEditor() {
    return SizedBox(
      width: 180,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Expanded(
            child: TextField(
              controller: _nameController,
              autofocus: true,
              maxLength: 30,
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                isDense: true,
                filled: true,
                fillColor: AlmaTheme.deepNavy,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 8,
                ),
                counterText: '',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(
                    color: AlmaTheme.electricBlue.withValues(alpha: 0.4),
                  ),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(
                    color: AlmaTheme.electricBlue.withValues(alpha: 0.4),
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: AlmaTheme.electricBlue),
                ),
              ),
              onSubmitted: (_) => _saveName(),
            ),
          ),
          const SizedBox(width: 6),
          if (_isSaving)
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AlmaTheme.electricBlue,
              ),
            )
          else ...[
            GestureDetector(
              onTap: _saveName,
              child: const Icon(
                Icons.check_circle,
                color: AlmaTheme.success,
                size: 22,
              ),
            ),
            const SizedBox(width: 4),
            GestureDetector(
              onTap: () {
                _nameController.text = _originalName ?? '';
                setState(() => _isEditing = false);
              },
              child: Icon(
                Icons.cancel,
                color: Colors.white.withValues(alpha: 0.4),
                size: 22,
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _truncateId(String id) {
    if (id.length <= 16) return id;
    return '${id.substring(0, 12)}...';
  }

  String _formatDate(DateTime date, String lang) {
    final months = {
      'ko': ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      'ja': ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      'zh': ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    };
    if (months.containsKey(lang)) {
      return '${date.year}${lang == 'ko' ? '년 ' : '/'}${months[lang]![date.month - 1]}';
    }
    const enMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return '${enMonths[date.month - 1]} ${date.year}';
  }

  Widget _buildLogoutButton(String lang) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AlmaTheme.error.withValues(alpha: 0.3),
        ),
      ),
      child: ListTile(
        leading: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AlmaTheme.error.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Icon(Icons.logout, color: AlmaTheme.error, size: 20),
        ),
        title: Text(
          tr('profile.logout', lang),
          style: const TextStyle(
            color: AlmaTheme.error,
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: Icon(
          Icons.chevron_right,
          color: AlmaTheme.error.withValues(alpha: 0.5),
        ),
        onTap: _confirmLogout,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
