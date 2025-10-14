// Simple script to generate a basic OG image placeholder
const fs = require('fs');
const path = require('path');

// Create a simple SVG that can be saved as PNG placeholder
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#2563eb"/>
  <text x="600" y="315" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">Lookbook</text>
</svg>`;

const outputPath = path.join(__dirname, '..', 'public', 'og.svg');
fs.writeFileSync(outputPath, svg, 'utf8');
console.log('✓ Created og.svg at', outputPath);
