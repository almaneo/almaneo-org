import 'dart:async';

import 'package:flutter/material.dart';

import '../config/theme.dart';

/// Pulsing red dot + "REC" + elapsed time indicator for meetup recording
class RecordingIndicator extends StatefulWidget {
  final int elapsedSeconds;
  final VoidCallback? onStop;
  final String lang;

  const RecordingIndicator({
    super.key,
    required this.elapsedSeconds,
    this.onStop,
    required this.lang,
  });

  @override
  State<RecordingIndicator> createState() => _RecordingIndicatorState();
}

class _RecordingIndicatorState extends State<RecordingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  String _formatTime(int totalSeconds) {
    final hours = totalSeconds ~/ 3600;
    final minutes = (totalSeconds % 3600) ~/ 60;
    final seconds = totalSeconds % 60;
    if (hours > 0) {
      return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
    }
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final alma = context.alma;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AlmaTheme.error.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AlmaTheme.error.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Pulsing red dot
          AnimatedBuilder(
            animation: _pulseAnimation,
            builder: (context, child) {
              return Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AlmaTheme.error.withValues(alpha: _pulseAnimation.value),
                  boxShadow: [
                    BoxShadow(
                      color: AlmaTheme.error.withValues(alpha: _pulseAnimation.value * 0.5),
                      blurRadius: 6,
                      spreadRadius: 1,
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(width: 8),
          // "REC" label
          Text(
            'REC',
            style: TextStyle(
              color: AlmaTheme.error,
              fontSize: 12,
              fontWeight: FontWeight.w700,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(width: 8),
          // Elapsed time
          Text(
            _formatTime(widget.elapsedSeconds),
            style: TextStyle(
              color: alma.textPrimary,
              fontSize: 14,
              fontWeight: FontWeight.w600,
              fontFamily: 'monospace',
            ),
          ),
          // Stop button
          if (widget.onStop != null) ...[
            const SizedBox(width: 8),
            GestureDetector(
              onTap: widget.onStop,
              child: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AlmaTheme.error.withValues(alpha: 0.3),
                ),
                child: Icon(Icons.stop, size: 14, color: alma.textPrimary),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Timer-based wrapper that auto-updates elapsed seconds
class LiveRecordingIndicator extends StatefulWidget {
  final VoidCallback? onStop;
  final String lang;

  const LiveRecordingIndicator({
    super.key,
    this.onStop,
    required this.lang,
  });

  @override
  State<LiveRecordingIndicator> createState() => _LiveRecordingIndicatorState();
}

class _LiveRecordingIndicatorState extends State<LiveRecordingIndicator> {
  Timer? _timer;
  int _elapsed = 0;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _elapsed++);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void reset() {
    setState(() => _elapsed = 0);
  }

  @override
  Widget build(BuildContext context) {
    return RecordingIndicator(
      elapsedSeconds: _elapsed,
      onStop: widget.onStop,
      lang: widget.lang,
    );
  }
}
