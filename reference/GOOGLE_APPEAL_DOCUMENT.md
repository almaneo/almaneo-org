# Google Cloud Policy Violation Appeal 

**Date:** January 23, 2026
**Project ID:** almaneo-org
**Affected URLs:**
- https://almaneo.org
- https://www.almaneo.org/index.html
- https://nft.almaneo.org

---

## 1. Executive Summary

We are writing to appeal the phishing classification of our website almaneo.org. This is a **false positive** detection. AlmaNEO is a legitimate Web3/blockchain project focused on AI democratization, not a phishing or fraudulent service.

---

## 2. Project Overview

### What is AlmaNEO?

AlmaNEO (formerly NEO-SAPIENS) is a decentralized platform that aims to reduce global AI inequality through:

1. **GAII (Global AI Inequality Index)** - A metric to measure AI access disparity worldwide
2. **Kindness Protocol** - A Proof of Humanity consensus mechanism, (progressing)
3. **ALMAN Token** - An ERC-20 governance token (8 billion supply for 8 billion humans)(progressing)

### Our Mission

"Cold Code, Warm Soul" - We believe AI should be accessible to everyone, not just the privileged few. Our platform connects Global North resources with Global South communities.

---

## 3. Why This is a False Positive

### Common False Positive Triggers

Our website contains elements that automated phishing detection systems may misidentify:

| Element | Legitimate Purpose |
|---------|-------------------|
| Wallet Connection Button | Standard Web3 authentication using Web3Auth SDK |
| Social Login (Google/Facebook) | Web3Auth MPC-based wallet creation |
| Cryptocurrency Terms | Utility token for platform governance |
| Staking/Airdrop Pages | Standard DeFi features |
| NFT Marketplace | Digital art trading platform |

### Key Differentiators from Phishing Sites

1. **We NEVER ask for private keys or seed phrases**
2. **We use official Web3Auth SDK** (verified)
3. **All smart contracts are publicly deployed and verifiable**
4. **We have legitimate business documentation**

---

## 4. Verification Evidence

### Smart Contract Addresses (Polygon Amoy Testnet)

All contracts are publicly verifiable on Polygonscan:

**Core Contracts:**
| Contract | Address | Verified |
|----------|---------|----------|
| ALMAN Token | `0x261d686c9ea66a8404fBAC978d270a47eFa764bA` | ✅ |
| Jeong SBT | `0x8d8eECb2072Df7547C22e12C898cB9e2326f827D` | ✅ |
| AlmaNEO Staking | `0x86777d1834c07E1B08E22FE3E8Ec0AD25a5451ce` | ✅ |
| AlmaNEO Governor | `0xA42A1386a84b146D36a8AF431D5E1d6e845268b8` | ✅ |
| AlmaNEO Timelock | `0xB73532c01CCCE4Ad6e8816fa4CB0E2aeDfe9C8C2` | ✅ |
| Kindness Airdrop | `0xadB3e6Ef342E3aDa2e31a2638d5D9566c26fb538` | ✅ |

**NFT Marketplace Contracts:**
| Contract | Address | Verified |
|----------|---------|----------|
| AlmaNEO NFT (ERC-721) | `0xbFbE2b1eDB0f7F0675D5E449E508adE3697B8dfa` | ✅ |
| AlmaNEO NFT (ERC-1155) | `0x50FC5Ecaa9517CCD24b86874b0E87ab6225E9cfF` | ✅ |
| NFT Marketplace | `0x27EDe449fF2367aB00B5b04A1A1BcCdE03F8E76b` | ✅ |
| Payment Manager | `0x2410Fa2958f2966DB85eF98aCbA4b9e360257E4e` | ✅ |
| Collection Manager | `0x1Ad2176A1181CFF2d82289f5cc5d143d9B3AFE1D` | ✅ |

**Polygonscan Links:**
- https://amoy.polygonscan.com/address/0x261d686c9ea66a8404fBAC978d270a47eFa764bA

### Third-Party Services (All Legitimate)

| Service | Purpose | Verification |
|---------|---------|--------------|
| Web3Auth | Wallet authentication | https://web3auth.io (Official partner) |
| Biconomy | Gasless transactions | https://biconomy.io (Official partner) |
| Firebase | Backend hosting | Google's own service |
| Polygon | Blockchain network | https://polygon.technology |

### Domain Registration

- **Domain:** almaneo.org
- **Registrar:** namecheap
- **Registration Date:** 01/22/2026

---

## 5. Security Measures Implemented

### Now Added (After Alert)

1. ✅ **Privacy Policy page** - `/privacy`
2. ✅ **Terms of Service page** - `/terms`
3. ✅ **Legal disclaimer in footer**
4. ✅ **Smart contract transparency section**

### Existing Security Features

1. ✅ Web3Auth MPC wallet (no private key exposure)
2. ✅ HTTPS/TLS encryption
3. ✅ Open source smart contracts
4. ✅ No credential harvesting forms
5. ✅ No fake login pages

---

## 6. Project Documentation

### Available Resources

1. **Whitepaper:** https://almaneo.org/whitepaper (13 sections, 14 languages)
2. **GitHub:** https://github.com/almaneo/almaneo-org
3. **Smart Contracts:** Verified on Polygonscan


### Token Economics

- **Token Name:** ALMAN
- **Total Supply:** 8,000,000,000 (8 billion)
- **Network:** Polygon
- **Standard:** ERC-20 with Voting capability
- **Purpose:** Governance and platform utility (NOT an investment security)

---

## 7. Contact Information

**Project Name:** AlmaNEO
**Official Domain:** almaneo.org
**Email:** info@almaneo.org, ruca@almaneo.org, patrick@almaneo.org


---

## 8. Request

We respectfully request that Google:

1. **Remove the phishing classification** from almaneo.org and all subdomains
2. **Restore access** to our Firebase Hosting services
3. **Whitelist** our domains to prevent future false positives

We are committed to maintaining a legitimate, secure platform and will cooperate with any additional verification requirements.

---

## 9. Appeal Submission Checklist

Use this checklist when submitting the appeal:

- [ ] Log in to Google Cloud Console
- [ ] Navigate to the affected project (almaneo-org)
- [ ] Click the appeal link in the violation email
- [ ] Copy relevant sections from this document
- [ ] Attach evidence (screenshots of legal pages, contract links)
- [ ] Submit and save confirmation number

### Short Appeal Text (For Form Submission)

```
This is a legitimate Web3/blockchain project for AI democratization called AlmaNEO.

FALSE POSITIVE REASONS:
1. Wallet connection is standard Web3 functionality using official Web3Auth SDK
2. We NEVER collect private keys or seed phrases
3. All smart contracts are publicly deployed on Polygon: 0x261d686c9ea66a8404fBAC978d270a47eFa764bA
4. We have added Privacy Policy (/privacy) and Terms of Service (/terms) pages
5. We are a registered domain with valid SSL

VERIFICATION:
- Polygonscan: https://amoy.polygonscan.com/address/0x261d686c9ea66a8404fBAC978d270a47eFa764bA
- Web3Auth Partner: Official integration
- Firebase: Your own hosting service

CONTACT: support@almaneo.org

This appears to be a false positive due to cryptocurrency-related content triggering automated detection. We request immediate review and restoration of our services.
```

---

## 10. Google Search Console Steps

After appeal submission:

1. Go to https://search.google.com/search-console
2. Add property: almaneo.org (verify via DNS or HTML file)
3. Navigate to Security & Manual Actions > Security Issues
4. Click "Request Review" if flagged
5. Provide same explanation as above

---

**Document prepared by:** AlmaNEO Development Team
**Last updated:** January 23, 2026
