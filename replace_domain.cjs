const fs = require('fs');
const path = require('path');

const targetStr = 'suryacs-websolutions.vercel.app';
const replacementStr = 'suryacs-websolutions.vercel.app';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./');
let updatedCount = 0;
files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetStr)) {
      const newContent = content.split(targetStr).join(replacementStr);
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`Updated ${file}`);
      updatedCount++;
    }
  } catch (e) {
    // Ignore errors
  }
});
console.log(`Total files updated: ${updatedCount}`);
