// Skrypt do kopiowania .git-version do katalogu assets
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '.git-version');
const dest = path.join(__dirname, 'src', 'assets', '.git-version');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('.git-version copied to src/assets/.git-version');
} else {
  console.error('.git-version not found!');
  process.exit(1);
}

