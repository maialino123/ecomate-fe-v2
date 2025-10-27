#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');

const SOURCE_IMAGE = path.join(__dirname, '../public/images/favicon.png');
const OUTPUT_IMAGE = path.join(__dirname, '../public/images/favicon-inverted.png');

/**
 * Create inverted logo: white bag + teal text
 * Original: teal bag (#10b981 approx) + white text
 * Inverted: white bag + teal text
 *
 * Strategy: Use threshold to separate dark (teal) and light (white) pixels,
 * then swap them
 */
async function createInvertedLogo() {
  console.log('🎨 Creating inverted logo (white bag + teal text)...\n');

  try {
    const metadata = await sharp(SOURCE_IMAGE).metadata();
    console.log(`📏 Original image: ${metadata.width}x${metadata.height}px`);

    // Step 1: Get raw pixel data
    const { data, info } = await sharp(SOURCE_IMAGE)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log('🔄 Processing pixels...');

    // Step 2: Process each pixel
    // Original colors (approximate):
    // - Teal bag: RGB around (16, 185, 129) = #10b981
    // - White text: RGB around (255, 255, 255) = #ffffff
    // Target colors:
    // - White bag: (255, 255, 255)
    // - Teal text: (16, 185, 129)

    const newData = Buffer.from(data);
    const pixelCount = info.width * info.height;

    for (let i = 0; i < pixelCount; i++) {
      const offset = i * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const a = data[offset + 3];

      // Calculate luminosity (brightness)
      const luminosity = 0.299 * r + 0.587 * g + 0.114 * b;

      // If pixel is bright (white text), make it teal
      if (luminosity > 200) {
        newData[offset] = 16;      // R
        newData[offset + 1] = 185; // G
        newData[offset + 2] = 129; // B
        newData[offset + 3] = a;   // Keep alpha
      }
      // If pixel is dark/medium (teal bag), make it white
      else if (luminosity > 50) {
        newData[offset] = 255;     // R
        newData[offset + 1] = 255; // G
        newData[offset + 2] = 255; // B
        newData[offset + 3] = a;   // Keep alpha
      }
      // Keep transparent pixels transparent
      else if (a < 10) {
        newData[offset + 3] = 0;
      }
    }

    // Step 3: Create new image from processed pixels
    await sharp(newData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(OUTPUT_IMAGE);

    console.log(`✅ Created inverted logo: ${OUTPUT_IMAGE}`);
    console.log('   Colors: White bag (#FFFFFF) + Teal text (#10B981)\n');

  } catch (error) {
    console.error('❌ Error creating inverted logo:', error.message);
    throw error;
  }
}

createInvertedLogo().catch((error) => {
  console.error('\n❌ Failed:', error);
  process.exit(1);
});
