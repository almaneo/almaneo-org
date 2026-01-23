import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';
import { Container } from '../components/layout';

export default function PrivacyPolicy() {
  const { t } = useTranslation('common');

  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Wallet Address: When you connect your Web3 wallet (via Web3Auth or direct connection), we collect your public wallet address to identify your account.',
        'Social Login Data: If you use Web3Auth social login (Google, Facebook, etc.), we receive only basic profile information (name, email) that you authorize.',
        'On-Chain Activity: All blockchain transactions are publicly visible on the Polygon network. We may display your transaction history within our platform.',
        'Usage Analytics: We collect anonymous usage data to improve our services (page views, feature usage, etc.).',
      ],
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our platform services',
        'To process blockchain transactions (staking, governance, NFT marketplace)',
        'To verify eligibility for airdrops and rewards',
        'To communicate important updates about the platform',
        'To improve user experience and platform features',
      ],
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'We use industry-standard security measures to protect your data.',
        'Your private keys are NEVER stored on our servers. Web3Auth uses MPC (Multi-Party Computation) technology.',
        'All API communications are encrypted using TLS/SSL.',
        'We regularly audit our smart contracts for security vulnerabilities.',
      ],
    },
    {
      icon: Globe,
      title: 'Third-Party Services',
      content: [
        'Web3Auth: For wallet creation and social login authentication',
        'Firebase: For user data storage and authentication',
        'Polygon Network: For blockchain transactions',
        'Biconomy: For gasless transaction relay services',
        'These services have their own privacy policies that govern their use of your data.',
      ],
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        'Access: You can request access to your personal data at any time.',
        'Deletion: You can request deletion of your off-chain data. Note that on-chain data cannot be deleted due to blockchain immutability.',
        'Portability: Your blockchain data is already publicly accessible and portable.',
        'Opt-out: You can disconnect your wallet at any time to stop using our services.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pt-20 pb-16">
      <Container className="px-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-subtle hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.home') || 'Home'}</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-neos-blue/10 border border-neos-blue/20">
              <Shield className="w-8 h-8 text-neos-blue" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              Privacy Policy
            </h1>
          </div>
          <p className="text-text-subtle">
            Last updated: January 23, 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-text-secondary leading-relaxed">
            AlmaNEO ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Web3 platform at almaneo.org.
          </p>
          <p className="text-text-secondary leading-relaxed mt-4">
            By using our services, you agree to the collection and use of information in accordance with this policy. AlmaNEO is a decentralized platform focused on AI democratization through blockchain technology.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="glass rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <section.icon className="w-6 h-6 text-jeong-orange" />
                <h2 className="text-xl font-semibold text-text-primary">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-neos-blue mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Smart Contract Transparency */}
        <div className="glass rounded-2xl p-6 md:p-8 mt-8 border border-neos-blue/20">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-neos-blue" />
            Smart Contract Transparency
          </h2>
          <p className="text-text-secondary mb-4">
            All our smart contracts are deployed on the Polygon network and are publicly verifiable:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white/5 rounded-lg">
              <span className="text-text-subtle">ALMAN Token:</span>
              <code className="block text-neos-blue/80 font-mono text-xs mt-1 break-all">
                0x261d686c9ea66a8404fBAC978d270a47eFa764bA
              </code>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <span className="text-text-subtle">Network:</span>
              <span className="block text-text-primary mt-1">Polygon Amoy Testnet</span>
            </div>
          </div>
          <p className="text-text-subtle text-sm mt-4">
            View all contracts on{' '}
            <a
              href="https://amoy.polygonscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neos-blue hover:underline"
            >
              Polygonscan
            </a>
          </p>
        </div>

        {/* Contact */}
        <div className="glass rounded-2xl p-6 md:p-8 mt-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-jeong-orange" />
            Contact Us
          </h2>
          <p className="text-text-secondary">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="mt-4 space-y-2 text-text-secondary">
            <li>Email: <a href="mailto:privacy@almaneo.org" className="text-neos-blue hover:underline">privacy@almaneo.org</a></li>
            <li>Website: <a href="https://almaneo.org" className="text-neos-blue hover:underline">https://almaneo.org</a></li>
            <li>Discord: <a href="https://discord.gg/almaneo" target="_blank" rel="noopener noreferrer" className="text-neos-blue hover:underline">AlmaNEO Community</a></li>
          </ul>
        </div>

        {/* Footer Note */}
        <p className="text-center text-text-subtle text-sm mt-12">
          This privacy policy is effective as of January 23, 2026 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
        </p>
      </Container>
    </div>
  );
}
