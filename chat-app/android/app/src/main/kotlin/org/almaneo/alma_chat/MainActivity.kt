package org.almaneo.alma_chat

import android.content.Intent
import android.util.Log
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import com.web3auth.core.Web3Auth

class MainActivity : FlutterActivity() {
    private var redirectChannel: MethodChannel? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        redirectChannel = MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            "org.almaneo.alma_chat/web3auth_redirect"
        )
    }

    override fun onNewIntent(intent: Intent) {
        setIntent(intent)

        val uri = intent.data
        if (uri != null && uri.scheme == "w3a") {
            // customTabsClosed 리셋 — SDK가 setResultUrl(null)로 세션을 지우지 않도록 방지
            try { Web3Auth.setCustomTabsClosed(false) } catch (_: Exception) {}

            // Dart에 redirect URL 전달 → Dart에서 직접 세션 서버 API 호출
            try {
                redirectChannel?.invokeMethod("onRedirectUrl", uri.toString())
            } catch (e: Exception) {
                Log.e("MainActivity", "MethodChannel error: ${e.message}")
            }

            // super.onNewIntent() 호출 안 함 — app_links 딥링크 가로채기 방지
            return
        }

        super.onNewIntent(intent)
    }
}
