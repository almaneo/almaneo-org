## 5. Technical Architecture

### Even if the technology is complex, the experience should be simple.

AlmaNEO's technical design principle is clear: **Users don't need to know anything about blockchain.** Complex technology operates behind the scenes, and users use the service in a familiar way.

---

### 5.1 System Overview

**AlmaNEO System 4-Layer Architecture:**

| Layers | Components | Roles |
|:---:|:---|:---|
| **1. User Layer** | AlmaNEO app, Web3Auth, AI chat interface | Direct user interaction |
| **2. Intelligence Layer** | AI model serving, DePIN network, model localization | AI service provision |
| **3. Trust Layer** | Kindness Score, biometric authentication, Jeong-SBT issuance | Identity and contribution verification |
| **4. Blockchain Layer** | Polygon Network, ALMAN Token, Smart Contracts | Decentralized Infrastructure |

**Data Flow:** User Touchpoint → Intelligence → Trust → Blockchain (Bidirectional Communication Between Layers)

---

### 5.2 Blockchain: Why Polygon

AlmaNEO is built on the **Polygon Network**.

#### Reasons for Selection

| Criteria | Polygon Advantages |
|------|---------------|
| **Gas Fee** | Less than $0.01 per transaction — Affordable even for users in the Global South |
| **Speed** | Transaction Confirmation within 2 seconds — Real-time Interaction |
| **Ecosystem** | Mature DeFi, NFT Ecosystem — Scalable |
| **Compatibility** | Fully Compatible with Ethereum — Easy to Expand |
| **Environment** | Energy Efficient Based on PoS — Sustainable |

#### Smart Contract Structure

### Smart Contract Structure

| Contract | Description | Main Role |
| :--- | :--- | :--- |
| **ALMAN Token** | ERC-20 standard token | Total supply: 8 billion, AI credit/staking/governance utility |
| **Jeong-SBT** | ERC-5484 (SBT) | Non-transferable soul token, Kindness Score on-chain record |
| **Kindness Registry** | Activity Verification Contract | Kindness activity verification and recording, peer-verified voting system |
| **Compute Agreement** | Resource Sharing Contract | DePIN node registration and rewards, automated computational resource allocation |
| **Governance** | DAO Contract | DAO proposal and voting, Kindness Score weighted voting rights |

---

### 5.3 User Experience: Zero Barrier Design

#### Web3Auth: Startup in 5 Seconds

The biggest barrier to entry in existing blockchain services is "wallet creation." Write down your 12 seed phrases, never lose them, and keep your private keys safe. Most people give up here.

**AlmaNEO is different.**

![AlmaNEO Technical](../assets/images/05.webp)

### Comparison of Traditional vs. AlmaNEO Onboarding

| Category | Traditional Blockchain Onboarding | AlmaNEO Onboarding |
| :--- | :--- | :--- |
| **Procedure** | Install wallet → Generate seed phrase → Store safely → Copy address → Purchase tokens → Send → Charge gas fee → Use service (8 steps) | Click "Log in with Google" → Complete (2 steps) |
| **Time required** | 30 minutes to 1 hour | **5 seconds** |
| **Bounce rate** | 90% or more | Minimal |

**How it works:**
- Web3Auth automatically creates a non-custodial wallet based on the user's social media account.
- Private keys are stored in a decentralized manner, making them inaccessible to neither the user nor AlmaNEO.
- Users can use all features without being aware of the wallet's existence.

#### Gasless Transactions: No Fee Concerns

Another barrier to blockchain adoption is "gas fees." Having to pay a fee for every transaction, no matter how small, can be a significant burden for new users.

**AlmaNEO's Solution:**
- ERC-4337 (Account Abstraction) is applied.
- The foundation covers the gas fee for basic transactions.
- Users can use the service without fees.

---

### 5.4 AI Infrastructure: Distributed and Optimized

#### Model Optimization

The AlmaNEO AI Hub provides optimized open-source AI models.

| Technology | Description | Effect |
|------|------|------|
| **Quantization** | Model Precision Adjustment | 70% reduction in capacity, 99% performance |
| **LoRA** | Lightweight fine-tuning | Local language optimization |
| **Edge Computing** | On-device computation | Available even when the internet is unstable |

#### DePIN Node Operation

Users around the world connect their computers to the AlmaNEO network to provide computational resources.

How to Participate in a Node:

1. Install the AlmaNEO Node software (Windows, Mac, Linux)
2. Set the amount of resources to share (GPU, CPU, storage)
3. Connect to the network
4. Receive ALMAN token rewards based on the amount of resources provided.

**Security:**
- All computations run in a sandbox environment within a Docker container.
- User data is protected with end-to-end encryption (E2EE).
- Even node operators cannot view user queries.

---

### 5.5 Identity Verification: Humans, Not Bots

Providing AI resources for free inevitably leads to abuse attempts. Bots will create tens of thousands of accounts to monopolize resources.

AlmaNEO implements the **"One Person, One Account"** principle through technology.

#### Multi-Layer Proof of Personhood

### Multi-Layer Proof of Personhood

1. **Layer 1: Device Authentication**
- Duplicate device detection using Device Fingerprint
2. **Layer 2: Social Authentication**
- Basic identity verification by linking social media accounts
3. **Layer 3: Biometric Authentication (Optional)**
- Achieve higher ratings with Face ID and other authentication methods
4. **Layer 4: Behavioral Analysis**
- Distinguish between bots and humans based on usage patterns
5. **Layer 5: Community Endorsement**
- Increased trust through recommendations from existing members

**Rating System:**

|Rating | Authentication Level | Daily Free AI Credits |
|------|----------|-------------------|
| Basic | Social Login Only | 10 times |
| Verified | Device + Social | 50 times |
| Trusted | Added biometric authentication | 200 times |
| Guardian | High Kindness Score | Unlimited |

---

### 5.6 Privacy: Your data belongs to you

AlmaNEO does not collect user data.

#### Privacy Principles

| Principles | Implementation |
|------|------|
| **No-Storage Conversations** | AI conversations are not stored on servers |
| **Local Encryption** | User data is encrypted on-device with AES-256 |
| **Anonymous Analytics** | Data is fully anonymized for service improvement |
| **Utilization of Zero-Knowledge Protocol** | Privacy protection when verifying Kindness Score |

> *"We don't know what you asked. All we know is how kind you are."*

---

### 5.7 Technology Roadmap Summary

| Phase | Period | Major Developments |
|------|------|----------|
| **Alpha** | 2025 Q1-Q2 | Testnet Deployment, Core Function Verification |
| **Beta** | 2025 Q3-Q4 | Mainnet Deployment, DePIN Node Expansion |
| **V1.0** | 2026 Q1 | Official Launch, Multilingual Support |
| **V2.0** | 2H26 | Advanced Features, Ecosystem Expansion |

---

*The following section details the ALMAN token's economic structure.*

