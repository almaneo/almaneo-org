import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart' hide User;
import 'config/env.dart';
import 'config/theme.dart';
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

  runApp(AlmaChatApp(client: client));
}

class AlmaChatApp extends StatefulWidget {
  final StreamChatClient client;

  const AlmaChatApp({super.key, required this.client});

  @override
  State<AlmaChatApp> createState() => _AlmaChatAppState();
}

class _AlmaChatAppState extends State<AlmaChatApp> {
  final _authService = AuthService();
  bool _isConnected = false;

  Future<void> _handleLogin(String name) async {
    // 게스트 토큰 발급
    final token = await _authService.loginAsGuest(name);

    // Stream Chat 연결
    await widget.client.connectUser(
      User(
        id: _authService.userId!,
        name: _authService.userName,
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
