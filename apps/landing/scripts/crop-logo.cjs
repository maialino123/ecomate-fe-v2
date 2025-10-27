#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_LOGO = path.join(__dirname, '../public/images/logo.png');
const BACKUP_LOGO = path.join(__dirname, '../public/images/logo-original.png');
const OUTPUT_LOGO = path.join(__dirname, '../public/images/logo-cropped.png');

/**
 * Crop logo to remove excess transparent space
 * Keeps a small padding (5px) around the actual logo content
 */
async function cropLogo() {
  console.log('✂️  Starting logo crop process...\n');

  // Check if source logo exists
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error(`❌ Source logo not found: ${SOURCE_LOGO}`);
    process.exit(1);
  }

  try {
    // Step 1: Backup original logo if not already backed up
    if (!fs.existsSync(BACKUP_LOGO)) {
      console.log('💾 Backing up original logo...');
      fs.copyFileSync(SOURCE_LOGO, BACKUP_LOGO);
      console.log(`✅ Original logo backed up to: ${path.basename(BACKUP_LOGO)}\n`);
    } else {
      console.log('ℹ️  Original logo backup already exists, skipping backup\n');
    }

    // Step 2: Get original logo metadata
    const metadata = await sharp(SOURCE_LOGO).metadata();
    console.log(`📐 Original logo dimensions: ${metadata.width}x${metadata.height}px`);

    // Step 3: Auto-trim transparent background with small padding
    console.log('✂️  Trimming transparent background...');
    const trimmedImage = await sharp(SOURCE_LOGO)
      .trim({
        background: { r: 255, g: 255, b: 255, alpha: 0 }, // Trim transparent pixels
        threshold: 10, // Sensitivity threshold (0-255)
      })
      .extend({
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Add 5px transparent padding
      })
      .png()
      .toBuffer();

    // Get new dimensions
    const trimmedMetadata = await sharp(trimmedImage).metadata();
    console.log(`📐 Cropped logo dimensions: ${trimmedMetadata.width}x${trimmedMetadata.height}px`);
    console.log(`📉 Size reduction: ${metadata.width}x${metadata.height} → ${trimmedMetadata.width}x${trimmedMetadata.height}\n`);

    // Step 4: Save cropped logo
    await sharp(trimmedImage).toFile(OUTPUT_LOGO);
    console.log(`✅ Cropped logo saved to: ${path.basename(OUTPUT_LOGO)}`);

    // Step 5: Calculate file size reduction
    const originalSize = fs.statSync(SOURCE_LOGO).size;
    const croppedSize = fs.statSync(OUTPUT_LOGO).size;
    const sizeReduction = ((originalSize - croppedSize) / originalSize * 100).toFixed(1);

    console.log(`\n📊 File size comparison:`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Cropped:  ${(croppedSize / 1024).toFixed(2)} KB`);
    console.log(`   Reduction: ${sizeReduction}%`);

    // Step 6: Prompt to replace original
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Review cropped logo: public/images/logo-cropped.png`);
    console.log(`   2. If satisfied, replace original logo with cropped version`);
    console.log(`   3. Or manually copy: logo-cropped.png → logo.png`);

  } catch (error) {
    console.error('\n❌ Error cropping logo:', error.message);
    process.exit(1);
  }
}

// Run the script
cropLogo().catch((error) => {
  console.error('\n❌ Failed to crop logo:', error);
  process.exit(1);
});
