import React from 'react';
import { Box, Container, Typography, Link as MuiLink, IconButton, useTheme } from '@mui/material';
import { Twitter, Telegram, GitHub } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        mt: 'auto',
        bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' },
            gap: 4,
          }}
        >
          <Box sx={{ gridColumn: { xs: 'span 2', md: 'span 2' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              AlmaNEO NFT Marketplace
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The next generation NFT marketplace with rental support, Cold Code, Warm Soul - AI democratization platform.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary">
                <Twitter />
              </IconButton>
              <IconButton size="small" color="primary">
                <Telegram />
              </IconButton>
              <IconButton size="small" color="primary">
                <GitHub />
              </IconButton>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Marketplace
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="/explore" color="text.secondary" underline="hover">
                Explore
              </MuiLink>
              <MuiLink href="/collections" color="text.secondary" underline="hover">
                Collections
              </MuiLink>
              <MuiLink href="/auctions" color="text.secondary" underline="hover">
                Auctions
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="#" color="text.secondary" underline="hover">
                Help Center
              </MuiLink>
              <MuiLink href="#" color="text.secondary" underline="hover">
                Documentation
              </MuiLink>
              <MuiLink href="#" color="text.secondary" underline="hover">
                Blog
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="#" color="text.secondary" underline="hover">
                About
              </MuiLink>
              <MuiLink href="#" color="text.secondary" underline="hover">
                Careers
              </MuiLink>
              <MuiLink href="#" color="text.secondary" underline="hover">
                Contact
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/privacy" color="text.secondary" underline="hover">
                Privacy Policy
              </MuiLink>
              <MuiLink component={Link} to="/terms" color="text.secondary" underline="hover">
                Terms of Service
              </MuiLink>
              <MuiLink href="https://almaneo.org" target="_blank" rel="noopener" color="text.secondary" underline="hover">
                Main Website
              </MuiLink>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {/* Disclaimer */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: 'center',
              mb: 3,
              maxWidth: 800,
              mx: 'auto',
              opacity: 0.8,
            }}
          >
            AlmaNEO NFT Marketplace is a legitimate Web3 platform. This is not financial advice.
            NFT investments carry risks. Please read our Terms of Service before participating.
            All smart contracts are publicly verifiable on Polygon.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} AlmaNEO NFT Marketplace. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Powered by Polygon Amoy Testnet
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
