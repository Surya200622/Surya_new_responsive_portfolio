import fs from 'fs';

const fileContent = fs.readFileSync('src/data/calculatorData.js', 'utf8');

// We'll use a regex to extract the PACKAGES and PACKAGE_PRICES
// Actually, it's easier to just import it since it's ES module, but ts-node/tsx might fail.
// Let's just use a simple regex or execute a dynamic import.

// To execute a dynamic import in Node, we can just run it.
