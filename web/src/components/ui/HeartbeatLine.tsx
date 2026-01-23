interface HeartbeatLineProps {
  className?: string;
}

export const HeartbeatLine = ({ className = '' }: HeartbeatLineProps) => (
  <svg viewBox="0 0 400 60" className={className} preserveAspectRatio="none">
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0052FF" />
        <stop offset="50%" stopColor="#FF6B00" />
        <stop offset="100%" stopColor="#0052FF" />
      </linearGradient>
    </defs>
    <path
      d="M0,30 L80,30 L100,30 L120,10 L140,50 L160,20 L180,40 L200,30 L220,30 L240,5 L260,55 L280,25 L300,35 L320,30 L400,30"
      fill="none"
      stroke="url(#heartGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="animate-dash"
      style={{ strokeDasharray: 600 }}
    />
  </svg>
);

export default HeartbeatLine;
