/**
 * Grant CLAIMER_ROLE on MiningPool to the Verifier wallet
 * Run: npx hardhat run scripts/grant-claimer-role.js --network amoy
 */

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Granting CLAIMER_ROLE with account:", deployer.address);

  // MiningPool proxy address (Amoy TGE 2026-02-06)
  const MINING_POOL_ADDRESS = "0xD447078530b6Ec3a2B8fe0ceb5A2a994d4e464b9";

  // Verifier wallet (same as ambassador API - already has POL for gas)
  const CLAIMER_ADDRESS = "0x30073c2f47D41539dA6147324bb9257E0638144E";

  const MiningPool = await hre.ethers.getContractFactory("MiningPool");
  const miningPool = MiningPool.attach(MINING_POOL_ADDRESS);

  // Get CLAIMER_ROLE hash
  const CLAIMER_ROLE = await miningPool.CLAIMER_ROLE();
  console.log("CLAIMER_ROLE hash:", CLAIMER_ROLE);

  // Check if already has role
  const hasRole = await miningPool.hasRole(CLAIMER_ROLE, CLAIMER_ADDRESS);
  if (hasRole) {
    console.log("✅ CLAIMER_ROLE already granted to:", CLAIMER_ADDRESS);
    return;
  }

  // Grant CLAIMER_ROLE
  console.log("Granting CLAIMER_ROLE to:", CLAIMER_ADDRESS);
  const tx = await miningPool.grantRole(CLAIMER_ROLE, CLAIMER_ADDRESS);
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("✅ CLAIMER_ROLE granted successfully!");

  // Verify
  const verified = await miningPool.hasRole(CLAIMER_ROLE, CLAIMER_ADDRESS);
  console.log("Verification - has CLAIMER_ROLE:", verified);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
