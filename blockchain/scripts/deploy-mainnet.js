/**
 * AlmaNEO TGE (Token Generation Event) Deployment Script
 *
 * Deploys all contracts and distributes 8B ALMAN tokens:
 * - Foundation Reserve:     2.0B (25%) → Foundation Wallet
 * - Community - Mining:     0.8B (10%) → MiningPool Contract
 * - Community - Staking:    1.0B (12.5%) → ALMANStaking Contract
 * - Community - Airdrop:    0.6B (7.5%) → KindnessAirdrop Contract
 * - Community - DAO:        0.8B (10%) → DAO Reserve Wallet
 * - Liquidity & Exchange:   1.2B (15%) → Liquidity Wallet
 * - Team & Advisors:        0.8B (10%) → TokenVesting Contract
 * - Kindness Grants:        0.8B (10%) → Grants Wallet
 *
 * Usage:
 *   npx hardhat run scripts/deploy-mainnet.js --network amoy    # Testnet
 *   npx hardhat run scripts/deploy-mainnet.js --network polygon  # Mainnet
 */

const { ethers, upgrades } = require("hardhat");

// ============ Token Distribution Constants ============
const DECIMALS = ethers.parseEther("1"); // 10^18
const toTokens = (n) => ethers.parseEther(String(n));

const DISTRIBUTION = {
  foundation:       toTokens(2_000_000_000),  // 2.0B - 25%
  communityMining:  toTokens(800_000_000),    // 0.8B - 10%
  communityStaking: toTokens(1_000_000_000),  // 1.0B - 12.5%
  communityAirdrop: toTokens(600_000_000),    // 0.6B - 7.5%
  communityDAO:     toTokens(800_000_000),    // 0.8B - 10%
  liquidity:        toTokens(1_200_000_000),  // 1.2B - 15%
  team:             toTokens(800_000_000),    // 0.8B - 10%
  kindnessGrants:   toTokens(800_000_000),    // 0.8B - 10%
};

// Vesting constants
const CLIFF_DURATION = 365 * 24 * 60 * 60;    // 12 months (365 days)
const VESTING_DURATION = 3 * 365 * 24 * 60 * 60; // 3 years (1095 days)

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=".repeat(70));
  console.log("AlmaNEO TGE (Token Generation Event) Deployment");
  console.log("=".repeat(70));
  console.log(`Deployer:  ${deployer.address}`);
  console.log(`Network:   ${hre.network.name}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance:   ${ethers.formatEther(balance)} POL`);
  console.log("=".repeat(70));

  // ============ Wallet Addresses ============
  // Amoy 테스트: 모든 지갑을 deployer로 시뮬레이션
  // Mainnet: 실제 Multi-sig 주소 사용
  const isTestnet = hre.network.name === "amoy" || hre.network.name === "hardhat";

  const FOUNDATION_WALLET = process.env.FOUNDATION_WALLET || deployer.address;
  const LIQUIDITY_WALLET = process.env.LIQUIDITY_WALLET || deployer.address;
  const GRANTS_WALLET = process.env.GRANTS_WALLET || deployer.address;
  const DAO_RESERVE_WALLET = process.env.DAO_RESERVE_WALLET || deployer.address;

  console.log(`\n📋 Wallet Configuration (${isTestnet ? "TESTNET - simulated" : "MAINNET"})`);
  console.log(`  Foundation:   ${FOUNDATION_WALLET}`);
  console.log(`  Liquidity:    ${LIQUIDITY_WALLET}`);
  console.log(`  Grants:       ${GRANTS_WALLET}`);
  console.log(`  DAO Reserve:  ${DAO_RESERVE_WALLET}`);

  const deployedContracts = {};

  try {
    // ========================================
    // Phase 1: Deploy Core Contracts
    // ========================================
    console.log("\n" + "=".repeat(70));
    console.log("Phase 1: Deploy Core Contracts");
    console.log("=".repeat(70));

    // 1. ALMANToken
    console.log("\n[1/8] Deploying ALMANToken...");
    const ALMANToken = await ethers.getContractFactory("ALMANToken");
    const almanToken = await upgrades.deployProxy(
      ALMANToken,
      [deployer.address, FOUNDATION_WALLET],
      { initializer: "initialize", kind: "uups" }
    );
    await almanToken.waitForDeployment();
    const almanTokenAddress = await almanToken.getAddress();
    deployedContracts.ALMANToken = almanTokenAddress;
    console.log(`  ✅ ALMANToken: ${almanTokenAddress}`);
    console.log(`     Foundation minted: 2,000,000,000 ALMAN`);

    // 2. JeongSBT
    console.log("\n[2/8] Deploying JeongSBT...");
    const JeongSBT = await ethers.getContractFactory("JeongSBT");
    const jeongSBT = await upgrades.deployProxy(
      JeongSBT,
      [deployer.address, "https://api.almaneo.org/metadata/jeong/"],
      { initializer: "initialize", kind: "uups" }
    );
    await jeongSBT.waitForDeployment();
    const jeongSBTAddress = await jeongSBT.getAddress();
    deployedContracts.JeongSBT = jeongSBTAddress;
    console.log(`  ✅ JeongSBT: ${jeongSBTAddress}`);

    // 3. ALMANStaking
    console.log("\n[3/8] Deploying ALMANStaking...");
    const ALMANStaking = await ethers.getContractFactory("ALMANStaking");
    const almanStaking = await upgrades.deployProxy(
      ALMANStaking,
      [deployer.address, almanTokenAddress],
      { initializer: "initialize", kind: "uups" }
    );
    await almanStaking.waitForDeployment();
    const almanStakingAddress = await almanStaking.getAddress();
    deployedContracts.ALMANStaking = almanStakingAddress;
    console.log(`  ✅ ALMANStaking: ${almanStakingAddress}`);
    await almanStaking.setJeongSBT(jeongSBTAddress);
    console.log(`     JeongSBT linked`);

    // 4. ALMANTimelock
    console.log("\n[4/8] Deploying ALMANTimelock...");
    const ALMANTimelock = await ethers.getContractFactory("ALMANTimelock");
    const MIN_DELAY = 2 * 24 * 60 * 60; // 2 days
    const almanTimelock = await upgrades.deployProxy(
      ALMANTimelock,
      [MIN_DELAY, [], [ethers.ZeroAddress], deployer.address],
      { initializer: "initialize", kind: "uups" }
    );
    await almanTimelock.waitForDeployment();
    const almanTimelockAddress = await almanTimelock.getAddress();
    deployedContracts.ALMANTimelock = almanTimelockAddress;
    console.log(`  ✅ ALMANTimelock: ${almanTimelockAddress}`);

    // 5. ALMANGovernor
    console.log("\n[5/8] Deploying ALMANGovernor...");
    const ALMANGovernor = await ethers.getContractFactory("ALMANGovernor");
    const almanGovernor = await upgrades.deployProxy(
      ALMANGovernor,
      [almanTokenAddress, almanTimelockAddress, deployer.address],
      { initializer: "initialize", kind: "uups" }
    );
    await almanGovernor.waitForDeployment();
    const almanGovernorAddress = await almanGovernor.getAddress();
    deployedContracts.ALMANGovernor = almanGovernorAddress;
    console.log(`  ✅ ALMANGovernor: ${almanGovernorAddress}`);
    const PROPOSER_ROLE = await almanTimelock.PROPOSER_ROLE();
    await almanTimelock.grantRole(PROPOSER_ROLE, almanGovernorAddress);
    console.log(`     Governor granted PROPOSER_ROLE`);
    await almanGovernor.setJeongSBT(jeongSBTAddress);
    console.log(`     JeongSBT linked`);

    // 6. KindnessAirdrop
    console.log("\n[6/8] Deploying KindnessAirdrop...");
    const KindnessAirdrop = await ethers.getContractFactory("KindnessAirdrop");
    const kindnessAirdrop = await upgrades.deployProxy(
      KindnessAirdrop,
      [deployer.address, almanTokenAddress],
      { initializer: "initialize", kind: "uups" }
    );
    await kindnessAirdrop.waitForDeployment();
    const kindnessAirdropAddress = await kindnessAirdrop.getAddress();
    deployedContracts.KindnessAirdrop = kindnessAirdropAddress;
    console.log(`  ✅ KindnessAirdrop: ${kindnessAirdropAddress}`);

    // 7. TokenVesting
    console.log("\n[7/8] Deploying TokenVesting...");
    const TokenVesting = await ethers.getContractFactory("TokenVesting");
    const tokenVesting = await upgrades.deployProxy(
      TokenVesting,
      [deployer.address, almanTokenAddress],
      { initializer: "initialize", kind: "uups" }
    );
    await tokenVesting.waitForDeployment();
    const tokenVestingAddress = await tokenVesting.getAddress();
    deployedContracts.TokenVesting = tokenVestingAddress;
    console.log(`  ✅ TokenVesting: ${tokenVestingAddress}`);

    // 8. MiningPool
    console.log("\n[8/8] Deploying MiningPool...");
    const MiningPool = await ethers.getContractFactory("MiningPool");
    const miningPool = await upgrades.deployProxy(
      MiningPool,
      [deployer.address, almanTokenAddress],
      { initializer: "initialize", kind: "uups" }
    );
    await miningPool.waitForDeployment();
    const miningPoolAddress = await miningPool.getAddress();
    deployedContracts.MiningPool = miningPoolAddress;
    console.log(`  ✅ MiningPool: ${miningPoolAddress}`);

    // ========================================
    // Phase 2: Mint & Distribute Tokens (8B Total)
    // ========================================
    console.log("\n" + "=".repeat(70));
    console.log("Phase 2: Mint & Distribute 8B ALMAN Tokens");
    console.log("=".repeat(70));

    // Foundation 2B는 initialize()에서 이미 민팅됨
    console.log("\n  ✅ Foundation Reserve: 2,000,000,000 ALMAN (already minted)");

    // Community & Ecosystem: 3.2B
    console.log("\n[Minting] Community & Ecosystem: 3,200,000,000 ALMAN...");
    const communityTotal = DISTRIBUTION.communityMining + DISTRIBUTION.communityStaking +
                           DISTRIBUTION.communityAirdrop + DISTRIBUTION.communityDAO;
    await almanToken.mintWithCategory(deployer.address, communityTotal, "community");
    console.log(`  ✅ Community minted to deployer: ${ethers.formatEther(communityTotal)} ALMAN`);

    // Liquidity & Exchange: 1.2B
    console.log("\n[Minting] Liquidity & Exchange: 1,200,000,000 ALMAN...");
    await almanToken.mintWithCategory(LIQUIDITY_WALLET, DISTRIBUTION.liquidity, "liquidity");
    console.log(`  ✅ Liquidity minted to: ${LIQUIDITY_WALLET}`);

    // Team & Advisors: 0.8B → Vesting Contract
    console.log("\n[Minting] Team & Advisors: 800,000,000 ALMAN...");
    await almanToken.mintWithCategory(tokenVestingAddress, DISTRIBUTION.team, "team");
    console.log(`  ✅ Team minted to Vesting: ${tokenVestingAddress}`);

    // Kindness Grants: 0.8B
    console.log("\n[Minting] Kindness Grants: 800,000,000 ALMAN...");
    await almanToken.mintWithCategory(GRANTS_WALLET, DISTRIBUTION.kindnessGrants, "kindness");
    console.log(`  ✅ Grants minted to: ${GRANTS_WALLET}`);

    // ========================================
    // Phase 3: Distribute Community Tokens
    // ========================================
    console.log("\n" + "=".repeat(70));
    console.log("Phase 3: Distribute Community Tokens (3.2B)");
    console.log("=".repeat(70));

    // Mining Pool: 0.8B
    console.log("\n[Transfer] Mining Pool: 800,000,000 ALMAN...");
    await almanToken.transfer(miningPoolAddress, DISTRIBUTION.communityMining);
    console.log(`  ✅ Transferred to MiningPool: ${miningPoolAddress}`);

    // Staking Rewards: 1.0B
    console.log("\n[Transfer] Staking Rewards: 1,000,000,000 ALMAN...");
    await almanToken.transfer(almanStakingAddress, DISTRIBUTION.communityStaking);
    console.log(`  ✅ Transferred to ALMANStaking: ${almanStakingAddress}`);

    // Airdrop: 0.6B
    console.log("\n[Transfer] Airdrop: 600,000,000 ALMAN...");
    await almanToken.transfer(kindnessAirdropAddress, DISTRIBUTION.communityAirdrop);
    console.log(`  ✅ Transferred to KindnessAirdrop: ${kindnessAirdropAddress}`);

    // DAO Reserve: 0.8B
    console.log("\n[Transfer] DAO Reserve: 800,000,000 ALMAN...");
    await almanToken.transfer(DAO_RESERVE_WALLET, DISTRIBUTION.communityDAO);
    console.log(`  ✅ Transferred to DAO Reserve: ${DAO_RESERVE_WALLET}`);

    // ========================================
    // Phase 4: Setup Roles & Permissions
    // ========================================
    console.log("\n" + "=".repeat(70));
    console.log("Phase 4: Setup Roles & Permissions");
    console.log("=".repeat(70));

    // MINTER_ROLE for KindnessAirdrop (legacy - no longer needed for minting, but kept for compatibility)
    const MINTER_ROLE = await almanToken.MINTER_ROLE();
    await almanToken.grantRole(MINTER_ROLE, kindnessAirdropAddress);
    console.log("  ✅ KindnessAirdrop → MINTER_ROLE");

    // SCORE_UPDATER_ROLE for Staking
    const SCORE_UPDATER_ROLE = await jeongSBT.SCORE_UPDATER_ROLE();
    await jeongSBT.grantRole(SCORE_UPDATER_ROLE, almanStakingAddress);
    console.log("  ✅ ALMANStaking → SCORE_UPDATER_ROLE (JeongSBT)");

    // ========================================
    // Phase 5: Verification
    // ========================================
    console.log("\n" + "=".repeat(70));
    console.log("Phase 5: Verification");
    console.log("=".repeat(70));

    // Check total supply
    const totalSupply = await almanToken.totalSupply();
    console.log(`\n  Total Supply: ${ethers.formatEther(totalSupply)} ALMAN`);

    // Check balances
    const balances = {
      Foundation: await almanToken.balanceOf(FOUNDATION_WALLET),
      MiningPool: await almanToken.balanceOf(miningPoolAddress),
      Staking: await almanToken.balanceOf(almanStakingAddress),
      Airdrop: await almanToken.balanceOf(kindnessAirdropAddress),
      DAOReserve: await almanToken.balanceOf(DAO_RESERVE_WALLET),
      Liquidity: await almanToken.balanceOf(LIQUIDITY_WALLET),
      Vesting: await almanToken.balanceOf(tokenVestingAddress),
      Grants: await almanToken.balanceOf(GRANTS_WALLET),
    };

    console.log("\n  📊 Token Distribution Verification:");
    console.log("  " + "-".repeat(55));
    let totalVerified = 0n;
    for (const [name, bal] of Object.entries(balances)) {
      const formatted = ethers.formatEther(bal);
      console.log(`  ${name.padEnd(15)} : ${formatted.padStart(25)} ALMAN`);
      totalVerified += bal;
    }
    console.log("  " + "-".repeat(55));
    console.log(`  ${"TOTAL".padEnd(15)} : ${ethers.formatEther(totalVerified).padStart(25)} ALMAN`);

    // Verify 8B
    const expected = toTokens(8_000_000_000);
    if (totalSupply === expected) {
      console.log("\n  ✅ Total supply matches: 8,000,000,000 ALMAN");
    } else {
      console.log(`\n  ❌ Total supply mismatch! Expected: ${ethers.formatEther(expected)}, Got: ${ethers.formatEther(totalSupply)}`);
    }

    // Check category minted
    console.log("\n  📊 Category Minted:");
    const categories = ["foundation", "community", "liquidity", "team", "kindness"];
    for (const cat of categories) {
      const minted = await almanToken.categoryMinted(cat);
      const remaining = await almanToken.getRemainingMintable(cat);
      console.log(`  ${cat.padEnd(12)} : minted ${ethers.formatEther(minted).padStart(20)}, remaining ${ethers.formatEther(remaining).padStart(20)}`);
    }

    // ========================================
    // Summary
    // ========================================
    console.log("\n" + "=".repeat(70));
    console.log("🎉 TGE DEPLOYMENT COMPLETE!");
    console.log("=".repeat(70));
    console.log("\nDeployed Contracts:");
    console.log("-".repeat(70));
    for (const [name, address] of Object.entries(deployedContracts)) {
      console.log(`  ${name.padEnd(20)} : ${address}`);
    }

    // Save deployment info
    const fs = require("fs");
    const deploymentInfo = {
      network: hre.network.name,
      chainId: (await ethers.provider.getNetwork()).chainId.toString(),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      type: "TGE",
      contracts: deployedContracts,
      wallets: {
        foundation: FOUNDATION_WALLET,
        liquidity: LIQUIDITY_WALLET,
        grants: GRANTS_WALLET,
        daoReserve: DAO_RESERVE_WALLET,
      },
      distribution: {
        foundation: "2,000,000,000",
        communityMining: "800,000,000",
        communityStaking: "1,000,000,000",
        communityAirdrop: "600,000,000",
        communityDAO: "800,000,000",
        liquidity: "1,200,000,000",
        team: "800,000,000",
        kindnessGrants: "800,000,000",
        total: "8,000,000,000",
      },
      vesting: {
        cliff: "12 months (365 days)",
        duration: "3 years (1095 days)",
      },
    };

    const deploymentsDir = "./deployments";
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `${hre.network.name}-tge-deployment.json`;
    fs.writeFileSync(
      `${deploymentsDir}/${filename}`,
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`\n💾 Saved to: ./deployments/${filename}`);

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
