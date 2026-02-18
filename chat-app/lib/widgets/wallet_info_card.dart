import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../config/theme.dart';

/// 지갑 주소 + ALMAN 토큰 잔액 카드
class WalletInfoCard extends StatelessWidget {
  final String walletAddress;
  final double tokenBalance;
  final String addressLabel;
  final String balanceLabel;
  final String noBalanceLabel;
  final String copiedMessage;
  final String networkLabel;

  const WalletInfoCard({
    super.key,
    required this.walletAddress,
    required this.tokenBalance,
    required this.addressLabel,
    required this.balanceLabel,
    required this.noBalanceLabel,
    required this.copiedMessage,
    required this.networkLabel,
  });

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    final truncatedAddress = walletAddress.length > 12
        ? '${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}'
        : walletAddress;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: AlmaTheme.themedCard(context),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 지갑 주소
          Row(
            children: [
              const Icon(Icons.account_balance_wallet_outlined,
                  color: AlmaTheme.cyan, size: 18),
              const SizedBox(width: 8),
              Text(
                addressLabel,
                style: TextStyle(
                  fontSize: 12,
                  color: alma.textSecondary,
                ),
              ),
              const Spacer(),
              // 네트워크 뱃지
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AlmaTheme.electricBlue.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  networkLabel,
                  style: const TextStyle(
                    fontSize: 10,
                    color: AlmaTheme.electricBlue,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // 주소 + 복사 버튼
          GestureDetector(
            onTap: () {
              Clipboard.setData(ClipboardData(text: walletAddress));
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(copiedMessage),
                  duration: const Duration(seconds: 2),
                  backgroundColor: alma.cardBg,
                ),
              );
            },
            child: Row(
              children: [
                Text(
                  truncatedAddress,
                  style: TextStyle(
                    fontSize: 14,
                    fontFamily: 'monospace',
                    color: alma.textPrimary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(width: 6),
                Icon(
                  Icons.copy,
                  size: 14,
                  color: alma.textTertiary,
                ),
              ],
            ),
          ),
          Divider(color: alma.divider, height: 24),
          // ALMAN 잔액
          Row(
            children: [
              Text(
                balanceLabel,
                style: TextStyle(
                  fontSize: 12,
                  color: alma.textSecondary,
                ),
              ),
              const Spacer(),
              Text(
                tokenBalance > 0
                    ? '${_formatBalance(tokenBalance)} ALMAN'
                    : noBalanceLabel,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: tokenBalance > 0
                      ? AlmaTheme.terracottaOrange
                      : alma.textTertiary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatBalance(double balance) {
    if (balance >= 1000000) {
      return '${(balance / 1000000).toStringAsFixed(2)}M';
    } else if (balance >= 1000) {
      return '${(balance / 1000).toStringAsFixed(2)}K';
    }
    return balance.toStringAsFixed(2);
  }
}
