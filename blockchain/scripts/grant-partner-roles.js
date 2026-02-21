/**
 * Grant MINTER_ROLE on PartnerSBT to Verifier wallet
 *
 * This enables the Verifier to mint Partner SBTs via the admin panel.
 * Must be run by DEFAULT_ADMIN_ROLE holder (Foundation wallet).
 *
 * Usage:
 *   npx hardhat run scripts/grant-partner-roles.js --network amoy
 */

const { ethers } = require("hardhat");

// PartnerSBT Contract Address (Polygon Amoy)
const PARTNER_SBT_ADDRESS = "0xC4380DEA33056Ce2899AbD3FDf16f564AB90cC08";

// Verifier Wallet Address
const VERIFIER_ADDRESS = "0x30073c2f47D41539dA6147324bb9257E0638144E";

// Role hashes
const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

async function main() {
  console.log("=".repeat(60));
  console.log("Grant MINTER_ROLE on PartnerSBT");
  console.log("=".repeat(60));

  // Get signer (Foundation wallet from .env PRIVATE_KEY)
  const [signer] = await ethers.getSigners();
  console.log("\nAdmin wallet:", signer.address);
  console.log("PartnerSBT:", PARTNER_SBT_ADDRESS);
  console.log("Verifier:", VERIFIER_ADDRESS);

  // Connect to PartnerSBT contract
  const partnerSBT = await ethers.getContractAt(
    "PartnerSBT",
    PARTNER_SBT_ADDRESS,
    signer
  );

  // Check current roles
  console.log("\n--- Current Roles ---");
  const hasMinter = await partnerSBT.hasRole(MINTER_ROLE, VERIFIER_ADDRESS);
  console.log(`MINTER_ROLE: ${hasMinter ? '✅ Already granted' : '❌ Not granted'}`);

  // Grant MINTER_ROLE if not already granted
  if (!hasMinter) {
    console.log("\nGranting MINTER_ROLE...");
    const tx = await partnerSBT.grantRole(MINTER_ROLE, VERIFIER_ADDRESS);
    console.log("Transaction hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Confirmed in block:", receipt.blockNumber);

    // Verify
    const hasRoleAfter = await partnerSBT.hasRole(MINTER_ROLE, VERIFIER_ADDRESS);
    console.log(`MINTER_ROLE: ${hasRoleAfter ? '✅ Granted successfully!' : '❌ Failed to grant'}`);
  }

  console.log("\n--- Final Role Summary ---");
  const RENEWER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("RENEWER_ROLE"));
  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

  console.log(`MINTER_ROLE:  ${await partnerSBT.hasRole(MINTER_ROLE, VERIFIER_ADDRESS) ? '✅' : '❌'}`);
  console.log(`RENEWER_ROLE: ${await partnerSBT.hasRole(RENEWER_ROLE, VERIFIER_ADDRESS) ? '✅' : '❌'}`);
  console.log(`ADMIN_ROLE:   ${await partnerSBT.hasRole(DEFAULT_ADMIN_ROLE, VERIFIER_ADDRESS) ? '✅' : '❌'} (kept on Foundation only)`);

  console.log("\nNote: Revoke operation requires DEFAULT_ADMIN_ROLE (Foundation wallet only)");
  console.log("The admin panel will show an appropriate error for revoke attempts.");
  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
