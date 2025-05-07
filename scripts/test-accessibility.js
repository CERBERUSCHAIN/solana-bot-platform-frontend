// scripts/test-accessibility.js
const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// URLs to test
const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/strategies',
  'http://localhost:3000/trading/auth/login'
];

async function runAccessibilityTests() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let results = [];
  
  for (const url of urls) {
    console.log(Testing ...);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      const axeResults = await new AxePuppeteer(page).analyze();
      
      results.push({
        url,
        violations: axeResults.violations,
        passes: axeResults.passes.length,
        incomplete: axeResults.incomplete.length,
        timestamp: new Date().toISOString()
      });
      
      console.log(Found  accessibility violations on );
    } catch (error) {
      console.error(Error testing :, error);
      results.push({
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Write results to file
  const reportsDir = path.resolve('reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const reportPath = path.join(reportsDir, ccessibility-report-.json);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  console.log(Report saved to );
  
  await browser.close();
}

runAccessibilityTests().catch(console.error);
