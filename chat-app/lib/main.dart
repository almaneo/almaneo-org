import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart' hide User;
import 'config/env.dart';
import 'config/theme.dart';
import 'providers/language_provider.dart';
import 'services/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/channel_list_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 환경변수 로드
  await dotenv.load(fileName: '.env');

  // Supabase 초기화
  await Supabase.initialize(
    url: Env.supabaseUrl,
    anonKey: Env.supabaseAnonKey,
  );

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

class AlmaChatApp extends ConsumerStatefulWidget {
  final StreamChatClient client;

  const AlmaChatApp({super.key, required this.client});

  @override
  ConsumerState<AlmaChatApp> createState() => _AlmaChatAppState();
}

class _AlmaChatAppState extends ConsumerState<AlmaChatApp> {
  final _authService = AuthService();
  bool _isConnected = false;

  Future<void> _handleLogin(String name) async {
    // 사용자 선호 언어 가져오기
    final langState = ref.read(languageProvider);

    // 게스트 토큰 발급 (언어 설정 포함)
    final token =
        await _authService.loginAsGuest(name, langState.languageCode);

    // Stream Chat 연결
    await widget.client.connectUser(
      User(
        id: _authService.userId!,
        name: _authService.userName,
        extraData: {
          'preferred_language': langState.languageCode,
        },
      ),
      token,
    );

    setState(() => _isConnected = true);
  }

  @override
  void dispose() {
    widget.client.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
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
      home: _isConnected
          ? const ChannelListScreen()
          : LoginScreen(onLogin: _handleLogin),
    );
  }
}
