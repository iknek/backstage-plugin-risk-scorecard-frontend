const fs = require('fs');
const hostPackageJsonPath = '.dev-host/package.json';

if (!fs.existsSync(hostPackageJsonPath)) {
  console.error(
    `Error: ${hostPackageJsonPath} not found. Make sure the submodule is initialized with: git submodule update --init --recursive`,
  );
  process.exit(1);
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(hostPackageJsonPath, 'utf8'));
} catch (err) {
  console.error(
    `Error reading or parsing ${hostPackageJsonPath}: ${err.message}`,
  );
  process.exit(1);
}

// Backup once so devs can always restore
if (!fs.existsSync(`${hostPackageJsonPath}.bak`)) {
  fs.writeFileSync(
    `${hostPackageJsonPath}.bak`,
    JSON.stringify(pkg, null, 2) + '\n',
  );
}

pkg.resolutions = {
  ...pkg.resolutions,
  '@kartverket/backstage-plugin-risk-scorecard': 'workspace:*',
};

fs.writeFileSync(hostPackageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('Patched .dev-host/package.json with workspace resolution.');
