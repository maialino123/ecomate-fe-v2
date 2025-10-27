#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE_LIGHT = path.join(__dirname, '../public/images/favicon.png');
const SOURCE_IMAGE_DARK = path.join(__dirname, '../public/images/favicon-inverted.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Favicon sizes to generate
const SIZES = [
  { size: 16, name: 'favicon-16.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 192, name: 'favicon-192.png' },
  { size: 512, name: 'favicon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

/**
 * Create light mode favicon with white background, no padding, maximum logo size
 * @param {number} size - Favicon size in pixels
 * @param {string} outputName - Output filename
 */
async function createLightFavicon(size, outputName) {
  console.log(`📦 Generating ${outputName} (${size}x${size})...`);

  const borderWidth = Math.max(1, Math.round(size * 0.015)); // 1.5% border, minimum 1px
  const borderRadius = Math.round(size * 0.15); // 15% border radius

  try {
    // Resize logo to full size (no padding)
    const resizedLogo = await sharp(SOURCE_IMAGE_LIGHT)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toBuffer();

    // Create white background with rounded corners and subtle border
    const svgBackground = `
      <svg width="${size}" height="${size}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
            <feOffset dx="0" dy="1" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.12"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect
          x="0"
          y="0"
          width="${size}"
          height="${size}"
          rx="${borderRadius}"
          ry="${borderRadius}"
          fill="white"
          filter="url(#shadow)"
        />
        <rect
          x="${borderWidth / 2}"
          y="${borderWidth / 2}"
          width="${size - borderWidth}"
          height="${size - borderWidth}"
          rx="${borderRadius}"
          ry="${borderRadius}"
          fill="none"
          stroke="#E5E7EB"
          stroke-width="${borderWidth}"
        />
      </svg>
    `;

    // Composite logo on white background (logo covers entire canvas)
    await sharp(Buffer.from(svgBackground))
      .composite([
        {
          input: resizedLogo,
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toFile(path.join(OUTPUT_DIR, outputName));

    console.log(`✅ Generated ${outputName}`);
  } catch (error) {
    console.error(`❌ Error generating ${outputName}:`, error.message);
    throw error;
  }
}

/**
 * Create dark mode favicon with no background, no padding, maximum logo size
 * @param {number} size - Favicon size in pixels
 * @param {string} outputName - Output filename
 */
async function createDarkFavicon(size, outputName) {
  console.log(`📦 Generating ${outputName} (${size}x${size})...`);

  try {
    // Resize logo to full size with transparent background
    await sharp(SOURCE_IMAGE_DARK)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
      })
      .png()
      .toFile(path.join(OUTPUT_DIR, outputName));

    console.log(`✅ Generated ${outputName}`);
  } catch (error) {
    console.error(`❌ Error generating ${outputName}:`, error.message);
    throw error;
  }
}

/**
 * Main function to generate all favicons (light and dark mode)
 */
async function generateAllFavicons() {
  console.log('🎨 Starting adaptive favicon generation (light & dark mode)...\n');

  // Check if source images exist
  if (!fs.existsSync(SOURCE_IMAGE_LIGHT)) {
    console.error(`❌ Light mode source image not found: ${SOURCE_IMAGE_LIGHT}`);
    process.exit(1);
  }
  if (!fs.existsSync(SOURCE_IMAGE_DARK)) {
    console.error(`❌ Dark mode source image not found: ${SOURCE_IMAGE_DARK}`);
    process.exit(1);
  }

  // Backup existing favicons if they exist
  console.log('💾 Backing up existing favicons...');
  const backupDir = path.join(__dirname, '../public/images/favicons-backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  for (const { name } of SIZES) {
    const filePath = path.join(OUTPUT_DIR, name);
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(backupDir, name);
      fs.copyFileSync(filePath, backupPath);
      console.log(`  ↳ Backed up ${name}`);
    }
  }

  // Also backup favicon.ico if exists
  const icoPath = path.join(OUTPUT_DIR, 'favicon.ico');
  if (fs.existsSync(icoPath)) {
    fs.copyFileSync(icoPath, path.join(backupDir, 'favicon.ico'));
    console.log(`  ↳ Backed up favicon.ico`);
  }

  console.log('');

  // Generate light mode favicons (with white background)
  console.log('☀️  Generating light mode favicons (white background)...');
  for (const { size, name } of SIZES) {
    await createLightFavicon(size, name);
  }

  // Generate dark mode favicons (transparent, no background)
  console.log('\n🌙 Generating dark mode favicons (transparent)...');
  for (const { size, name } of SIZES) {
    const darkName = name.replace('.png', '-dark.png');
    await createDarkFavicon(size, darkName);
  }

  // Copy 32px version as favicon.ico (browsers support PNG in .ico files)
  console.log('\n📄 Creating favicon.ico from 32px light version...');
  fs.copyFileSync(
    path.join(OUTPUT_DIR, 'favicon-32.png'),
    path.join(OUTPUT_DIR, 'favicon.ico')
  );
  console.log('✅ Created favicon.ico');

  console.log('\n🎉 All favicons generated successfully!');
  console.log('\n📍 Generated files (Light Mode):');
  console.log('  • favicon.ico (32x32)');
  SIZES.forEach(({ name, size }) => {
    console.log(`  • ${name} (${size}x${size})`);
  });
  console.log('\n📍 Generated files (Dark Mode):');
  SIZES.forEach(({ name, size }) => {
    const darkName = name.replace('.png', '-dark.png');
    console.log(`  • ${darkName} (${size}x${size})`);
  });
  console.log('\n💡 Originals backed up to: public/images/favicons-backup/');
  console.log('💡 Light mode: White background, no padding, max logo size');
  console.log('💡 Dark mode: Transparent, no padding, max logo size');
}

// Run the script
generateAllFavicons().catch((error) => {
  console.error('\n❌ Failed to generate favicons:', error);
  process.exit(1);
});
