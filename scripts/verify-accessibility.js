// scripts/verify-accessibility.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

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

// Count accessibility attributes in a file
async function countAccessibility(filepath) {
  const content = await readFile(filepath, 'utf8');
  
  // Count accessibility attributes
  const counts = {
    'aria-label': (content.match(/aria-label/g) || []).length,
    'aria-labelledby': (content.match(/aria-labelledby/g) || []).length,
    'aria-describedby': (content.match(/aria-describedby/g) || []).length,
    'aria-invalid': (content.match(/aria-invalid/g) || []).length,
    'sr-only': (content.match(/sr-only/g) || []).length,
    'role': (content.match(/ role=/g) || []).length,
  };
  
  return counts;
}

// Main function
async function main() {
  try {
    // Directories to process
    const dirs = [
      path.resolve('src/components'),
      path.resolve('components')
    ];
    
    let totalCounts = {
      'aria-label': 0,
      'aria-labelledby': 0,
      'aria-describedby': 0,
      'aria-invalid': 0,
      'sr-only': 0,
      'role': 0,
    };
    
    // Total file count
    let totalFiles = 0;
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      
      // Get all component files
      const files = await walk(dir);
      totalFiles += files.length;
      console.log(Scanning  component files in );
      
      // Process each file
      for (const file of files) {
        const counts = await countAccessibility(file);
        
        // Add to total counts
        for (const [key, value] of Object.entries(counts)) {
          totalCounts[key] += value;
        }
        
        // Display files with accessibility attributes
        const totalAttributes = Object.values(counts).reduce((a, b) => a + b, 0);
        if (totalAttributes > 0) {
          console.log(${file}:  accessibility attributes);
        }
      }
    }
    
    console.log('\n===== Accessibility Attribute Summary =====');
    for (const [key, value] of Object.entries(totalCounts)) {
      console.log(${key}: );
    }
    
    const totalAttributes = Object.values(totalCounts).reduce((a, b) => a + b, 0);
    console.log(\nTotal files: );
    console.log(Total accessibility attributes: );
    console.log(Average attributes per file: );
    
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
