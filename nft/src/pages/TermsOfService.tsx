import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Link as MuiLink, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { Description, Warning, Gavel, AccountBalance, People, Security, ArrowBack } from '@mui/icons-material';

const TermsOfService: React.FC = () => {
  const sections = [
    {
      icon: <People />,
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using AlmaNEO NFT Marketplace (nft.almaneo.org), you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to update these terms at any time. Continued use after changes constitutes acceptance.',
        'You must be at least 18 years old to use this platform.',
      ],
    },
    {
      icon: <Description />,
      title: '2. Description of Services',
      content: [
        'AlmaNEO NFT Marketplace is a decentralized platform for buying, selling, and renting NFTs.',
        'Services include: NFT minting, fixed-price sales, auctions, rentals (ERC-4907/ERC-5006), and collection management.',
        'We support ERC-721 and ERC-1155 token standards on the Polygon network.',
        'Gasless transactions are available through Biconomy integration.',
        'We are NOT a financial institution and do not provide financial advice.',
      ],
    },
    {
      icon: <AccountBalance />,
      title: '3. NFT and Cryptocurrency Disclaimer',
      content: [
        'NFT values are highly volatile and speculative. You may lose some or all of your investment.',
        'We make no guarantees about NFT value, authenticity, or future performance.',
        'Creators are responsible for ensuring they have rights to the content they mint as NFTs.',
        'We do not endorse or verify the authenticity of any NFT or its underlying content.',
        'Royalties are enforced at the smart contract level and cannot be bypassed.',
      ],
    },
    {
      icon: <Warning />,
      title: '4. Risks and Disclaimers',
      content: [
        'BLOCKCHAIN RISKS: Transactions are irreversible. Lost private keys cannot be recovered.',
        'SMART CONTRACT RISKS: While audited, smart contracts may contain bugs or vulnerabilities.',
        'NFT RISKS: NFTs may become worthless. Metadata may become unavailable if IPFS nodes go offline.',
        'RENTAL RISKS: Rented NFTs must be returned by the expiry date. Failure may result in penalties.',
        'NO WARRANTIES: Services are provided "AS IS" without warranties of any kind.',
      ],
    },
    {
      icon: <Security />,
      title: '5. User Responsibilities',
      content: [
        'You are responsible for securing your wallet and private keys.',
        'You will not mint or sell NFTs containing illegal, harmful, or infringing content.',
        'You will not use the platform for money laundering or fraudulent activities.',
        'You will not attempt to exploit, hack, or manipulate the platform or other users.',
        'You will comply with all applicable laws in your jurisdiction.',
      ],
    },
    {
      icon: <Gavel />,
      title: '6. Limitation of Liability',
      content: [
        'AlmaNEO and its team are not liable for any direct, indirect, incidental, or consequential damages.',
        'This includes but is not limited to: loss of funds, lost NFTs, failed transactions, or service interruption.',
        'Our total liability is limited to the fees you paid to use our services (if any).',
        'We are not responsible for actions of other users or third-party services.',
      ],
    },
  ];

  return (
    <Box sx={{ py: 8, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Back Link */}
        <MuiLink
          component={Link}
          to="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mb: 4,
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <ArrowBack fontSize="small" />
          Back to Home
        </MuiLink>

        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'secondary.main',
                color: 'white',
              }}
            >
              <Description fontSize="large" />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              Terms of Service
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Last updated: January 23, 2026
          </Typography>
        </Box>

        {/* Important Notice */}
        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{ mb: 4 }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Important Notice
          </Typography>
          <Typography variant="body2">
            AlmaNEO NFT Marketplace is a legitimate Web3 platform. We are NOT a phishing site, scam, or fraudulent service. Our smart contracts are publicly deployed on the Polygon blockchain and can be verified by anyone. We do not ask for your private keys or seed phrases. Always verify you are on the official domain: <strong>nft.almaneo.org</strong>
          </Typography>
        </Alert>

        {/* Introduction */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to AlmaNEO NFT Marketplace. These Terms of Service ("Terms") govern your use of our NFT marketplace platform located at nft.almaneo.org. AlmaNEO NFT Marketplace is part of the AlmaNEO ecosystem, a decentralized platform focused on AI democratization through blockchain technology.
          </Typography>
        </Paper>

        {/* Sections */}
        {sections.map((section, index) => (
          <Paper key={index} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ color: 'primary.main' }}>{section.icon}</Box>
              <Typography variant="h5" fontWeight={600}>
                {section.title}
              </Typography>
            </Box>
            <List dense>
              {section.content.map((item, itemIndex) => (
                <ListItem key={itemIndex} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}

        {/* Marketplace Fees */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            7. Marketplace Fees
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Platform Fee: 2.5% of each sale (configurable by governance)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Creator Royalties: Set by creator (0-10%), enforced via ERC-2981" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Gas Fees: Covered by buyer (or gasless via Biconomy)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="ALMAN Token Discount: 5% off when paying with ALMAN tokens" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Kindness Score Discount: Up to 50% fee reduction based on Jeong-SBT tier" />
            </ListItem>
          </List>
        </Paper>

        {/* Intellectual Property */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            8. Intellectual Property
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The AlmaNEO name, logo, and branding are trademarks of the AlmaNEO Foundation. Our smart contracts are open source and available on GitHub.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            NFT creators retain copyright to their original works. Purchasing an NFT does not transfer copyright unless explicitly stated by the creator.
          </Typography>
        </Paper>

        {/* Contact */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            For questions about these Terms of Service, please contact us:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    Email:{' '}
                    <MuiLink href="mailto:legal@almaneo.org">legal@almaneo.org</MuiLink>
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    Main Website:{' '}
                    <MuiLink href="https://almaneo.org" target="_blank" rel="noopener">
                      https://almaneo.org
                    </MuiLink>
                  </>
                }
              />
            </ListItem>
          </List>
        </Paper>

        {/* Agreement */}
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            By using AlmaNEO NFT Marketplace, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <MuiLink component={Link} to="/privacy">
              Privacy Policy
            </MuiLink>
            <Typography color="text.secondary">|</Typography>
            <MuiLink component={Link} to="/">
              Return to Home
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService;
