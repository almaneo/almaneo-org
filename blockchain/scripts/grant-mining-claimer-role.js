/**
 * Grant CLAIMER_ROLE on MiningPool to Verifier wallet
 *
 * This enables the Verifier to call claimForUser() via the mining-claim API.
 * Must be run by DEFAULT_ADMIN_ROLE holder (Foundation wallet).
 *
 * Usage:
 *   npx hardhat run scripts/grant-mining-claimer-role.js --network amoy
 */

const { ethers } = require("hardhat");

// MiningPool Contract Address (Polygon Amoy - TGE 2026-02-06)
const MINING_POOL_ADDRESS = "0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9";

// Verifier Wallet Address
const VERIFIER_ADDRESS = "0x30073c2f47D41539dA6147324bb9257E0638144E";

// Role hashes
const CLAIMER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("CLAIMER_ROLE"));

async function main() {
  console.log("=".repeat(60));
  console.log("Grant CLAIMER_ROLE on MiningPool");
  console.log("=".repeat(60));

  // Get signer (Foundation wallet from .env PRIVATE_KEY)
  const [signer] = await ethers.getSigners();
  console.log("\nAdmin wallet:", signer.address);
  console.log("MiningPool:", MINING_POOL_ADDRESS);
  console.log("Verifier:", VERIFIER_ADDRESS);

  // Connect to MiningPool contract
  const miningPool = await ethers.getContractAt(
    "MiningPool",
    MINING_POOL_ADDRESS,
    signer
  );

  // Check current roles
  console.log("\n--- Current Roles ---");
  const hasClaimer = await miningPool.hasRole(CLAIMER_ROLE, VERIFIER_ADDRESS);
  console.log(`CLAIMER_ROLE: ${hasClaimer ? '✅ Already granted' : '❌ Not granted'}`);

  // Also check if deployer has it
  const deployerHasClaimer = await miningPool.hasRole(CLAIMER_ROLE, signer.address);
  console.log(`CLAIMER_ROLE (deployer): ${deployerHasClaimer ? '✅' : '❌'}`);

  // Grant CLAIMER_ROLE if not already granted
  if (!hasClaimer) {
    console.log("\nGranting CLAIMER_ROLE to Verifier...");
    const tx = await miningPool.grantRole(CLAIMER_ROLE, VERIFIER_ADDRESS);
    console.log("Transaction hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Confirmed in block:", receipt.blockNumber);

    // Verify
    const hasRoleAfter = await miningPool.hasRole(CLAIMER_ROLE, VERIFIER_ADDRESS);
    console.log(`CLAIMER_ROLE: ${hasRoleAfter ? '✅ Granted successfully!' : '❌ Failed to grant'}`);
  }

  console.log("\n--- Final Role Summary ---");
  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  console.log(`CLAIMER_ROLE (Verifier):  ${await miningPool.hasRole(CLAIMER_ROLE, VERIFIER_ADDRESS) ? '✅' : '❌'}`);
  console.log(`CLAIMER_ROLE (Deployer):  ${await miningPool.hasRole(CLAIMER_ROLE, signer.address) ? '✅' : '❌'}`);
  console.log(`ADMIN_ROLE (Deployer):    ${await miningPool.hasRole(DEFAULT_ADMIN_ROLE, signer.address) ? '✅' : '❌'}`);

  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
