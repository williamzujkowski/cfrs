# CloudFlow Resume

> Privacy-first resume builder with JSON Resume compatibility

[![CI](https://github.com/yourusername/cloudflow-resume/workflows/CI/badge.svg)](https://github.com/yourusername/cloudflow-resume/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **Privacy First**: All processing happens locally in your browser. No data sent to servers.
- **JSON Resume Compatible**: Full support for JSON Resume v1.2.1 standard
- **CFRS Schema**: CloudFlow Resume Schema with extended features
- **ATS-Friendly**: Templates optimized for Applicant Tracking Systems
- **Multiple Formats**: Import/export JSON, Markdown, DOCX
- **WCAG AA Accessible**: Meets accessibility standards
- **Print Optimized**: Perfect PDFs from browser print
- **Dark Mode**: Automatic theme switching

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Validate schemas
npm run validate
```

## Project Structure

```
cloudflow-resume/
├── apps/web/          # Frontend SPA
│   └── src/
│       ├── importers/   # JSON, MD, DOCX importers
│       ├── schema/      # CFRS schema & mappings
│       ├── render/      # Nunjucks rendering engine
│       ├── themes/      # Built-in themes
│       └── store/       # State management
├── schemas/           # CFRS schema + mappings
├── themes/            # Default themes
├── docs/              # Documentation
└── reports/           # Validation reports
```

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Authoritative configuration
- [Architecture](./docs/ARCHITECTURE.md) - System design (pending)
- [Schema Spec](./docs/SCHEMA.md) - CFRS specification (pending)
- [Theme Guide](./docs/THEMES.md) - Theme development (pending)

## Technology Stack

- **Frontend**: Preact + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Templating**: Nunjucks
- **Schema**: JSON Schema + AJV
- **Testing**: Vitest + Testing Library
- **Deployment**: GitHub Pages

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Validate schemas
npm run validate:schema

# Validate mappings
npm run validate:mappings

# Run all validations
npm run validate
```

## Contributing

All contributions must follow:

1. Schema changes require ADRs
2. Themes must be CSS + Nunjucks only (no JS)
3. Maintain JSON Resume compatibility
4. Pass all CI checks
5. Update MANIFEST.json

See [CLAUDE.md](./CLAUDE.md) for detailed guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Privacy

CloudFlow Resume processes all data locally in your browser. No resume data is ever sent to external servers. All imports, exports, and rendering happen client-side.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with ES2020 support

## Performance

- Load time: <3s on 3G
- Bundle size: <600KB
- Lighthouse score: 95+
- WCAG AA compliant

---

Built with privacy and accessibility in mind.
