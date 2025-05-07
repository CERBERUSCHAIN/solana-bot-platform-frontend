// scripts/fix-accessibility-robust.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const parse5 = require('parse5'); // You may need to install this: npm install parse5

// Process a single file
async function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    const content = await readFile(filePath, 'utf8');
    
    // Skip files that use complex JSX patterns
    if (content.includes('as={') || content.includes('<>') || content.includes('Fragment')) {
      console.log(`Skipping complex JSX in ${filePath}`);
      return false;
    }
    
    let modifiedContent = content;
    let changed = false;
    
    // Fix select elements - careful approach
    if (/<select[^>]*?(?!aria-label|aria-labelledby|title)[^>]*>/i.test(modifiedContent)) {
      console.log(`Adding aria-label to select elements in ${filePath}`);
      modifiedContent = modifiedContent.replace(
        /(<select[^>]*?)>/g, 
        (match, p1) => {
          if (!/aria-label|aria-labelledby|title/i.test(match)) {
            changed = true;
            return `${p1} aria-label="Selection field">`;
          }
          return match;
        }
      );
    }
    
    // Fix unlabeled input elements - careful approach
    if (/<input[^>]*?(?!aria-label|aria-labelledby|placeholder)[^>]*?>/i.test(modifiedContent)) {
      console.log(`Adding aria-label to input elements in ${filePath}`);
      modifiedContent = modifiedContent.replace(
        /(<input[^>]*?)>/g,
        (match, p1) => {
          if (!/aria-label|aria-labelledby|placeholder/i.test(match)) {
            changed = true;
            return `${p1} aria-label="Input field">`;
          }
          return match;
        }
      );
    }
    
    // Fix buttons with only icons - careful approach
    if (/<button[^>]*?>[\s]*<[^>]*>[\s]*<\/[^>]*>[\s]*<\/button>/i.test(modifiedContent)) {
      console.log(`Adding accessible text to icon-only buttons in ${filePath}`);
      modifiedContent = modifiedContent.replace(
        /(<button[^>]*?>)([\s]*<[^>]*>[\s]*<\/[^>]*>[\s]*)<\/button>/g,
        (match, p1, p2) => {
          if (!/aria-label|aria-labelledby|title/i.test(match)) {
            changed = true;
            return `${p1}${p2}<span className="sr-only">Action button</span></button>`;
          }
          return match;
        }
      );
    }
    
    // Only write if we made changes
    if (changed) {
      await writeFile(filePath, modifiedContent, 'utf8');
      console.log(`✓ Fixed ${filePath}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    return false;
  }
}

// Get list of component files
async function getComponentFiles() {
  const componentDirs = [
    path.resolve('components'),
    path.resolve('src/components')
  ];
  
  const allFiles = [];
  
  for (const dir of componentDirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = await walkDir(dir);
    allFiles.push(...files);
  }
  
  return allFiles;
}

// Walk directory recursively
async function walkDir(dir) {
  const files = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const subFiles = await walkDir(fullPath);
      files.push(...subFiles);
    } else if (/\.(jsx|tsx)$/.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main function
async function main() {
  console.log('Starting accessibility fixes...');
  
  // Get all component files
  const files = await getComponentFiles();
  console.log(`Found ${files.length} component files`);
  
  // Process each file
  let fixedCount = 0;
  for (const file of files) {
    const fixed = await processFile(file);
    if (fixed) fixedCount++;
  }
  
  console.log(`\nCompleted! Fixed ${fixedCount} files.`);
}

main().catch(console.error);
