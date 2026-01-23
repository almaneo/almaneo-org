import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Link as MuiLink, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { Shield, Lock, Visibility, Storage, Public, Email, ArrowBack } from '@mui/icons-material';

const PrivacyPolicy: React.FC = () => {
  const theme = useTheme();

  const sections = [
    {
      icon: <Visibility />,
      title: 'Information We Collect',
      content: [
        'Wallet Address: When you connect your Web3 wallet (via Web3Auth or direct connection), we collect your public wallet address to identify your account.',
        'Social Login Data: If you use Web3Auth social login (Google, Facebook, etc.), we receive only basic profile information (name, email) that you authorize.',
        'On-Chain Activity: All blockchain transactions are publicly visible on the Polygon network. We may display your transaction history within our platform.',
        'NFT Data: Information about NFTs you create, buy, sell, or rent through our marketplace.',
        'Usage Analytics: We collect anonymous usage data to improve our services.',
      ],
    },
    {
      icon: <Storage />,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our NFT marketplace services',
        'To process blockchain transactions (buy, sell, auction, rental)',
        'To display your NFT collection and transaction history',
        'To verify ownership and facilitate transfers',
        'To improve user experience and platform features',
      ],
    },
    {
      icon: <Lock />,
      title: 'Data Security',
      content: [
        'We use industry-standard security measures to protect your data.',
        'Your private keys are NEVER stored on our servers. Web3Auth uses MPC (Multi-Party Computation) technology.',
        'All API communications are encrypted using TLS/SSL.',
        'We regularly audit our smart contracts for security vulnerabilities.',
        'NFT metadata is stored on IPFS for decentralized persistence.',
      ],
    },
    {
      icon: <Public />,
      title: 'Third-Party Services',
      content: [
        'Web3Auth: For wallet creation and social login authentication',
        'Biconomy: For gasless transaction relay services',
        'Polygon Network: For blockchain transactions',
        'IPFS: For decentralized NFT metadata storage',
        'These services have their own privacy policies that govern their use of your data.',
      ],
    },
    {
      icon: <Shield />,
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
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              <Shield fontSize="large" />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              Privacy Policy
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Last updated: January 23, 2026
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            AlmaNEO NFT Marketplace ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our NFT marketplace at nft.almaneo.org.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            By using our services, you agree to the collection and use of information in accordance with this policy. AlmaNEO NFT Marketplace is part of the AlmaNEO ecosystem, a decentralized platform focused on AI democratization through blockchain technology.
          </Typography>
        </Paper>

        {/* Sections */}
        {sections.map((section, index) => (
          <Paper key={index} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ color: 'secondary.main' }}>{section.icon}</Box>
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
                        bgcolor: 'primary.main',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}

        {/* Smart Contract Info */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            border: 1,
            borderColor: 'primary.main',
            borderStyle: 'solid',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Lock color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Smart Contract Transparency
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            All our smart contracts are deployed on the Polygon network and are publicly verifiable:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">NFT Marketplace:</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">Network:</Typography>
              <Typography variant="body2">Polygon Amoy Testnet</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Contact */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Email color="secondary" />
            <Typography variant="h5" fontWeight={600}>
              Contact Us
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            If you have any questions about this Privacy Policy, please contact us:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    Email:{' '}
                    <MuiLink href="mailto:privacy@almaneo.org">privacy@almaneo.org</MuiLink>
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    Website:{' '}
                    <MuiLink href="https://almaneo.org" target="_blank" rel="noopener">
                      https://almaneo.org
                    </MuiLink>
                  </>
                }
              />
            </ListItem>
          </List>
        </Paper>

        {/* Footer Note */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 6 }}>
          This privacy policy is effective as of January 23, 2026 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
        </Typography>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
