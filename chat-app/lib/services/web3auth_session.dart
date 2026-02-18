import 'dart:convert';
import 'dart:math' show min;
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:pointycastle/export.dart';

/// Web3Auth SDK 우회 — Dart에서 직접 세션 서버 API를 호출하여 세션 복구.
///
/// Android SDK의 `authorizeSession()` CompletableFuture가 resolve되지 않는 문제를
/// 우회합니다. Redirect URI → sessionId 추출 → 세션 서버 조회 → ECIES 복호화.
class Web3AuthSessionRecovery {
  static const String _sessionApiUrl =
      'https://session.web3auth.io/v2/store/get';

  /// origin 후보 — Devnet을 우선 시도 후 Mainnet, 마지막 '*' 폴백.
  /// 앱은 sapphire_devnet 사용 → devnet origin이 정답.
  static const List<String> _originCandidates = [
    'https://sapphire-devnet.web3auth.io',
    'https://sapphire.web3auth.io',
    '*',
  ];

  /// 전체 세션 복구 플로우
  static Future<Map<String, dynamic>?> recoverSession(
      String redirectUri) async {
    final sessionId = extractSessionId(redirectUri);
    if (sessionId == null) return null;

    final encrypted = await _fetchEncryptedSessionWithRetry(sessionId);
    if (encrypted == null) return null;

    final decrypted = _decryptEcies(sessionId, encrypted);
    if (decrypted == null) return null;

    try {
      final sessionData = jsonDecode(decrypted) as Map<String, dynamic>;
      debugPrint('[SessionRecovery] Recovered ${sessionData.length} keys');
      return sessionData;
    } catch (e) {
      debugPrint('[SessionRecovery] JSON parse error: $e');
      return null;
    }
  }

  /// Redirect URI에서 b64Params 파싱 → sessionId 추출
  static String? extractSessionId(String redirectUri) {
    try {
      final hashIndex = redirectUri.indexOf('#');
      if (hashIndex == -1) return null;

      final fragment = redirectUri.substring(hashIndex + 1);
      final hashUri = Uri.parse('http://dummy?$fragment');
      final b64Params = hashUri.queryParameters['b64Params'];
      if (b64Params == null || b64Params.isEmpty) return null;

      final normalized = _normalizeBase64(b64Params);
      final decoded = utf8.decode(base64Decode(normalized));
      final json = jsonDecode(decoded) as Map<String, dynamic>;

      final sessionId = json['sessionId'] as String?;
      if (sessionId == null || sessionId.isEmpty) return null;

      debugPrint(
          '[SessionRecovery] SessionId: ${sessionId.substring(0, min(8, sessionId.length))}...');
      return sessionId;
    } catch (e) {
      debugPrint('[SessionRecovery] URI parse error: $e');
      return null;
    }
  }

  /// sessionId (hex private key) → secp256k1 uncompressed public key (hex)
  static String _derivePublicKey(String privateKeyHex) {
    final domain = ECDomainParameters('secp256k1');
    final privateKeyBigInt = BigInt.parse(privateKeyHex, radix: 16);
    final publicKeyPoint = domain.G * privateKeyBigInt;

    // X, Y 좌표를 각각 64 hex (32 bytes)로 패딩
    final xHex =
        publicKeyPoint!.x!.toBigInteger()!.toRadixString(16).padLeft(64, '0');
    final yHex =
        publicKeyPoint.y!.toBigInteger()!.toRadixString(16).padLeft(64, '0');
    return '04$xHex$yHex';
  }

  /// 리트라이 포함 세션 조회 (최대 3회, 각 origin 후보 시도)
  static Future<String?> _fetchEncryptedSessionWithRetry(
      String sessionId) async {
    final publicKey = _derivePublicKey(sessionId);

    for (int attempt = 1; attempt <= 3; attempt++) {
      for (final origin in _originCandidates) {
        final result = await _fetchWithOrigin(publicKey, origin);
        if (result != null) return result;
      }

      if (attempt < 3) {
        await Future.delayed(Duration(seconds: attempt * 2));
      }
    }

    debugPrint('[SessionRecovery] All attempts failed — session not found');
    return null;
  }

  /// 특정 origin으로 세션 서버에 요청
  static Future<String?> _fetchWithOrigin(
      String publicKey, String origin) async {
    try {
      final response = await http
          .post(
            Uri.parse(_sessionApiUrl),
            headers: {
              'Content-Type': 'application/json',
              'origin': origin,
            },
            body: jsonEncode({'key': publicKey, 'namespace': ''}),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode != 200) return null;

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final message = data['message'];

      if (message is String && message.isNotEmpty) return message;
      if (message is Map && message.isNotEmpty) return jsonEncode(message);
      return null;
    } catch (_) {
      return null;
    }
  }

  /// ECIES 복호화 (ECDH + SHA-512 KDF + HMAC-SHA256 + AES-256-CBC)
  static String? _decryptEcies(String sessionId, String encryptedMessage) {
    try {
      final encData = jsonDecode(encryptedMessage) as Map<String, dynamic>;

      final ephemPublicKeyBytes =
          _hexToBytes(encData['ephemPublicKey'] as String);
      final iv = _hexToBytes(encData['iv'] as String);
      final ciphertext = _hexToBytes(encData['ciphertext'] as String);
      final mac = _hexToBytes(encData['mac'] as String);

      // 1. ECDH shared secret
      final domain = ECDomainParameters('secp256k1');
      final privateKeyBigInt = BigInt.parse(sessionId, radix: 16);
      final ephemPoint = domain.curve.decodePoint(ephemPublicKeyBytes);
      if (ephemPoint == null) return null;
      final sharedPoint = ephemPoint * privateKeyBigInt;
      if (sharedPoint == null) return null;

      // 2. SHA-512(x-coordinate as BigInt bytes) → encKey(32B) + macKey(32B)
      final xBytes = _bigIntToBytes(sharedPoint.x!.toBigInteger()!);
      final derivedKey = Digest('SHA-512').process(xBytes);
      final encryptionKey = Uint8List.fromList(derivedKey.sublist(0, 32));
      final macKey = Uint8List.fromList(derivedKey.sublist(32, 64));

      // 3. HMAC-SHA256: HMAC(macKey, iv + ephemPublicKey + ciphertext)
      final hmac = HMac(Digest('SHA-256'), 64);
      hmac.init(KeyParameter(macKey));
      final hmacInput = Uint8List(
          iv.length + ephemPublicKeyBytes.length + ciphertext.length);
      hmacInput.setAll(0, iv);
      hmacInput.setAll(iv.length, ephemPublicKeyBytes);
      hmacInput.setAll(iv.length + ephemPublicKeyBytes.length, ciphertext);
      final calculatedMac = Uint8List(hmac.macSize);
      hmac.update(hmacInput, 0, hmacInput.length);
      hmac.doFinal(calculatedMac, 0);

      if (!_constantTimeEquals(calculatedMac, mac)) {
        debugPrint('[SessionRecovery] MAC verification failed');
        return null;
      }

      // 4. AES-256-CBC 복호화
      final aes = CBCBlockCipher(AESEngine());
      aes.init(false, ParametersWithIV(KeyParameter(encryptionKey), iv));

      final decrypted = Uint8List(ciphertext.length);
      for (var offset = 0;
          offset < ciphertext.length;
          offset += aes.blockSize) {
        aes.processBlock(ciphertext, offset, decrypted, offset);
      }

      // PKCS7 padding 제거
      final paddingLength = decrypted.last;
      if (paddingLength > 0 && paddingLength <= 16) {
        return utf8.decode(
            decrypted.sublist(0, decrypted.length - paddingLength));
      }
      return utf8.decode(decrypted);
    } catch (e) {
      debugPrint('[SessionRecovery] Decryption error: $e');
      return null;
    }
  }

  // ── 유틸리티 ──

  /// BigInt → unsigned bytes (Java BigInteger.toByteArray() 호환)
  /// sign byte (0x00) 제거, 패딩 없음
  static Uint8List _bigIntToBytes(BigInt value) {
    var hex = value.toRadixString(16);
    if (hex.length.isOdd) hex = '0$hex';
    final bytes = _hexToBytes(hex);
    // Java의 BigInteger.toByteArray()는 sign byte를 붙이지만
    // Web3Auth SDK는 이를 strip하므로 동일하게 처리
    if (bytes.isNotEmpty && bytes[0] == 0) {
      return Uint8List.fromList(bytes.sublist(1));
    }
    return bytes;
  }

  static String _normalizeBase64(String input) {
    var normalized = input.replaceAll('-', '+').replaceAll('_', '/');
    while (normalized.length % 4 != 0) {
      normalized += '=';
    }
    return normalized;
  }

  static Uint8List _hexToBytes(String hex) {
    final length = hex.length ~/ 2;
    final bytes = Uint8List(length);
    for (var i = 0; i < length; i++) {
      bytes[i] = int.parse(hex.substring(i * 2, i * 2 + 2), radix: 16);
    }
    return bytes;
  }

  static bool _constantTimeEquals(Uint8List a, Uint8List b) {
    if (a.length != b.length) return false;
    var result = 0;
    for (var i = 0; i < a.length; i++) {
      result |= a[i] ^ b[i];
    }
    return result == 0;
  }
}
