/**
 * Package Extension Script
 * Creates a ZIP file from the built extension
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const RELEASES_DIR = path.join(ROOT_DIR, 'releases');

// Read version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
);
const version = packageJson.version;

// Output filename
const outputFilename = `ecomate-extension-v${version}.zip`;
const outputPath = path.join(RELEASES_DIR, outputFilename);

console.log('📦 Packaging Ecomate Extension...');
console.log(`Version: ${version}`);
console.log(`Output: ${outputPath}`);

// Check if dist folder exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ Error: dist/ folder not found.');
  console.error('Run `pnpm build:prod` first.');
  process.exit(1);
}

// Create releases directory
if (!fs.existsSync(RELEASES_DIR)) {
  fs.mkdirSync(RELEASES_DIR, { recursive: true });
  console.log('✅ Created releases/ directory');
}

// Remove old ZIP if exists
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
  console.log('🗑️  Removed old ZIP file');
}

// Create ZIP file
try {
  // Check OS and use appropriate zip command
  const isWindows = process.platform === 'win32';

  if (isWindows) {
    // Windows: Use PowerShell Compress-Archive
    console.log('🪟 Using PowerShell (Windows)...');
    execSync(
      `powershell -Command "Compress-Archive -Path '${DIST_DIR}\\*' -DestinationPath '${outputPath}'"`,
      { stdio: 'inherit' }
    );
  } else {
    // Unix/Mac: Use zip command
    console.log('🐧 Using zip command (Unix/Mac)...');
    execSync(
      `cd "${DIST_DIR}" && zip -r "${outputPath}" .`,
      { stdio: 'inherit' }
    );
  }

  // Verify ZIP was created
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n✅ Package created successfully!');
    console.log(`📦 File: ${outputFilename}`);
    console.log(`📏 Size: ${sizeMB} MB`);
    console.log(`📂 Location: ${outputPath}`);
    console.log('\n🚀 Ready to distribute!');
    console.log('\nNext steps:');
    console.log('1. Test the ZIP (extract & load in Chrome)');
    console.log('2. Upload to Google Drive or GitHub Release');
    console.log('3. Share with team');
  } else {
    throw new Error('ZIP file was not created');
  }
} catch (error) {
  console.error('\n❌ Error creating ZIP file:', error.message);
  console.error('\nTroubleshooting:');
  console.error('- Windows: Ensure PowerShell is available');
  console.error('- Mac/Linux: Ensure zip command is installed');
  console.error('- Check dist/ folder has content');
  process.exit(1);
}
