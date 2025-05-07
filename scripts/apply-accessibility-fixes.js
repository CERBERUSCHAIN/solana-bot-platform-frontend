// scripts/apply-accessibility-fixes.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Helper function to walk directories recursively
async function walk(dir) {
  const files = await readdir(dir);
  const results = await Promise.all(files.map(async file => {
    const filepath = path.join(dir, file);
    const stats = await stat(filepath);
    if (stats.isDirectory()) {
      return walk(filepath);
    } else if (filepath.match(/\.(tsx|jsx)$/)) {
      return filepath;
    }
    return null;
  }));
  return results.filter(Boolean).flat();
}

// Apply accessibility fixes to a file
async function fixFile(filepath) {
  console.log(Processing ...);
  let content = await readFile(filepath, 'utf8');
  let modified = false;

  // Fix #1: Add aria-labels to buttons with only icons
  const buttonRegex = /<button[^>]*>(\s*<[^>]*>\s*)<\/button>/g;
  if (buttonRegex.test(content)) {
    content = content.replace(
      buttonRegex,
      (match, iconContent) => {
        if (!/aria-label/.test(match)) {
          modified = true;
          return match.replace(
            /<button([^>]*)>/,
            '<button aria-label="Action button">'
          ).replace(
            /<\/button>/,
            '<span className="sr-only">Action button</span></button>'
          );
        }
        return match;
      }
    );
  }

  // Fix #2: Add aria-labels to select elements
  const selectRegex = /<select([^>]*)>/g;
  if (selectRegex.test(content)) {
    content = content.replace(
      selectRegex,
      (match, attrs) => {
        if (!/aria-label|aria-labelledby|id=/.test(match)) {
          modified = true;
          return <select aria-label="Select option">;
        }
        return match;
      }
    );
  }

  // Fix #3: Add aria-labels to input elements
  const inputRegex = /<input([^>]*)>/g;
  if (inputRegex.test(content)) {
    content = content.replace(
      inputRegex,
      (match, attrs) => {
        if (!/aria-label|aria-labelledby|placeholder=|id=/.test(match)) {
          modified = true;
          return <input aria-label="Input field">;
        }
        return match;
      }
    );
  }

  // Write back the file if it was modified
  if (modified) {
    await writeFile(filepath, content, 'utf8');
    console.log(✅ Fixed );
    return true;
  } else {
    console.log(⏭️ No changes needed for );
    return false;
  }
}

// Main function
async function main() {
  try {
    // Directories to process
    const dirs = [
      path.resolve('src/components'),
      path.resolve('components')
    ];
    
    let fixedCount = 0;
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      
      // Get all component files
      const files = await walk(dir);
      console.log(Found  component files in );
      
      // Process each file
      for (const file of files) {
        const fixed = await fixFile(file);
        if (fixed) fixedCount++;
      }
    }
    
    console.log(\n✨ Completed! Fixed  files.);
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
