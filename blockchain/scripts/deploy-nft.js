const { ethers, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * AlmaNEO NFT Marketplace Deployment Script
 *
 * Deploys:
 * 1. AlmaNFT721 - ERC-721 NFT with rental (ERC-4907) and gasless support
 * 2. AlmaNFT1155 - ERC-1155 Multi-token with rental (ERC-5006) and gasless support
 * 3. AlmaPaymentManager - Multi-token payment processing with Jeong-SBT discounts
 * 4. AlmaCollectionManager - NFT collection management
 * 5. AlmaMarketplace - Full marketplace (listings, auctions, rentals)
 *
 * Prerequisites:
 * - Trusted Forwarder deployed (for gasless transactions)
 * - JeongSBT deployed (for Kindness Score integration)
 * - ALMANToken deployed (for ALMAN token payments)
 */

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying NFT contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);

  // ============ Configuration ============
  // Load previous deployment addresses
  const deploymentsPath = path.join(__dirname, "../deployments");
  let previousDeployment = {};

  // Try multiple file naming patterns
  const possibleFiles = [
    path.join(deploymentsPath, `deployment-${network.chainId}.json`),
    path.join(deploymentsPath, `amoy-deployment.json`),
    path.join(deploymentsPath, `polygon-deployment.json`),
  ];

  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      // Handle both formats: { contracts: {...} } and { ALMANToken: ... }
      previousDeployment = data.contracts || data;
      console.log("Found previous deployment from:", file);
      console.log("Contracts:", previousDeployment);
      break;
    }
  }

  // Trusted Forwarder address
  // For Polygon, use Biconomy or OpenZeppelin Defender Relayer
  // For testing, deploy a simple forwarder or use address(0) to disable
  const TRUSTED_FORWARDER = process.env.TRUSTED_FORWARDER || ethers.ZeroAddress;
  console.log("Trusted Forwarder:", TRUSTED_FORWARDER);

  // Previous contract addresses (from core deployment)
  const JEONG_SBT = previousDeployment.JeongSBT || process.env.JEONG_SBT || ethers.ZeroAddress;
  const ALMAN_TOKEN = previousDeployment.ALMANToken || process.env.ALMAN_TOKEN || ethers.ZeroAddress;

  console.log("JeongSBT:", JEONG_SBT);
  console.log("ALMANToken:", ALMAN_TOKEN);

  // Platform wallet (receives fees)
  const PLATFORM_WALLET = process.env.PLATFORM_WALLET || deployer.address;
  console.log("Platform Wallet:", PLATFORM_WALLET);

  // Fee configuration
  const PLATFORM_FEE_BPS = 250; // 2.5%
  const DEFAULT_ROYALTY_BPS = 500; // 5%
  const COLLECTION_CREATION_FEE = ethers.parseEther("0.01"); // 0.01 POL

  // Base URI for metadata
  const BASE_URI = process.env.NFT_BASE_URI || "https://api.almaneo.org/nft/";

  // ============ Deployment ============
  const deployedContracts = {};

  // Note: For UUPS proxies with immutable constructor args (trustedForwarder),
  // we need to deploy implementation first, then proxy
  // OpenZeppelin upgrades plugin handles this automatically

  // 1. Deploy AlmaNFT721
  console.log("\n1. Deploying AlmaNFT721...");
  const AlmaNFT721 = await ethers.getContractFactory("AlmaNFT721");
  const nft721 = await upgrades.deployProxy(
    AlmaNFT721,
    [deployer.address, BASE_URI, JEONG_SBT, DEFAULT_ROYALTY_BPS],
    {
      kind: "uups",
      constructorArgs: [TRUSTED_FORWARDER],
      unsafeAllow: ["constructor", "state-variable-immutable"],
    }
  );
  await nft721.waitForDeployment();
  deployedContracts.AlmaNFT721 = await nft721.getAddress();
  console.log("AlmaNFT721 deployed to:", deployedContracts.AlmaNFT721);

  // 2. Deploy AlmaNFT1155
  console.log("\n2. Deploying AlmaNFT1155...");
  const AlmaNFT1155 = await ethers.getContractFactory("AlmaNFT1155");
  const nft1155 = await upgrades.deployProxy(
    AlmaNFT1155,
    [deployer.address, BASE_URI, JEONG_SBT, DEFAULT_ROYALTY_BPS],
    {
      kind: "uups",
      constructorArgs: [TRUSTED_FORWARDER],
      unsafeAllow: ["constructor", "state-variable-immutable"],
    }
  );
  await nft1155.waitForDeployment();
  deployedContracts.AlmaNFT1155 = await nft1155.getAddress();
  console.log("AlmaNFT1155 deployed to:", deployedContracts.AlmaNFT1155);

  // 3. Deploy AlmaPaymentManager
  console.log("\n3. Deploying AlmaPaymentManager...");
  const AlmaPaymentManager = await ethers.getContractFactory("AlmaPaymentManager");
  const paymentManager = await upgrades.deployProxy(
    AlmaPaymentManager,
    [deployer.address, PLATFORM_WALLET, PLATFORM_FEE_BPS, JEONG_SBT, ALMAN_TOKEN],
    {
      kind: "uups",
      constructorArgs: [TRUSTED_FORWARDER],
      unsafeAllow: ["constructor", "state-variable-immutable"],
    }
  );
  await paymentManager.waitForDeployment();
  deployedContracts.AlmaPaymentManager = await paymentManager.getAddress();
  console.log("AlmaPaymentManager deployed to:", deployedContracts.AlmaPaymentManager);

  // 4. Deploy AlmaCollectionManager
  console.log("\n4. Deploying AlmaCollectionManager...");
  const AlmaCollectionManager = await ethers.getContractFactory("AlmaCollectionManager");
  const collectionManager = await upgrades.deployProxy(
    AlmaCollectionManager,
    [deployer.address, JEONG_SBT, PLATFORM_WALLET, COLLECTION_CREATION_FEE],
    {
      kind: "uups",
      constructorArgs: [TRUSTED_FORWARDER],
      unsafeAllow: ["constructor", "state-variable-immutable"],
    }
  );
  await collectionManager.waitForDeployment();
  deployedContracts.AlmaCollectionManager = await collectionManager.getAddress();
  console.log("AlmaCollectionManager deployed to:", deployedContracts.AlmaCollectionManager);

  // 5. Deploy AlmaMarketplace
  console.log("\n5. Deploying AlmaMarketplace...");
  const AlmaMarketplace = await ethers.getContractFactory("AlmaMarketplace");
  const marketplace = await upgrades.deployProxy(
    AlmaMarketplace,
    [
      deployer.address,
      deployedContracts.AlmaPaymentManager,
      deployedContracts.AlmaCollectionManager,
      JEONG_SBT,
    ],
    {
      kind: "uups",
      constructorArgs: [TRUSTED_FORWARDER],
      unsafeAllow: ["constructor", "state-variable-immutable"],
    }
  );
  await marketplace.waitForDeployment();
  deployedContracts.AlmaMarketplace = await marketplace.getAddress();
  console.log("AlmaMarketplace deployed to:", deployedContracts.AlmaMarketplace);

  // ============ Post-deployment Configuration ============
  console.log("\n6. Configuring contracts...");

  // 6.1 Add marketplace as operator for PaymentManager
  console.log("Adding Marketplace as PaymentManager operator...");
  const OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));
  await paymentManager.grantRole(OPERATOR_ROLE, deployedContracts.AlmaMarketplace);

  // 6.2 Approve NFT contracts in Marketplace
  console.log("Approving NFT contracts in Marketplace...");
  await marketplace.setApprovedNFTContract(deployedContracts.AlmaNFT721, true);
  await marketplace.setApprovedNFTContract(deployedContracts.AlmaNFT1155, true);

  // 6.3 Set collection manager in NFT contracts
  console.log("Setting CollectionManager in NFT contracts...");
  await nft721.setCollectionManager(deployedContracts.AlmaCollectionManager);
  await nft1155.setCollectionManager(deployedContracts.AlmaCollectionManager);

  // 6.4 Add USDC as payment token (Polygon USDC address)
  const USDC_ADDRESS = network.chainId === 137n
    ? "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" // Polygon USDC
    : network.chainId === 80002n
      ? "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582" // Amoy test USDC (may not exist)
      : ethers.ZeroAddress;

  if (USDC_ADDRESS !== ethers.ZeroAddress) {
    console.log("Adding USDC as payment token...");
    await paymentManager.setPaymentToken(USDC_ADDRESS, true, 100000, 6, "USDC"); // Min 0.1 USDC
  }

  // 6.5 Add ALMAN token as payment option
  if (ALMAN_TOKEN !== ethers.ZeroAddress) {
    console.log("Adding ALMAN as payment token...");
    await paymentManager.setPaymentToken(ALMAN_TOKEN, true, ethers.parseEther("1"), 18, "ALMAN"); // Min 1 ALMAN
  }

  // ============ Save Deployment ============
  console.log("\n7. Saving deployment...");

  // Merge with previous deployment
  const fullDeployment = {
    ...previousDeployment,
    ...deployedContracts,
    TrustedForwarder: TRUSTED_FORWARDER,
    deployedAt: new Date().toISOString(),
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
  };

  // Ensure deployments directory exists
  if (!fs.existsSync(deploymentsPath)) {
    fs.mkdirSync(deploymentsPath, { recursive: true });
  }

  const outputFile = path.join(deploymentsPath, `nft-deployment-${network.chainId}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(fullDeployment, null, 2));
  console.log("Deployment saved to:", outputFile);

  // ============ Summary ============
  console.log("\n========================================");
  console.log("NFT MARKETPLACE DEPLOYMENT COMPLETE");
  console.log("========================================");
  console.log("\nDeployed Contracts:");
  console.log("-------------------");
  Object.entries(deployedContracts).forEach(([name, address]) => {
    console.log(`${name}: ${address}`);
  });
  console.log("\nConfiguration:");
  console.log("-------------------");
  console.log(`Platform Fee: ${PLATFORM_FEE_BPS / 100}%`);
  console.log(`Default Royalty: ${DEFAULT_ROYALTY_BPS / 100}%`);
  console.log(`Collection Creation Fee: ${ethers.formatEther(COLLECTION_CREATION_FEE)} POL`);
  console.log(`Trusted Forwarder: ${TRUSTED_FORWARDER}`);
  console.log(`JeongSBT: ${JEONG_SBT}`);
  console.log(`ALMAN Token: ${ALMAN_TOKEN}`);
  console.log("\n========================================");

  // Verify contracts on Etherscan (if API key provided)
  if (process.env.POLYGONSCAN_API_KEY) {
    console.log("\nTo verify contracts, run:");
    console.log(`npx hardhat verify --network ${network.name === "unknown" ? "amoy" : network.name} ${deployedContracts.AlmaMarketplace}`);
  }

  return deployedContracts;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
