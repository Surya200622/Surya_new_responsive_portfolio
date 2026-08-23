import fs from 'fs';
import { PACKAGES, PACKAGE_PRICES } from '../src/data/calculatorData.js';

const newPackages = { ...PACKAGES };
for (const [projectType, pkgs] of Object.entries(newPackages)) {
    if (PACKAGE_PRICES[projectType]) {
        for (const pkg of pkgs) {
            if (PACKAGE_PRICES[projectType][pkg.id]) {
                pkg.cost = PACKAGE_PRICES[projectType][pkg.id];
            } else {
                pkg.cost = 0;
            }
        }
    }
}

const packagesString = JSON.stringify(newPackages, null, 2);

let content = fs.readFileSync('./src/data/calculatorData.js', 'utf8');

// The file has:
// export const PACKAGES = { ... };
// export const PACKAGE_PRICES = { ... };

// Let's replace the whole PACKAGES block
content = content.replace(/export const PACKAGES = \{[\s\S]*?\n\};\n\nexport const PACKAGE_PRICES =/m, `export const PACKAGES = ${packagesString};\n\nexport const PACKAGE_PRICES =`);

// Now let's remove PACKAGE_PRICES block
content = content.replace(/export const PACKAGE_PRICES = \{[\s\S]*?\n\};\n\nexport const CREATIVE_SERVICE_PRICES/m, `export const CREATIVE_SERVICE_PRICES`);

fs.writeFileSync('./src/data/calculatorData.js', content, 'utf8');
console.log('Done!');
