/**
 * AlmaNEO Smart Contracts Deployment Script
 * Deploys all upgradeable contracts to Polygon Amoy Testnet
 *
 * Usage:
 *   npx hardhat run scripts/deploy.js --network amoy
 */

const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=".repeat(60));
  console.log("AlmaNEO Smart Contracts Deployment");
  console.log("=".repeat(60));
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${hre.network.name}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} POL`);
  console.log("=".repeat(60));

  // Foundation wallet address
  const FOUNDATION_WALLET = process.env.FOUNDATION_WALLET || deployer.address;
  console.log(`Foundation Wallet: ${FOUNDATION_WALLET}`);

  const deployedContracts = {};

  try {
    // ========================================
    // 1. Deploy ALMANToken
    // ========================================
    console.log("\n[1/6] Deploying ALMANToken...");
    const ALMANToken = await ethers.getContractFactory("ALMANToken");
    const almanToken = await upgrades.deployProxy(
      ALMANToken,
      [deployer.address, FOUNDATION_WALLET],
      { initializer: "initialize", kind: "uups" }
    );
    await almanToken.waitForDeployment();
    const almanTokenAddress = await almanToken.getAddress();
    deployedContracts.ALMANToken = almanTokenAddress;
    console.log(`✅ ALMANToken deployed to: ${almanTokenAddress}`);

    // ========================================
    // 2. Deploy JeongSBT
    // ========================================
    console.log("\n[2/6] Deploying JeongSBT...");
    const JeongSBT = await ethers.getContractFactory("JeongSBT");
    const jeongSBT = await upgrades.deployProxy(
      JeongSBT,
      [deployer.address, "https://api.almaneo.org/metadata/jeong/"],
      { initializer: "initialize", kind: "uups" }
    );
    await jeongSBT.waitForDeployment();
    const jeongSBTAddress = await jeongSBT.getAddress();
    deployedContracts.JeongSBT = jeongSBTAddress;
    console.log(`✅ JeongSBT deployed to: ${jeongSBTAddress}`);

    // ========================================
    // 3. Deploy ALMANStaking
    // ========================================
    console.log("\n[3/6] Deploying ALMANStaking...");
    const ALMANStaking = await ethers.getContractFactory("ALMANStaking");
    const almanStaking = await upgrades.deployProxy(
      ALMANStaking,
      [deployer.address, almanTokenAddress],
      { initializer: "initialize", kind: "uups" }
    );
    await almanStaking.waitForDeployment();
    const almanStakingAddress = await almanStaking.getAddress();
    deployedContracts.ALMANStaking = almanStakingAddress;
    console.log(`✅ ALMANStaking deployed to: ${almanStakingAddress}`);

    // Set JeongSBT in Staking contract
    await almanStaking.setJeongSBT(jeongSBTAddress);
    console.log("   - JeongSBT linked to Staking");

    // ========================================
    // 4. Deploy ALMANTimelock
    // ========================================
    console.log("\n[4/6] Deploying ALMANTimelock...");
    const ALMANTimelock = await ethers.getContractFactory("ALMANTimelock");

    // Timelock settings
    const MIN_DELAY = 2 * 24 * 60 * 60; // 2 days
    const PROPOSERS = []; // Will add Governor after deployment
    const EXECUTORS = [ethers.ZeroAddress]; // Anyone can execute

    const almanTimelock = await upgrades.deployProxy(
      ALMANTimelock,
      [MIN_DELAY, PROPOSERS, EXECUTORS, deployer.address],
      { initializer: "initialize", kind: "uups" }
    );
    await almanTimelock.waitForDeployment();
    const almanTimelockAddress = await almanTimelock.getAddress();
    deployedContracts.ALMANTimelock = almanTimelockAddress;
    console.log(`✅ ALMANTimelock deployed to: ${almanTimelockAddress}`);

    // ========================================
    // 5. Deploy ALMANGovernor
    // ========================================
    console.log("\n[5/6] Deploying ALMANGovernor...");
    const ALMANGovernor = await ethers.getContractFactory("ALMANGovernor");
    const almanGovernor = await upgrades.deployProxy(
      ALMANGovernor,
      [almanTokenAddress, almanTimelockAddress, deployer.address],
      { initializer: "initialize", kind: "uups" }
    );
    await almanGovernor.waitForDeployment();
    const almanGovernorAddress = await almanGovernor.getAddress();
    deployedContracts.ALMANGovernor = almanGovernorAddress;
    console.log(`✅ ALMANGovernor deployed to: ${almanGovernorAddress}`);

    // Grant PROPOSER_ROLE to Governor in Timelock
    const PROPOSER_ROLE = await almanTimelock.PROPOSER_ROLE();
    await almanTimelock.grantRole(PROPOSER_ROLE, almanGovernorAddress);
    console.log("   - Governor granted PROPOSER_ROLE in Timelock");

    // Set JeongSBT in Governor
    await almanGovernor.setJeongSBT(jeongSBTAddress);
    console.log("   - JeongSBT linked to Governor");

    // ========================================
    // 6. Deploy KindnessAirdrop
    // ========================================
    console.log("\n[6/6] Deploying KindnessAirdrop...");
    const KindnessAirdrop = await ethers.getContractFactory("KindnessAirdrop");
    const kindnessAirdrop = await upgrades.deployProxy(
      KindnessAirdrop,
      [deployer.address, almanTokenAddress],
      { initializer: "initialize", kind: "uups" }
    );
    await kindnessAirdrop.waitForDeployment();
    const kindnessAirdropAddress = await kindnessAirdrop.getAddress();
    deployedContracts.KindnessAirdrop = kindnessAirdropAddress;
    console.log(`✅ KindnessAirdrop deployed to: ${kindnessAirdropAddress}`);

    // ========================================
    // Post-deployment Setup
    // ========================================
    console.log("\n[Post] Setting up roles and permissions...");

    // Grant MINTER_ROLE to Airdrop contract
    const MINTER_ROLE = await almanToken.MINTER_ROLE();
    await almanToken.grantRole(MINTER_ROLE, kindnessAirdropAddress);
    console.log("   - KindnessAirdrop granted MINTER_ROLE");

    // Grant SCORE_UPDATER_ROLE to Staking contract (for future use)
    const SCORE_UPDATER_ROLE = await jeongSBT.SCORE_UPDATER_ROLE();
    await jeongSBT.grantRole(SCORE_UPDATER_ROLE, almanStakingAddress);
    console.log("   - ALMANStaking granted SCORE_UPDATER_ROLE in JeongSBT");

    // ========================================
    // Summary
    // ========================================
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\nDeployed Contract Addresses:");
    console.log("-".repeat(60));

    for (const [name, address] of Object.entries(deployedContracts)) {
      console.log(`${name.padEnd(20)} : ${address}`);
    }

    console.log("-".repeat(60));

    // Generate .env format for easy copy
    console.log("\n📋 Copy to .env file:");
    console.log("-".repeat(60));
    console.log(`VITE_ALMAN_TOKEN_ADDRESS=${deployedContracts.ALMANToken}`);
    console.log(`VITE_JEONG_SBT_ADDRESS=${deployedContracts.JeongSBT}`);
    console.log(`VITE_ALMAN_STAKING_ADDRESS=${deployedContracts.ALMANStaking}`);
    console.log(`VITE_ALMAN_TIMELOCK_ADDRESS=${deployedContracts.ALMANTimelock}`);
    console.log(`VITE_ALMAN_GOVERNOR_ADDRESS=${deployedContracts.ALMANGovernor}`);
    console.log(`VITE_KINDNESS_AIRDROP_ADDRESS=${deployedContracts.KindnessAirdrop}`);

    // Save deployment info to file
    const fs = require("fs");
    const deploymentInfo = {
      network: hre.network.name,
      chainId: (await ethers.provider.getNetwork()).chainId.toString(),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: deployedContracts,
    };

    fs.writeFileSync(
      `./deployments/${hre.network.name}-deployment.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`\n💾 Deployment info saved to ./deployments/${hre.network.name}-deployment.json`);

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
