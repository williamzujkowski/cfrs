--- 
STATUS: AUTHORITATIVE
VERSION: 1.0.0
LAST_AUDIT: 2025-10-03
COMPLIANCE: 100%
UI_UX: OPTIMIZED
---

# Claude Code Configuration – CloudFlow Resume Project

## AUTHORITATIVE DOCUMENTATION NOTICE
This file (CLAUDE.md) is the **single source of truth** for:
- Schema standards and mappings (CFRS ↔ JSON Resume ↔ FRESH)
- Resume parsing and import/export rules
- Template and theming requirements
- UI/UX and accessibility guidelines
- Enforcement and governance policies

**Last comprehensive audit:** 2025-10-03  
**Next scheduled review:** 2026-01-01  

---

## Current Compliance Status

### Schema & Data Compliance ✅
- CFRS JSON Schema v1.0.0 adopted
- Namespaced extensions (`x_cfrs_*`) only
- Backward compatible with JSON Resume v1.2.1
- Exportable to JSON Resume & FRESH

### Security & Privacy ✅
- Zero server storage
- All transforms client-side
- CSP locked (no inline/remote JS in themes)
- Redaction presets implemented

### UI/UX & Accessibility ✅
- WCAG AA compliance
- Print/PDF optimized themes
- Mobile-first (375px–2560px tested)
- Dark/light mode detection
- Keyboard navigation & copy-to-clipboard support

### Technical Quality ✅
- GitHub Pages deploy (SPA fallback)
- Vite + TS + Preact/React frontend
- Tests: unit, snapshot, a11y, golden fixtures
- Load time <3s (3G target)
- CI enforcement of schema & ADR rules

---

## MANDATORY ENFORCEMENT NOTICE

**CRITICAL**: Before any operation, you MUST:
1. **CHECK** `.claude-rules.json` for active enforcement rules  
2. **VALIDATE** `cfrs.schema.json` is current  
3. **VERIFY** mappings (`cfrs↔jrs`, `cfrs↔fresh`) are up-to-date  
4. **CONFIRM** operations align with CloudFlow ADRs  
5. **USE** correct timestamps from [time.gov](https://time.gov)  

**Violations will fail CI** if you:
- Break schema or mappings
- Introduce remote JS in themes
- Skip ADRs for changes
- Fail to update MANIFEST.json

**Enforcement is Active**:
- Pre-commit hooks check schema & lint rules
- GitHub Actions enforce standards
- `.claude-rules.json` defines mandatory checks

---

## Documentation Hierarchy

**Primary (Authoritative)**  
- CLAUDE.md (this doc)  
- MANIFEST.json (schema + repo inventory)  
- .claude-rules.json (enforcement rules)  

**Secondary (Supporting)**  
- `/docs/ARCHITECTURE.md` (system design)  
- `/docs/ENFORCEMENT.md` (critical rules)  
- `/docs/SCHEMA.md` (CFRS spec + mappings)  
- `/docs/THEMES.md` (theme SDK & registry rules)  

**Generated (Reference)**  
- `/reports/` (compliance & validation reports)  
- `/schemas/` (JSON Schema & mappings)  

---

## Lessons & Best Practices

### What Works Well
1. Schema-first approach (CFRS)  
2. Local-only privacy model  
3. JSON Resume compatibility mode  
4. Modular themes (Nunjucks + CSS only)  
5. GitHub Pages SPA deploy

### Challenges to Avoid
1. Don’t chase PDF parsing (low quality)  
2. Don’t allow remote JS in themes  
3. Prevent schema fragmentation (mappings are mandatory)  
4. Avoid scope creep into full CMS or ATS features  

---

## Project Directory Structure

```

cloudflow-resume/
├── apps/web          # Frontend SPA
│   └── src/
│       ├── importers   # json, md, docx
│       ├── schema      # cfrs.schema.json, mappings
│       ├── render      # nunjucks engine
│       ├── themes      # builtin themes
│       └── store
├── schemas/         # CFRS schema + mappings
├── themes/          # default themes
├── docs/            # architecture, enforcement, schema, themes
├── reports/         # validation & audit outputs
├── .claude-rules.json
├── MANIFEST.json
└── CLAUDE.md

```

---

## Key Directories Explained

- `/apps/web`: Main SPA, static-rendered on GitHub Pages  
- `/schemas`: JSON Schema (CFRS) + mappings (CFRS↔JRS, CFRS↔FRESH)  
- `/themes`: Default ATS-safe themes (CSS+Nunjucks)  
- `/docs`: Standards, enforcement, and ADRs  
- `/reports`: Generated validation & compliance reports  

---

## Governance & Contribution

- All schema changes require ADRs  
- Themes must pass CI validation (no JS, CSP clean, size check)  
- Compatibility exports (JRS/FRESH) must remain functional  
- MIT license for core + themes  

---

# ✅ CLAUDE.md is the authoritative file. Defer all standards to this document.
