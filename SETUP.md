# CloudFlow Resume - Setup Guide

## Prerequisites

- Node.js 18+ (20.x recommended)
- npm 9+
- Git

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- Preact (UI framework)
- Vite (build tool)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Nunjucks (templating)
- AJV (schema validation)
- Testing libraries
- Development tools

### 2. Initialize Git Hooks

```bash
npm run prepare
```

This sets up Husky pre-commit hooks for:

- Code linting and formatting
- Schema validation
- Type checking

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run preview` - Preview production build locally

### Build

- `npm run build` - Build production bundle
- `npm run typecheck` - Run TypeScript type checking

### Code Quality

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing

- `npm test` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI
- `npm run test:coverage` - Generate coverage report

### Validation

- `npm run validate:schema` - Validate CFRS schema
- `npm run validate:mappings` - Validate schema mappings
- `npm run validate` - Run all validations (type check + lint + schema)

### Deployment

- `npm run deploy` - Build and deploy to GitHub Pages

## Project Structure

```
cloudflow-resume/
├── apps/web/                 # Main application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Preact components
│   │   ├── importers/        # JSON, MD, DOCX importers
│   │   ├── render/           # Nunjucks engine
│   │   ├── schema/           # CFRS schema & validation
│   │   ├── store/            # State management (Zustand)
│   │   ├── styles/           # Global styles
│   │   ├── themes/           # Theme components
│   │   ├── utils/            # Utilities
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   └── index.html            # HTML template
│
├── schemas/                  # CFRS schema files
│   ├── cfrs.schema.json      # Main schema (pending)
│   └── mappings/             # Schema mappings (pending)
│       ├── cfrs-to-jrs.json
│       └── cfrs-to-fresh.json
│
├── themes/                   # Default themes (pending)
│   └── default/
│
├── docs/                     # Documentation (pending)
│   ├── ARCHITECTURE.md
│   ├── ENFORCEMENT.md
│   ├── SCHEMA.md
│   └── THEMES.md
│
├── scripts/                  # Build scripts
│   ├── validate-schema.js
│   └── validate-mappings.js
│
├── .github/workflows/        # CI/CD
│   └── ci.yml
│
├── .husky/                   # Git hooks
│   ├── pre-commit
│   └── commit-msg
│
├── package.json              # Dependencies & scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind config
├── .eslintrc.cjs             # ESLint config
├── .prettierrc.json          # Prettier config
├── CLAUDE.md                 # Authoritative docs
├── MANIFEST.json             # Project inventory
├── .claude-rules.json        # Enforcement rules
└── README.md                 # Project overview
```

## Configuration Files

### Vite (vite.config.ts)

- Preact plugin configured
- GitHub Pages base path support
- Path aliases: `@/`, `@schemas/`, `@themes/`
- Bundle optimization and code splitting
- Performance budgets (600KB limit)
- Vitest integration

### TypeScript (tsconfig.json)

- Strict mode enabled
- All strict checks active
- Preact JSX configuration
- Path aliases matching Vite
- ES2020 target

### Tailwind CSS (tailwind.config.js)

- Mobile-first breakpoints (375px–2560px)
- Dark mode via system preference
- Print-optimized utilities
- ATS-safe font stack
- Accessible color palette

### ESLint (.eslintrc.cjs)

- TypeScript strict rules
- Accessibility checks (jsx-a11y)
- Preact-specific linting
- Type-aware linting enabled

## Development Workflow

### 1. Create a Feature

```bash
# Start development server
npm run dev

# Make changes to files in apps/web/src/

# Tests run automatically in watch mode
npm test
```

### 2. Before Committing

```bash
# Format code
npm run format

# Run all checks
npm run validate

# If validation passes, commit
git add .
git commit -m "feat: your feature description"
```

Pre-commit hooks will automatically:

- Lint and format staged files
- Validate schemas
- Run type checking

### 3. Build for Production

```bash
# Build optimized bundle
npm run build

# Preview build locally
npm run preview
```

## GitHub Pages Deployment

### Setup

1. Update `vite.config.ts` with your repository name:

   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

2. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

3. Push to main branch to trigger deployment

### Manual Deploy

```bash
npm run deploy
```

## Troubleshooting

### Husky hooks not working

```bash
# Reinstall Husky
rm -rf .husky
npm run prepare
```

### Type errors in Preact

Make sure `jsxImportSource` is set to `preact` in tsconfig.json

### Bundle size too large

Check bundle analysis:

```bash
npm run build
# Check dist/ folder size
du -sh dist
```

### Schema validation failing

Schema files are created by the SCHEMA agent. Until then, validation will show info messages but won't fail.

## Next Steps

1. **SCHEMA Agent**: Create CFRS schema and mappings
2. **THEME Agent**: Build default ATS-safe themes
3. **UI Agent**: Implement editor and import/export UI
4. **TEST Agent**: Add comprehensive test coverage

## Support

- See [CLAUDE.md](./CLAUDE.md) for authoritative configuration
- Check [MANIFEST.json](./MANIFEST.json) for project status
- Review [.claude-rules.json](./.claude-rules.json) for enforcement rules

## License

MIT - see [LICENSE](./LICENSE)
