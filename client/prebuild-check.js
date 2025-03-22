const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'client/index.html',
  'client/src/index.jsx',
  'client/src/App.jsx',
];

let allExist = true;
REQUIRED_FILES.forEach((file) => {
  const fullPath = path.resolve(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required file: ${file}`);
    allExist = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

if (!allExist) {
  console.error('❌ Pre-build check failed. Fix missing files before building.');
  process.exit(1);
} else {
  console.log('✅ Pre-build check passed. All required files are present.');
}
