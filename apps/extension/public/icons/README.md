# Extension Icons

## Generate PNG from SVG

Use any SVG to PNG converter online or locally:

```bash
# Using ImageMagick (if installed)
convert -background none -resize 16x16 icon.svg icon-16.png
convert -background none -resize 48x48 icon.svg icon-48.png
convert -background none -resize 128x128 icon.svg icon-128.png
```

Or use online tools:
- https://cloudconvert.com/svg-to-png
- https://www.svgviewer.dev/ (Export as PNG)

## Temporary Solution

For development, you can create simple colored squares:
- 16x16 purple square
- 48x48 purple square
- 128x128 purple square

The extension will load with placeholder icons during development.
