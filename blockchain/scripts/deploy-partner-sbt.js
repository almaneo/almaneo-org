/**
 * PartnerSBT Deployment Script
 * Deploys PartnerSBT to Polygon Amoy Testnet
 *
 * Usage:
 *   npx hardhat run scripts/deploy-partner-sbt.js --network amoy
 */

const { ethers, upgrades } = require("hardhat");

// Verifier wallet (RENEWER_ROLE)
const VERIFIER_WALLET = "0x30073c2f47D41539dA6147324bb9257E0638144E";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=".repeat(60));
  console.log("PartnerSBT Deployment");
  console.log("=".repeat(60));
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${hre.network.name}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} POL`);
  console.log("=".repeat(60));

  try {
    // ========================================
    // Deploy PartnerSBT
    // ========================================
    console.log("\n[1/2] Deploying PartnerSBT...");
    const PartnerSBT = await ethers.getContractFactory("PartnerSBT");
    const partnerSBT = await upgrades.deployProxy(
      PartnerSBT,
      [deployer.address, "https://api.almaneo.org/metadata/partner/"],
      { initializer: "initialize", kind: "uups" }
    );
    await partnerSBT.waitForDeployment();
    const partnerSBTAddress = await partnerSBT.getAddress();
    console.log(`✅ PartnerSBT deployed to: ${partnerSBTAddress}`);

    // ========================================
    // Grant RENEWER_ROLE to Verifier wallet
    // ========================================
    console.log("\n[2/2] Granting RENEWER_ROLE to Verifier wallet...");
    const RENEWER_ROLE = await partnerSBT.RENEWER_ROLE();
    const tx = await partnerSBT.grantRole(RENEWER_ROLE, VERIFIER_WALLET);
    await tx.wait();
    console.log(`✅ RENEWER_ROLE granted to: ${VERIFIER_WALLET}`);

    // ========================================
    // Summary
    // ========================================
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\nDeployed Contract:");
    console.log("-".repeat(60));
    console.log(`PartnerSBT           : ${partnerSBTAddress}`);
    console.log("-".repeat(60));
    console.log(`\nRoles:`);
    console.log(`  MINTER_ROLE    → ${deployer.address} (deployer)`);
    console.log(`  RENEWER_ROLE   → ${VERIFIER_WALLET} (verifier)`);
    console.log(`  UPGRADER_ROLE  → ${deployer.address} (deployer)`);

    // Generate .env format for easy copy
    console.log("\n📋 Add to .env file:");
    console.log("-".repeat(60));
    console.log(`VITE_PARTNER_SBT_ADDRESS=${partnerSBTAddress}`);

    // Save deployment info to file
    const fs = require("fs");

    if (!fs.existsSync("./deployments")) {
      fs.mkdirSync("./deployments");
    }

    const deploymentInfo = {
      network: hre.network.name,
      chainId: (await ethers.provider.getNetwork()).chainId.toString(),
      deployer: deployer.address,
      verifier: VERIFIER_WALLET,
      timestamp: new Date().toISOString(),
      contracts: {
        PartnerSBT: partnerSBTAddress,
      },
    };

    fs.writeFileSync(
      `./deployments/${hre.network.name}-partner-sbt-deployment.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(
      `\n💾 Deployment info saved to ./deployments/${hre.network.name}-partner-sbt-deployment.json`
    );
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
