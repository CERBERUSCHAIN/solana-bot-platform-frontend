# Accessibility Checklist for Components

## Forms and Input Elements
- [ ] All form elements have associated labels or aria-label attributes
- [ ] Error messages use aria-invalid and aria-describedby
- [ ] Required fields are marked with aria-required="true"
- [ ] Form validation errors are announced to screen readers

## Buttons and Interactive Elements
- [ ] All buttons have accessible names (text content or aria-label)
- [ ] Icon-only buttons have aria-label or sr-only text
- [ ] Custom interactive elements have appropriate ARIA roles
- [ ] Focus states are visible and match design system

## Navigation and Structure
- [ ] Page has proper heading hierarchy (h1, h2, etc.)
- [ ] Skip links are provided for keyboard users
- [ ] Landmarks are used appropriately (main, nav, etc.)
- [ ] Modal dialogs trap focus and use aria-modal="true"

## Images and Media
- [ ] All images have appropriate alt text
- [ ] Decorative images have alt="" or are CSS backgrounds
- [ ] Video content has captions and transcripts
- [ ] Audio content has transcripts

## Color and Contrast
- [ ] Text color has sufficient contrast with background (4.5:1 minimum)
- [ ] Information is not conveyed by color alone
- [ ] Focus indicators have sufficient contrast
- [ ] UI components have sufficient contrast with surroundings

## Testing
- [ ] Component passes automated accessibility tests
- [ ] Component is tested with keyboard navigation
- [ ] Component is tested with screen readers
- [ ] Component works at 200% zoom
