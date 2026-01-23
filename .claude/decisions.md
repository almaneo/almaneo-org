# Technical Decisions

## Decision Log

### 2025-01-17: Tailwind CSS Version

**Decision**: Use Tailwind CSS 3.x instead of 4.x

**Context**:
- Project was initialized with Tailwind 4.x
- tailwind.config.js was written in Tailwind 3.x format
- Tailwind 4.x uses CSS-first configuration and ignores JS config files

**Options Considered**:
1. Migrate to Tailwind 4.x CSS-based configuration
2. Downgrade to Tailwind 3.x

**Chosen**: Option 2 - Downgrade to Tailwind 3.x

**Rationale**:
- Existing tailwind.config.js has custom colors, fonts, and animations
- Less migration effort required
- Better ecosystem compatibility
- 4.x is still relatively new with potential compatibility issues

---

### 2025-01-17: Inline CSS for Animations

**Decision**: Keep animations in inline `<style>` tag within NEOSLanding.tsx

**Rationale**:
- Self-contained component
- No dependency on external CSS files
- Easier to maintain and modify
- Animations are component-specific

---

### 2025-01-17: Component Architecture

**Decision**: Single-file landing page component

**Rationale**:
- Simple landing page structure
- All sections are tightly related
- Easy to read and understand the full page flow
- Can be split later if needed

---

## Future Considerations

### When to Split Components
- If individual sections need to be reused
- If the file exceeds 500 lines significantly
- If different team members work on different sections

### Potential Optimizations
- Lazy loading for below-fold sections
- Image optimization with next-gen formats
- Animation performance with `will-change`
