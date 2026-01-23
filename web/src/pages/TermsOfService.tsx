import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, Scale, Coins, Users, Gavel } from 'lucide-react';
import { Container } from '../components/layout';

export default function TermsOfService() {
  const { t } = useTranslation('common');

  const sections = [
    {
      icon: Users,
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using AlmaNEO platform (almaneo.org), you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to update these terms at any time. Continued use after changes constitutes acceptance.',
        'You must be at least 18 years old to use this platform.',
      ],
    },
    {
      icon: FileText,
      title: '2. Description of Services',
      content: [
        'AlmaNEO is a decentralized Web3 platform focused on AI democratization.',
        'Services include: ALMAN token staking, governance participation, NFT marketplace, and Kindness Protocol rewards.',
        'We provide Web3Auth integration for easy wallet creation and social login.',
        'All blockchain interactions occur on the Polygon network.',
        'We are NOT a financial institution and do not provide financial advice.',
      ],
    },
    {
      icon: Coins,
      title: '3. Token and Cryptocurrency Disclaimer',
      content: [
        'ALMAN tokens are utility tokens for platform governance and participation, not investment securities.',
        'Cryptocurrency values are highly volatile. You may lose some or all of your investment.',
        'We make no guarantees about token value, liquidity, or future performance.',
        'You are solely responsible for your own investment decisions.',
        'Always conduct your own research (DYOR) before participating.',
      ],
    },
    {
      icon: AlertTriangle,
      title: '4. Risks and Disclaimers',
      content: [
        'BLOCKCHAIN RISKS: Transactions are irreversible. Lost private keys cannot be recovered.',
        'SMART CONTRACT RISKS: While audited, smart contracts may contain bugs or vulnerabilities.',
        'REGULATORY RISKS: Cryptocurrency regulations vary by jurisdiction and may change.',
        'TECHNICAL RISKS: Platform may experience downtime, bugs, or security incidents.',
        'NO WARRANTIES: Services are provided "AS IS" without warranties of any kind.',
      ],
    },
    {
      icon: Scale,
      title: '5. User Responsibilities',
      content: [
        'You are responsible for securing your wallet and private keys.',
        'You agree not to use the platform for illegal activities or money laundering.',
        'You will not attempt to exploit, hack, or manipulate the platform.',
        'You will comply with all applicable laws in your jurisdiction.',
        'You acknowledge that you are not a resident of a sanctioned country.',
      ],
    },
    {
      icon: Gavel,
      title: '6. Limitation of Liability',
      content: [
        'AlmaNEO and its team are not liable for any direct, indirect, incidental, or consequential damages.',
        'This includes but is not limited to: loss of funds, lost profits, data loss, or service interruption.',
        'Our total liability is limited to the amount you paid to use our services (if any).',
        'Some jurisdictions do not allow limitation of liability, so these may not apply to you.',
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
            <div className="p-3 rounded-xl bg-jeong-orange/10 border border-jeong-orange/20">
              <FileText className="w-8 h-8 text-jeong-orange" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              Terms of Service
            </h1>
          </div>
          <p className="text-text-subtle">
            Last updated: January 23, 2026
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-jeong-orange/10 border border-jeong-orange/30 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-jeong-orange flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-jeong-orange mb-2">
                Important Notice
              </h2>
              <p className="text-text-secondary">
                AlmaNEO is a legitimate Web3 platform for AI democratization. We are NOT a phishing site, scam, or fraudulent service. Our smart contracts are publicly deployed on the Polygon blockchain and can be verified by anyone. We do not ask for your private keys or seed phrases. Always verify you are on the official domain: <strong className="text-text-primary">almaneo.org</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-text-secondary leading-relaxed">
            Welcome to AlmaNEO. These Terms of Service ("Terms") govern your use of our website, platform, and services located at almaneo.org. AlmaNEO is a decentralized platform that aims to democratize AI access through blockchain technology, the Kindness Protocol, and community governance.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="glass rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <section.icon className="w-6 h-6 text-neos-blue" />
                <h2 className="text-xl font-semibold text-text-primary">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-jeong-orange mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Project Information */}
        <div className="glass rounded-2xl p-6 md:p-8 mt-8 border border-neos-blue/20">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            About AlmaNEO Project
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-text-secondary">
            <div>
              <h3 className="font-medium text-text-primary mb-2">Our Mission</h3>
              <p className="text-sm">
                AlmaNEO aims to reduce global AI inequality through the GAII (Global AI Inequality Index) and the Kindness Protocol. We believe AI should be accessible to everyone, not just the privileged few.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">Token Information</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Token Name:</strong> ALMAN</li>
                <li><strong>Total Supply:</strong> 8,000,000,000 (8 billion)</li>
                <li><strong>Network:</strong> Polygon</li>
                <li><strong>Standard:</strong> ERC-20 with Voting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="glass rounded-2xl p-6 md:p-8 mt-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            7. Intellectual Property
          </h2>
          <p className="text-text-secondary mb-4">
            The AlmaNEO name, logo, and branding are trademarks of the AlmaNEO Foundation. Our smart contracts are open source and can be found on our GitHub repository.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/almaneo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              GitHub Repository
            </a>
            <a
              href="https://amoy.polygonscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              Verified Contracts
            </a>
          </div>
        </div>

        {/* Governing Law */}
        <div className="glass rounded-2xl p-6 md:p-8 mt-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            8. Governing Law & Dispute Resolution
          </h2>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-neos-blue mt-2 flex-shrink-0" />
              <span>These Terms shall be governed by and construed in accordance with international blockchain standards and applicable laws.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-neos-blue mt-2 flex-shrink-0" />
              <span>Any disputes shall first be attempted to resolve through community governance mechanisms.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-neos-blue mt-2 flex-shrink-0" />
              <span>For unresolved disputes, binding arbitration may be required.</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="glass rounded-2xl p-6 md:p-8 mt-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Contact Information
          </h2>
          <p className="text-text-secondary mb-4">
            For questions about these Terms of Service, please contact us:
          </p>
          <ul className="space-y-2 text-text-secondary">
            <li>Email: <a href="mailto:legal@almaneo.org" className="text-neos-blue hover:underline">legal@almaneo.org</a></li>
            <li>Website: <a href="https://almaneo.org" className="text-neos-blue hover:underline">https://almaneo.org</a></li>
            <li>Discord: <a href="https://discord.gg/almaneo" target="_blank" rel="noopener noreferrer" className="text-neos-blue hover:underline">AlmaNEO Community</a></li>
          </ul>
        </div>

        {/* Agreement */}
        <div className="text-center mt-12 p-6 bg-white/5 rounded-2xl">
          <p className="text-text-secondary">
            By using AlmaNEO, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link
              to="/privacy"
              className="text-neos-blue hover:underline text-sm"
            >
              Privacy Policy
            </Link>
            <span className="text-text-subtle">|</span>
            <Link
              to="/"
              className="text-neos-blue hover:underline text-sm"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
