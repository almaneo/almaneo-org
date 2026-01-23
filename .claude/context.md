# Development Context

## Session History

### 2025-01-17
- Initial web folder setup and Vite dev server configuration
- Applied NEOS_Landing_Page.jsx to web folder
- Resolved Tailwind CSS 4.x compatibility issues
- Downgraded to Tailwind 3.x for proper config file support
- Created .claude memory files

## Working Files

### Primary Files
| File | Purpose | Status |
|------|---------|--------|
| web/src/components/NEOSLanding.tsx | Main landing component | Active |
| web/src/App.tsx | Root component | Stable |
| web/src/index.css | Global styles + Tailwind | Stable |
| web/tailwind.config.js | Custom theme config | Stable |

### Reference Files
| File | Purpose |
|------|---------|
| NEOS_Landing_Page.jsx | Original design reference |

## Environment
- Node.js environment on Windows
- Working directory: c:\DEV\NEOS
- Dev server: http://localhost:5173/

## Key Commands
```bash
# Start dev server
cd web && npx vite

# Build for production
cd web && npm run build

# Install dependencies
cd web && npm install
```

## Pending Tasks
- [ ] Firebase integration
- [ ] Wallet connection functionality
- [ ] Multi-language support (Korean/English)
- [ ] Mobile responsiveness optimization
