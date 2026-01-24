/**
 * AmbassadorSBT Deployment Script
 * Deploys AmbassadorSBT to Polygon Amoy Testnet
 *
 * Usage:
 *   npx hardhat run scripts/deploy-ambassador.js --network amoy
 */

const { ethers, upgrades } = require("hardhat");

// Existing deployed contracts (Polygon Amoy)
const DEPLOYED_CONTRACTS = {
  ALMANToken: "0x261d686c9ea66a8404fBAC978d270a47eFa764bA",
  JeongSBT: "0x8d8eECb2072Df7547C22e12C898cB9e2326f827D",
  ALMANStaking: "0x86777d1834c07E1B08E22FE3E8Ec0AD25a5451ce",
  ALMANTimelock: "0xB73532c01CCCE4Ad6e8816fa4CB0E2aeDfe9C8C2",
  ALMANGovernor: "0xA42A1386a84b146D36a8AF431D5E1d6e845268b8",
  KindnessAirdrop: "0xadB3e6Ef342E3aDa2e31a2638d5D9566c26fb538",
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=".repeat(60));
  console.log("AmbassadorSBT Deployment");
  console.log("=".repeat(60));
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${hre.network.name}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} POL`);
  console.log("=".repeat(60));

  try {
    // ========================================
    // Deploy AmbassadorSBT
    // ========================================
    console.log("\n[1/1] Deploying AmbassadorSBT...");
    const AmbassadorSBT = await ethers.getContractFactory("AmbassadorSBT");
    const ambassadorSBT = await upgrades.deployProxy(
      AmbassadorSBT,
      [deployer.address, "https://api.almaneo.org/metadata/ambassador/"],
      { initializer: "initialize", kind: "uups" }
    );
    await ambassadorSBT.waitForDeployment();
    const ambassadorSBTAddress = await ambassadorSBT.getAddress();
    console.log(`✅ AmbassadorSBT deployed to: ${ambassadorSBTAddress}`);

    // ========================================
    // Post-deployment Setup
    // ========================================
    console.log("\n[Post] Setting up roles...");

    // Grant VERIFIER_ROLE to deployer (for testing)
    // In production, this should be a backend service or multisig
    const VERIFIER_ROLE = await ambassadorSBT.VERIFIER_ROLE();
    console.log(`   - VERIFIER_ROLE: ${VERIFIER_ROLE}`);
    console.log("   - Deployer already has VERIFIER_ROLE (via DEFAULT_ADMIN_ROLE)");

    // ========================================
    // Summary
    // ========================================
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\nDeployed Contract:");
    console.log("-".repeat(60));
    console.log(`AmbassadorSBT        : ${ambassadorSBTAddress}`);
    console.log("-".repeat(60));

    // Generate .env format for easy copy
    console.log("\n📋 Add to .env file:");
    console.log("-".repeat(60));
    console.log(`VITE_AMBASSADOR_SBT_ADDRESS=${ambassadorSBTAddress}`);

    // Save deployment info to file
    const fs = require("fs");

    // Create deployments directory if it doesn't exist
    if (!fs.existsSync("./deployments")) {
      fs.mkdirSync("./deployments");
    }

    const deploymentInfo = {
      network: hre.network.name,
      chainId: (await ethers.provider.getNetwork()).chainId.toString(),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        ...DEPLOYED_CONTRACTS,
        AmbassadorSBT: ambassadorSBTAddress,
      },
    };

    fs.writeFileSync(
      `./deployments/${hre.network.name}-ambassador-deployment.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(
      `\n💾 Deployment info saved to ./deployments/${hre.network.name}-ambassador-deployment.json`
    );

    // Print all contract addresses
    console.log("\n" + "=".repeat(60));
    console.log("ALL DEPLOYED CONTRACTS (Polygon Amoy)");
    console.log("=".repeat(60));
    for (const [name, address] of Object.entries(deploymentInfo.contracts)) {
      console.log(`${name.padEnd(20)} : ${address}`);
    }
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
