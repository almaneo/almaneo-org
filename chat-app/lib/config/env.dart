import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  static String get streamApiKey => dotenv.env['STREAM_API_KEY'] ?? '';
  static String get supabaseUrl => dotenv.env['SUPABASE_URL'] ?? '';
  static String get supabaseAnonKey => dotenv.env['SUPABASE_ANON_KEY'] ?? '';
  static String get chatApiUrl => dotenv.env['CHAT_API_URL'] ?? 'https://chat.almaneo.org';
  static String get web3authClientId => dotenv.env['WEB3AUTH_CLIENT_ID'] ?? '';
  static String get googleMapsApiKey => dotenv.env['GOOGLE_MAPS_API_KEY'] ?? '';
}
