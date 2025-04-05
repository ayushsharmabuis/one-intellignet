// Script to generate OG image using Puppeteer
// To use this script:
// 1. Install puppeteer: npm install puppeteer
// 2. Run this script: node generate-og-image.js

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateOGImage() {
  console.log('Generating OG image...');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to correct OG image dimensions
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 1,
  });
  
  // Load the HTML file
  const htmlPath = path.join(__dirname, 'public', 'og-image.html');
  await page.goto(`file:${htmlPath}`);
  
  // Wait to ensure all content is loaded (including fonts, animations, etc.)
  await page.waitForTimeout(1000);
  
  // Take a screenshot
  const screenshotPath = path.join(__dirname, 'public', 'og-image.png');
  await page.screenshot({
    path: screenshotPath,
    type: 'png',
    quality: 100,
  });
  
  console.log(`OG image saved to: ${screenshotPath}`);
  
  await browser.close();
}

generateOGImage().catch(console.error); 