# 📋 Project Plan: CloudFlow Resume Generator (CFRS)

**Mission:** Build a free, client-side web app that converts plain text/Markdown/JSON resumes into structured **CFRS JSON**, applies themes, and exports ATS-friendly resumes in multiple formats.
**Delivery model:** Swarm-based, iterative development. Agents will work in parallel on schema, frontend, importers, themes, and validation, then converge on integrated milestones.

---

## 🎯 Success Criteria (Global)

- **Zero-cost deploy** on GitHub Pages (static SPA).
- **Inputs**: JSON, Markdown, Docx (basic), plain text.
- **Outputs**: JSON (CFRS + JRS), HTML, Markdown, Print-to-PDF.
- **Schema compliance**: All data validates against **CFRS v1**.
- **Privacy**: 100% client-side, no storage.
- **Interoperability**: Guaranteed mapping between CFRS, JSON Resume, and FRESH.
- **Maintainability**: Schema-driven repo with ADRs, automated tests, CI enforcement.
- **User experience**: WCAG AA compliance, responsive UI, <3s load time, redaction presets, theme previews.

---

## 🧩 Project Phases

### Phase 0 — Discovery & Architecture

**Definition of Done**

- CFRS v1 schema drafted with examples.
- Mapping tables for CFRS ↔ JRS and CFRS ↔ FRESH created.
- ADRs recorded for schema decisions.
- Initial repo scaffold with CLAUDE.md, MANIFEST.json, .claude-rules.json.

**Outputs**

- `schemas/cfrs.schema.json`
- `schemas/cfrs-to-jrs.json`
- `schemas/cfrs-to-fresh.json`
- `/docs/ADR-001-schema.md`
- CLAUDE.md updated for project governance.

---

### Phase 1 — Minimum Viable Product (MVP)

**Definition of Done**

- Web SPA deploys on GitHub Pages (SPA routing functional).
- Users can paste/upload JSON Resume or Markdown and see structured preview.
- CFRS validation errors surfaced with clear UI.
- At least 2 built-in themes renderable via Nunjucks (ATS-safe + modern).
- Export working: JSON (CFRS+JRS), HTML, Markdown, Print-PDF.

**Outputs**

- `/apps/web` SPA with importers (JSON, Markdown).
- `/themes/classic`, `/themes/modern`.
- CI pipeline with linting, schema validation, test harness.
- Documentation: `/docs/QUICKSTART.md`.

---

### Phase 2 — Extended Importers & Interop

**Definition of Done**

- Docx importer (via mammoth.js) integrated with fallback messaging.
- Plain text importer wizard (heuristic parsing).
- JSON Resume theme adapter operational (JRS themes usable).
- FRESH converter functional.
- Save/Load from GitHub Gist with scoped token.

**Outputs**

- Importer modules (`docx.ts`, `plaintext.ts`).
- `render/jrs-adapter.ts`.
- `convert/fresh-to-cfrs.ts`, `convert/cfrs-to-fresh.ts`.
- GitHub OAuth flow for Gist.
- ADRs documenting importer limitations and adapter design.

---

### Phase 3 — Theming Ecosystem & Governance

**Definition of Done**

- Theme SDK (scaffold tool) available.
- Theme registry with manifest.json + screenshots.
- CI checks for themes (CSP, no JS, size limits).
- At least 5 curated themes in registry.

**Outputs**

- `/tools/theme-scaffold`.
- `/themes/registry.json`.
- Example external themes validated.
- `/docs/THEMES.md` with submission rules.

---

### Phase 4 — Enhancements & Quality of Life

**Definition of Done**

- Redaction profiles configurable (strip PII).
- ATS-compatibility checker integrated (basic metrics).
- Multi-locale variant builder (per-locale summaries).
- Guided writing helpers (client-side snippets for impact metrics).
- Load test confirms <3s load on 3G for resumes ≤10 pages.

**Outputs**

- `features/redaction.ts`.
- `features/ats-checker.ts`.
- `features/localization.ts`.
- `/docs/ENHANCEMENTS.md`.

---

## 🔑 Swarm Execution Model

- **Agents/units**: schema, importers, render/themes, UX, CI/compliance.

- **Iteration cycle**:
  1. Pull task from backlog.
  2. Implement & test locally.
  3. Submit PR with ADR updates if needed.
  4. Automated checks (lint, schema, tests, a11y, CSP).
  5. Human review swarm → merge.

- **Definition of Done enforcement**:
  - Automated via `.claude-rules.json` + GitHub Actions.
  - ADRs mandatory for schema or governance changes.
  - CLAUDE.md is the enforcement anchor.

---

## 📊 Quality Gates (each PR & milestone)

1. **Schema Validation** — all examples conform to CFRS.
2. **CI Passing** — lint, tests, build.
3. **Accessibility** — axe-core scan passes.
4. **Security** — CSP tests, theme sandboxing enforced.
5. **Performance** — Lighthouse ≥90 (Performance, A11y, Best Practices).

---

## 📁 Repo Layout (final target)

```
cloudflow-resume/
├── apps/web          # Frontend SPA
│   └── src/
│       ├── importers   # json, md, docx, plaintext
│       ├── schema      # cfrs.schema.json, mappings
│       ├── render      # nunjucks engine + adapters
│       ├── themes      # builtin themes
│       └── store
├── schemas/         # CFRS schema + mappings
├── convert/         # conversion scripts (cfrs↔jrs, cfrs↔fresh)
├── tools/           # theme-scaffold, validators
├── themes/          # registry + curated themes
├── docs/            # ADRs, ARCHITECTURE, THEMES, ENFORCEMENT
├── reports/         # validation/audit outputs
├── .claude-rules.json
├── MANIFEST.json
└── CLAUDE.md
```

---

## 📝 Deliverables (at full completion)

- CFRS v1 schema + mapping tables.
- GitHub Pages SPA (import, validate, render, export).
- At least 5 high-quality themes (ATS-safe, modern, creative).
- Theme SDK + registry + CI governance.
- Redaction + ATS checker features.
- ADR history documenting major decisions.
- Automated compliance enforcement (lint, schema, CSP).

---

👉 With this swarm-ready plan, each unit can iterate independently, validate against DoD, and integrate into a high-quality, auditable deliverable.

---

Would you like me to now **author the initial backlog (GitHub issues with labels/milestones)** so the swarm can pick them up directly?
