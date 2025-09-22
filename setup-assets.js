#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Setup script to organize game assets for the React app
 * This script copies sprite assets to the public directory for web access
 */

const sourceDir = './sprites';
const publicDir = './public/sprites';

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function setupAssets() {
  console.log('🎮 Setting up Chronicle of the Ledger assets...');
  
  try {
    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.log('❌ Sprites directory not found. Please ensure sprites are in ./sprites/');
      return;
    }

    // Copy assets to public directory
    console.log('📁 Copying sprite assets to public directory...');
    copyDirectory(sourceDir, publicDir);
    
    console.log('✅ Assets setup complete!');
    console.log('📂 Assets are now available at /sprites/ in your React app');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm start');
    console.log('3. Open: http://localhost:3000');
    console.log('');
    console.log('🎮 Enjoy playing Chronicle of the Ledger!');
    
  } catch (error) {
    console.error('❌ Error setting up assets:', error.message);
  }
}

// Run the setup
setupAssets();
