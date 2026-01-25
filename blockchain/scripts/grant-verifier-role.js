/**
 * Grant VERIFIER_ROLE to a new wallet
 *
 * This script grants VERIFIER_ROLE on AmbassadorSBT contract
 * Must be run by DEFAULT_ADMIN_ROLE holder (Foundation wallet)
 *
 * Usage:
 *   npx hardhat run scripts/grant-verifier-role.js --network amoy
 */

const { ethers } = require("hardhat");

// AmbassadorSBT Contract Address (Polygon Amoy)
const AMBASSADOR_SBT_ADDRESS = "0xf368d239a0b756533ff5688021A04Bc62Ab3c27B";

// New Verifier Wallet Address
const NEW_VERIFIER_ADDRESS = "0x30073c2f47D41539dA6147324bb9257E0638144E";

// VERIFIER_ROLE hash (keccak256("VERIFIER_ROLE"))
const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));

async function main() {
  console.log("=".repeat(60));
  console.log("Grant VERIFIER_ROLE Script");
  console.log("=".repeat(60));

  // Get signer (Foundation wallet from .env PRIVATE_KEY)
  const [signer] = await ethers.getSigners();
  console.log("\nAdmin wallet:", signer.address);

  // Connect to AmbassadorSBT contract
  const ambassadorSBT = await ethers.getContractAt(
    "AmbassadorSBT",
    AMBASSADOR_SBT_ADDRESS,
    signer
  );

  console.log("AmbassadorSBT:", AMBASSADOR_SBT_ADDRESS);
  console.log("New Verifier:", NEW_VERIFIER_ADDRESS);
  console.log("VERIFIER_ROLE:", VERIFIER_ROLE);

  // Check if already has role
  const hasRole = await ambassadorSBT.hasRole(VERIFIER_ROLE, NEW_VERIFIER_ADDRESS);
  if (hasRole) {
    console.log("\n✅ Wallet already has VERIFIER_ROLE");
    return;
  }

  // Grant VERIFIER_ROLE
  console.log("\nGranting VERIFIER_ROLE...");
  const tx = await ambassadorSBT.grantRole(VERIFIER_ROLE, NEW_VERIFIER_ADDRESS);
  console.log("Transaction hash:", tx.hash);

  // Wait for confirmation
  const receipt = await tx.wait();
  console.log("Confirmed in block:", receipt.blockNumber);

  // Verify
  const hasRoleAfter = await ambassadorSBT.hasRole(VERIFIER_ROLE, NEW_VERIFIER_ADDRESS);
  if (hasRoleAfter) {
    console.log("\n✅ VERIFIER_ROLE granted successfully!");
    console.log("\nNext steps:");
    console.log("1. Send ~0.5 POL to", NEW_VERIFIER_ADDRESS, "for gas fees");
    console.log("2. Add VERIFIER_PRIVATE_KEY to Vercel environment variables");
    console.log("3. Redeploy the web app");
  } else {
    console.log("\n❌ Failed to grant role");
  }

  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
