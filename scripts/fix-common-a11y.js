// scripts/fix-common-a11y.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Helper function to walk directories
async function walk(dir) {
  const files = await readdir(dir);
  const results = await Promise.all(files.map(async file => {
    const filepath = path.join(dir, file);
    const stats = await stat(filepath);
    if (stats.isDirectory()) {
      return walk(filepath);
    } else if (filepath.match(/\.(jsx|tsx)$/)) {
      return filepath;
    }
    return null;
  }));
  return results.filter(Boolean).flat();
}

// Fix a file
async function fixFile(filepath) {
  console.log(Processing ...);
  let content = await readFile(filepath, 'utf8');
  let modified = false;

  // Fix 1: Add aria-label to icon-only buttons (button with only an icon inside)
  const buttonIconOnlyRegex = /<button([^>]*?)>(\s*<[^>]*icon[^>]*>\s*)<\/button>/g;
  const newContent = content.replace(buttonIconOnlyRegex, (match, attrs, iconContent) => {
    if (!attrs.includes('aria-label')) {
      modified = true;
      return <button aria-label="Action button"><span className="sr-only">Action button</span></button>;
    }
    return match;
  });
  
  if (newContent !== content) {
    content = newContent;
  }

  // Fix 2: Add aria-label to inputs without labels
  const inputsRegex = /<input([^>]*?)>/g;
  let newContentInputs = content;
  let match;
  
  while ((match = inputsRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const attrs = match[1] || '';
    
    if (!attrs.includes('aria-label') && !attrs.includes('id=')) {
      const replacement = <input aria-label="Input field">;
      newContentInputs = newContentInputs.replace(fullMatch, replacement);
      modified = true;
    }
  }
  
  if (newContentInputs !== content) {
    content = newContentInputs;
  }

  // Fix 3: Add aria-label to select elements
  const selectRegex = /<select([^>]*?)>/g;
  let newContentSelects = content;
  let selectMatch;
  
  while ((selectMatch = selectRegex.exec(content)) !== null) {
    const fullMatch = selectMatch[0];
    const attrs = selectMatch[1] || '';
    
    if (!attrs.includes('aria-label') && !attrs.includes('id=')) {
      const replacement = <select aria-label="Select option">;
      newContentSelects = newContentSelects.replace(fullMatch, replacement);
      modified = true;
    }
  }
  
  if (newContentSelects !== content) {
    content = newContentSelects;
  }

  // Save the file if modified
  if (modified) {
    await writeFile(filepath, content, 'utf8');
    console.log(✅ Fixed );
    return true;
  }
  
  return false;
}

// Main function
async function main() {
  const componentDirs = [
    path.resolve('src/components'),
    path.resolve('src/pages'),
    path.resolve('components')
  ];
  
  let fixedCount = 0;
  let totalFiles = 0;
  
  for (const dir of componentDirs) {
    if (!fs.existsSync(dir)) {
      console.log(Directory doesn't exist: );
      continue;
    }
    
    const files = await walk(dir);
    totalFiles += files.length;
    
    console.log(Found  files in );
    
    for (const file of files) {
      try {
        const fixed = await fixFile(file);
        if (fixed) fixedCount++;
      } catch (err) {
        console.error(Error processing :, err);
      }
    }
  }
  
  console.log(\n✨ Fixed  out of  files);
}

main().catch(console.error);
