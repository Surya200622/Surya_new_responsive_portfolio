const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else {
      if (['.js', '.jsx', '.ts', '.tsx', '.json'].includes(path.extname(fullPath))) {
        let content = fs.readFileSync(fullPath, 'utf8');
        const newContent = content
          .replace(/Python Developer/g, 'Web Developer')
          .replace(/python developer/g, 'web developer')
          .replace(/Python developer/g, 'Web developer');
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  }
}

replaceInDir(path.join(__dirname, '../src'));
replaceInDir(path.join(__dirname, '../messages'));
console.log('Done');
