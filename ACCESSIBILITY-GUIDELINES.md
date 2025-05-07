# Accessibility Guidelines for Solana Bot Platform

## Core Principles

1. **Every interactive element must be operable by keyboard**
2. **Every form control must have a proper label**
3. **Every button must have discernible text**
4. **All content must have sufficient color contrast**

## Common Issues and Fixes

### Problem: Form elements without labels

**Wrong:**
\\\jsx
<input type="text" />
\\\

**Right:**
\\\jsx
<div className="form-group">
  <label htmlFor="username">Username</label>
  <input id="username" type="text" />
</div>
\\\

### Problem: Icon-only buttons

**Wrong:**
\\\jsx
<button><i className="icon-trash"></i></button>
\\\

**Right:**
\\\jsx
<button aria-label="Delete item">
  <i className="icon-trash" aria-hidden="true"></i>
  <span className="sr-only">Delete item</span>
</button>
\\\

### Problem: Select elements without accessible names

**Wrong:**
\\\jsx
<select>
  <option value="1">Option 1</option>
</select>
\\\

**Right:**
\\\jsx
<div className="form-group">
  <label htmlFor="options">Select an option</label>
  <select id="options">
    <option value="1">Option 1</option>
  </select>
</div>
\\\

## Utility Classes

Add this to your CSS:

\\\css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus,
.sr-only-focusable:active {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
\\\

## Testing Your Components

Use the axe DevTools browser extension to test your components for accessibility issues:
https://www.deque.com/axe/devtools/

## Best Practices

1. Use semantic HTML elements
2. Add appropriate ARIA attributes only when necessary
3. Test with keyboard navigation
4. Test with screen readers
5. Maintain proper heading hierarchy
6. Use proper HTML structure
