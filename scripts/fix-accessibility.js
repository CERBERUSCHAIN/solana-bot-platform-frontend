// scripts/fix-accessibility.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Get all component files
async function getComponentFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await getComponentFiles(filePath, fileList);
    } else if (/\.(tsx|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Apply accessibility fixes
async function fixAccessibilityIssues(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    const originalContent = content;
    
    // Fix select elements without accessible names
    content = content.replace(
      /(<select[^>]*?)(?!aria-label|aria-labelledby)(>)/g,
      '$1 aria-label="Selection field"$2'
    );
    
    // Fix buttons with only icons (no discernible text)
    content = content.replace(
      /(<button[^>]*>)(\s*<[^>]*>\s*<\/[^>]*>\s*)(<\/button>)/g,
      '$1$2<span className="sr-only">Action button</span>$3'
    );
    
    // Fix input elements without labels
    content = content.replace(
      /(<input[^>]*?)(?!aria-label|aria-labelledby|placeholder)(>)/g,
      '$1 aria-label="Input field"$2'
    );
    
    if (content !== originalContent) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Fixed accessibility issues in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
    return false;
  }
}

// Main function
async function main() {
  const srcDirs = [
    path.resolve('src/components'),
    path.resolve('components')
  ];
  
  let componentFiles = [];
  
  // Get all component files
  for (const dir of srcDirs) {
    if (fs.existsSync(dir)) {
      const files = await getComponentFiles(dir);
      componentFiles = [...componentFiles, ...files];
    }
  }
  
  console.log(`Found ${componentFiles.length} component files`);
  
  // Fix accessibility issues
  let fixedFilesCount = 0;
  for (const file of componentFiles) {
    const fixed = await fixAccessibilityIssues(file);
    if (fixed) {
      fixedFilesCount++;
    }
  }
  
  console.log(`Fixed accessibility issues in ${fixedFilesCount} files`);
}

main().catch(console.error);
