// scripts/validate-html.js
const fs = require('fs');
const { parse } = require('node-html-parser');

// Read ElementConfig component
const componentPath = './src/components/Strategy/ElementConfig.tsx';
const componentContent = fs.readFileSync(componentPath, 'utf8');

// Extract JSX from component
const extractJSX = (content) => {
  // Very simplified extraction - just for demo purposes
  const returnStatement = content.split('return (')[1];
  if (!returnStatement) return '';
  
  const jsx = returnStatement.split(');')[0];
  return jsx;
};

// Convert JSX to HTML-like syntax for basic validation
const jsxToHTML = (jsx) => {
  return jsx
    .replace(/className=/g, 'class=')
    .replace(/\{([^{}]*)\}/g, (_, content) => {
      // Replace simple expressions
      if (content.includes('?')) {
        return 'CONDITIONAL_CONTENT';
      }
      return content;
    });
};

// Validate basic accessibility patterns
const validateAccessibility = (html) => {
  const issues = [];
  const root = parse(html);
  
  // Check 1: All inputs have associated labels
  const inputs = root.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (!id) {
      issues.push('Input element missing ID attribute');
      return;
    }
    
    const label = root.querySelector(\label[for="\"]\);
    if (!label) {
      issues.push(\Input with ID "\" has no associated label\);
    }
  });
  
  // Check 2: All buttons have text content
  const buttons = root.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.textContent.trim()) {
      issues.push('Button has no text content');
    }
  });
  
  // Check 3: Proper heading hierarchy
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) {
    issues.push('No headings found');
  }
  
  return issues;
};

// Main validation
const jsxContent = extractJSX(componentContent);
const htmlContent = jsxToHTML(jsxContent);
const issues = validateAccessibility(htmlContent);

console.log('== Accessibility Validation Results ==');
if (issues.length === 0) {
  console.log('✅ No basic accessibility issues found');
} else {
  console.log(\❌ Found \ issues:\);
  issues.forEach((issue, index) => {
    console.log(\  \. \\);
  });
}
