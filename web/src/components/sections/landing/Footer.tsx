import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImg from '../../../assets/logo.png';
import { Container } from '../../layout';
import { ChevronDown, ChevronUp, ExternalLink, Shield } from 'lucide-react';

// Deployed Contract Addresses - Polygon Amoy Testnet (TGE 2026-02-06)
const CONTRACTS = {
  core: [
    { name: 'ALMAN Token', address: '0x2B52bD2daFd82683Dcf0A994eb24427afb9C1c63', description: 'ERC-20 Governance Token (8B)' },
    { name: 'Jeong SBT', address: '0x41588D71373A6cf9E6f848250Ff7322d67Bb393c', description: 'Soulbound Token (Kindness Score)' },
    { name: 'Ambassador SBT', address: '0xf368d239a0b756533ff5688021A04Bc62Ab3c27B', description: 'Kindness Ambassador Badge' },
    { name: 'AlmaNEO Staking', address: '0xB691a0DF657A06209A3a4EF1A06a139B843b945B', description: '4-Tier Staking System' },
    { name: 'AlmaNEO Governor', address: '0x30E0FDEb1A730B517bF8851b7485107D7bc9dE33', description: 'DAO Governance' },
    { name: 'AlmaNEO Timelock', address: '0x464bca66C5B53b2163A89088213B1f832F0dF7c0', description: 'Execution Delay (2 days)' },
    { name: 'Kindness Airdrop', address: '0xfb89843F5a36A5E7E48A727225334E7b68fE22ac', description: 'Merkle Proof Airdrop' },
    { name: 'Token Vesting', address: '0x02fB6851B6cDc6B9176B42065bC9e0E0F6cf8F0E', description: 'Team Vesting (12mo cliff + 3yr)' },
    { name: 'Mining Pool', address: '0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9', description: 'Game Mining Rewards (800M)' },
  ],
  nft: [
    { name: 'AlmaNEO NFT (ERC-721)', address: '0xbFbE2b1eDB0f7F0675D5E449E508adE3697B8dfa', description: 'Single NFT Contract' },
    { name: 'AlmaNEO NFT (ERC-1155)', address: '0x50FC5Ecaa9517CCD24b86874b0E87ab6225E9cfF', description: 'Multi-Token NFT' },
    { name: 'NFT Marketplace', address: '0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b', description: 'Buy/Sell/Auction/Rental' },
    { name: 'Payment Manager', address: '0x2410Fa2958f2966DB85eF98aCbA4b9e360257E4e', description: 'Multi-Token Payments' },
    { name: 'Collection Manager', address: '0x1Ad2176A1181CFF2d82289f5cc5d143d9B3AFE1D', description: 'NFT Collections' },
  ],
};

const EXPLORER_URL = 'https://amoy.polygonscan.com/address/';

function ContractLink({ name, address, description }: { name: string; address: string; description: string }) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <a
      href={`${EXPLORER_URL}${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-text-primary">{name}</span>
          <ExternalLink className="w-3 h-3 text-text-subtle opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-[10px] sm:text-xs text-text-subtle truncate">{description}</p>
      </div>
      <code className="text-[10px] sm:text-xs font-mono text-neos-blue/80 sm:ml-2">{shortAddress}</code>
    </a>
  );
}

export function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation('common');

  return (
    <footer className="border-t border-white/10">
      {/* Contract Transparency Section */}
      <div className="py-6 bg-gradient-to-b from-transparent to-white/[0.02]">
        <Container className="px-4 sm:px-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 text-sm text-text-subtle hover:text-text-primary transition-colors group"
          >
            <Shield className="w-4 h-4 text-neos-blue" />
            <span>{t('footer.contracts')}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:translate-y-[2px] transition-transform" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-6 grid md:grid-cols-2 gap-6 animate-fade-in-up">
              {/* Core Contracts */}
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-semibold text-jeong-orange mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-jeong-orange"></span>
                  Core Contracts
                </h4>
                <div className="space-y-1">
                  {CONTRACTS.core.map((contract) => (
                    <ContractLink key={contract.address} {...contract} />
                  ))}
                </div>
              </div>

              {/* NFT Contracts */}
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-semibold text-neos-blue mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neos-blue"></span>
                  NFT Marketplace Contracts
                </h4>
                <div className="space-y-1">
                  {CONTRACTS.nft.map((contract) => (
                    <ContractLink key={contract.address} {...contract} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Main Footer */}
      <div className="py-8">
        <Container className="px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt="AlmaNEO" className="h-8 w-auto object-contain" />
            </Link>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <Link
                to="/privacy"
                className="text-text-subtle hover:text-text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-text-subtle hover:text-text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/whitepaper"
                className="text-text-subtle hover:text-text-primary transition-colors"
              >
                Whitepaper
              </Link>
              <Link
                to="/proposals/polygon-grant"
                className="text-text-subtle hover:text-text-primary transition-colors"
              >
                Pitch Deck
              </Link>
            </div>

            {/* Tagline & Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-text-subtle">{t('footer.tagline')}</p>
              <p className="text-xs text-text-subtle/70 mt-1">{t('footer.copyright')}</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-text-subtle/60 max-w-3xl mx-auto">
              AlmaNEO is a legitimate Web3 platform for AI democratization. This is not financial advice.
              Cryptocurrency investments carry risks. Please read our Terms of Service before participating.
              All smart contracts are publicly verifiable on Polygon.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
