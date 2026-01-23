const fs = require('fs');
const path = require('path');

// Read the artifact file
const artifactPath = path.join(__dirname, '..', 'blockchain', 'artifacts', 'contracts', 'AEC1Token.sol', 'AEC1Token.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

// Write only the ABI
const outputPath = path.join(__dirname, 'contracts', 'abis', 'AEC1Token.json');
fs.writeFileSync(outputPath, JSON.stringify(artifact.abi, null, 2));

console.log('✅ ABI extracted successfully to:', outputPath);
