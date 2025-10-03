---
STATUS: AUTHORITATIVE
VERSION: 1.0.0
CREATED: 2025-10-03
AGENT: REVIEWER
PURPOSE: Master compliance checklist for CloudFlow Resume project
---

# CloudFlow Resume - Compliance Checklist

## Phase 0: Discovery & Architecture - Definition of Done

### Schema Development

- [ ] **CFRS v1.0.0 JSON Schema drafted**
  - [ ] Schema file at `/schemas/cfrs.schema.json`
  - [ ] All required properties defined
  - [ ] Optional properties documented
  - [ ] Namespaced extensions use `x_cfrs_*` prefix only
  - [ ] Backward compatible with JSON Resume v1.2.1
  - [ ] Contains at least 3 complete example resumes
  - [ ] Schema validates itself (meta-validation)

- [ ] **CFRS ↔ JSON Resume mapping complete**
  - [ ] Mapping file at `/schemas/cfrs-to-jrs.json`
  - [ ] All CFRS fields map to JRS equivalents
  - [ ] JRS-to-CFRS reverse mapping included
  - [ ] Edge cases documented (nullable, array conversions)
  - [ ] Lossless round-trip tested with examples

- [ ] **CFRS ↔ FRESH mapping complete**
  - [ ] Mapping file at `/schemas/cfrs-to-fresh.json`
  - [ ] All CFRS fields map to FRESH equivalents
  - [ ] FRESH-to-CFRS reverse mapping included
  - [ ] Extension field strategy documented
  - [ ] Compatibility notes included

### Architecture Decision Records

- [ ] **ADR-001: Schema Design** created at `/docs/ADR-001-schema.md`
  - [ ] Context: Why CFRS vs extending JRS
  - [ ] Decision: Core schema choices
  - [ ] Consequences: Compatibility approach
  - [ ] Status: Accepted/Proposed
  - [ ] Date: ISO 8601 format from time.gov

- [ ] **ADR template created** at `/docs/templates/ADR-TEMPLATE.md`
  - [ ] Title format standardized
  - [ ] Required sections defined
  - [ ] Numbering scheme established
  - [ ] Status values defined (Proposed/Accepted/Deprecated/Superseded)

### Governance Files

- [ ] **CLAUDE.md updated**
  - [ ] Version incremented if needed
  - [ ] Last audit date updated
  - [ ] Compliance status reflects current state
  - [ ] Documentation hierarchy accurate
  - [ ] Enforcement rules current

- [ ] **MANIFEST.json created** at `/MANIFEST.json`
  - [ ] Schema version declared
  - [ ] All critical files inventoried
  - [ ] Mapping files registered
  - [ ] Theme registry initialized
  - [ ] ADR list included
  - [ ] Last updated timestamp (time.gov)

- [ ] **.claude-rules.json created** at `/.claude-rules.json`
  - [ ] Schema validation rules defined
  - [ ] Mapping validation rules defined
  - [ ] Theme enforcement rules defined
  - [ ] ADR requirement rules defined
  - [ ] CI hook requirements documented

### Repository Scaffold

- [ ] **Directory structure created**
  - [ ] `/schemas/` directory exists
  - [ ] `/docs/` directory exists
  - [ ] `/themes/` directory exists
  - [ ] `/apps/web/` directory exists
  - [ ] `/reports/` directory exists
  - [ ] `/tools/` directory exists
  - [ ] `/convert/` directory exists

- [ ] **Initial documentation**
  - [ ] `/docs/ARCHITECTURE.md` created
  - [ ] `/docs/ENFORCEMENT.md` created
  - [ ] `/docs/SCHEMA.md` created
  - [ ] `/docs/THEMES.md` created
  - [ ] README.md exists with project overview

### Validation & Testing

- [ ] **Schema validation tests**
  - [ ] Valid examples pass validation
  - [ ] Invalid examples fail with clear errors
  - [ ] Mapping conversions are lossless
  - [ ] Round-trip tests pass (CFRS→JRS→CFRS)

- [ ] **Documentation review**
  - [ ] No broken internal links
  - [ ] All required sections present
  - [ ] Markdown linting passes
  - [ ] Code examples are valid

---

## Phase 1: MVP - Definition of Done

### Web Application Core

- [ ] **SPA Deployment**
  - [ ] Vite build configuration complete
  - [ ] GitHub Pages deployment successful
  - [ ] SPA routing functional (404.html fallback)
  - [ ] Base URL configuration correct
  - [ ] Assets loading correctly

- [ ] **Tech Stack**
  - [ ] Vite + TypeScript configured
  - [ ] Preact or React chosen and integrated
  - [ ] State management implemented (Context/Zustand/Redux)
  - [ ] No server dependencies
  - [ ] 100% client-side execution

### Import Functionality

- [ ] **JSON Importer**
  - [ ] Accepts JSON Resume format
  - [ ] Accepts CFRS format
  - [ ] Validates against schema
  - [ ] Shows clear error messages
  - [ ] Handles malformed JSON gracefully

- [ ] **Markdown Importer**
  - [ ] Parses structured Markdown
  - [ ] Extracts contact info
  - [ ] Extracts work experience
  - [ ] Extracts education
  - [ ] Extracts skills
  - [ ] Handles frontmatter (YAML)
  - [ ] Shows preview before import

- [ ] **File Upload**
  - [ ] Drag-and-drop support
  - [ ] File picker support
  - [ ] Size limit enforced (e.g., 5MB)
  - [ ] Type validation (json, md)
  - [ ] Loading state indicators

### Validation & Preview

- [ ] **CFRS Validation**
  - [ ] Schema validation on import
  - [ ] Validation on edit
  - [ ] Clear error messages with field paths
  - [ ] Suggested fixes where possible
  - [ ] Validation summary UI

- [ ] **Structured Preview**
  - [ ] Shows parsed data structure
  - [ ] Editable fields
  - [ ] Add/remove sections
  - [ ] Reorder items (drag-drop or buttons)
  - [ ] Real-time validation feedback

### Theming System

- [ ] **Theme Engine**
  - [ ] Nunjucks rendering engine integrated
  - [ ] Template sandbox enforced (no remote code)
  - [ ] CSS-only styling (no inline JS)
  - [ ] Theme switching without reload
  - [ ] Preview mode before export

- [ ] **Built-in Themes**
  - [ ] Classic theme at `/themes/classic/`
    - [ ] ATS-safe design
    - [ ] Single column layout
    - [ ] Standard fonts (Arial, Times)
    - [ ] Print-optimized
  - [ ] Modern theme at `/themes/modern/`
    - [ ] Two-column layout
    - [ ] Modern typography
    - [ ] Accent colors
    - [ ] Responsive design

- [ ] **Theme Validation**
  - [ ] No JavaScript in templates
  - [ ] No remote resource loading
  - [ ] CSP compliance
  - [ ] Size limit enforced (<500KB per theme)
  - [ ] Required metadata present

### Export Functionality

- [ ] **JSON Export**
  - [ ] CFRS format export
  - [ ] JSON Resume format export
  - [ ] Pretty-printed output
  - [ ] Download as .json file
  - [ ] Copy-to-clipboard option

- [ ] **HTML Export**
  - [ ] Rendered with selected theme
  - [ ] Self-contained (embedded CSS)
  - [ ] No external dependencies
  - [ ] Download as .html file
  - [ ] Opens correctly in browsers

- [ ] **Markdown Export**
  - [ ] Structured Markdown output
  - [ ] YAML frontmatter included
  - [ ] Readable formatting
  - [ ] Download as .md file

- [ ] **Print/PDF Export**
  - [ ] Print-optimized CSS loaded
  - [ ] Page breaks handled correctly
  - [ ] Headers/footers configured
  - [ ] Browser print dialog triggered
  - [ ] Save-as-PDF instructions provided

### UI/UX Requirements

- [ ] **Accessibility (WCAG AA)**
  - [ ] Keyboard navigation functional
  - [ ] Focus indicators visible
  - [ ] Screen reader tested (NVDA/JAWS)
  - [ ] Color contrast ≥4.5:1
  - [ ] ARIA labels present
  - [ ] Form validation accessible
  - [ ] axe-core scan passes with 0 violations

- [ ] **Responsive Design**
  - [ ] Mobile tested (375px width)
  - [ ] Tablet tested (768px width)
  - [ ] Desktop tested (1920px width)
  - [ ] Ultra-wide tested (2560px width)
  - [ ] Touch targets ≥44px
  - [ ] Mobile-first approach

- [ ] **Dark/Light Mode**
  - [ ] System preference detection
  - [ ] Manual toggle available
  - [ ] Preference persists (localStorage)
  - [ ] Smooth transitions
  - [ ] All themes support both modes

- [ ] **Performance**
  - [ ] Load time <3s on 3G
  - [ ] Lighthouse Performance ≥90
  - [ ] First Contentful Paint <1.5s
  - [ ] Time to Interactive <3.0s
  - [ ] No layout shifts (CLS <0.1)

### Security & Privacy

- [ ] **Client-Side Only**
  - [ ] No server API calls
  - [ ] No data sent to backend
  - [ ] No analytics/tracking
  - [ ] No cookies set
  - [ ] localStorage only for preferences

- [ ] **Content Security Policy**
  - [ ] CSP headers configured
  - [ ] No inline scripts
  - [ ] No eval() usage
  - [ ] No remote script loading in themes
  - [ ] CSP tests pass

### CI/CD Pipeline

- [ ] **Automated Checks**
  - [ ] ESLint configured and passing
  - [ ] TypeScript compilation clean
  - [ ] Prettier formatting enforced
  - [ ] Schema validation tests
  - [ ] Unit tests ≥80% coverage
  - [ ] Integration tests for importers
  - [ ] Snapshot tests for themes

- [ ] **GitHub Actions**
  - [ ] Build workflow configured
  - [ ] Test workflow configured
  - [ ] Deploy workflow configured
  - [ ] Schema validation workflow
  - [ ] ADR validation workflow
  - [ ] Runs on PR and push to main

- [ ] **Pre-commit Hooks**
  - [ ] Lint-staged configured
  - [ ] Schema validation runs
  - [ ] Tests run on commit
  - [ ] Formatting enforced

### Documentation

- [ ] **User Documentation**
  - [ ] `/docs/QUICKSTART.md` created
  - [ ] Installation instructions
  - [ ] Basic usage guide
  - [ ] Import format examples
  - [ ] Export options explained
  - [ ] Theme selection guide
  - [ ] Troubleshooting section

- [ ] **Developer Documentation**
  - [ ] `/docs/ARCHITECTURE.md` updated
  - [ ] Component structure documented
  - [ ] State management explained
  - [ ] Build process documented
  - [ ] Contributing guidelines

### Testing Requirements

- [ ] **Unit Tests**
  - [ ] Schema validator tests
  - [ ] Importer tests (JSON, Markdown)
  - [ ] Converter tests (CFRS↔JRS)
  - [ ] Utility function tests
  - [ ] Coverage ≥80%

- [ ] **Integration Tests**
  - [ ] End-to-end import flow
  - [ ] Theme rendering
  - [ ] Export functionality
  - [ ] Validation workflow

- [ ] **Visual Regression Tests**
  - [ ] Theme snapshots
  - [ ] UI component snapshots
  - [ ] Golden fixtures for each theme

- [ ] **Accessibility Tests**
  - [ ] axe-core automated tests
  - [ ] Keyboard navigation tests
  - [ ] Screen reader smoke tests

---

## Phase 2: Extended Importers & Interop - Preview

### Additional Importers

- [ ] Docx importer (mammoth.js)
- [ ] Plain text importer with wizard
- [ ] Fallback messaging for unsupported formats

### Interoperability

- [ ] JSON Resume theme adapter
- [ ] FRESH converter (both directions)
- [ ] Format conversion tests

### GitHub Integration

- [ ] GitHub Gist save/load
- [ ] OAuth flow implementation
- [ ] Scoped token handling

---

## Phase 3: Theming Ecosystem - Preview

### Theme SDK

- [ ] Theme scaffold generator
- [ ] Theme validation CLI
- [ ] Theme registry system
- [ ] Submission guidelines

### Theme Governance

- [ ] Registry manifest schema
- [ ] CI checks for external themes
- [ ] Screenshot requirements
- [ ] At least 5 curated themes

---

## Phase 4: Enhancements - Preview

### Advanced Features

- [ ] Redaction profiles (PII stripping)
- [ ] ATS compatibility checker
- [ ] Multi-locale support
- [ ] Guided writing helpers
- [ ] Performance benchmarks (<3s load on 3G)

---

## Compliance Validation Rules

### Pre-Commit Checks

1. **Schema Validation**: All .json files validate against declared schemas
2. **Mapping Validation**: Round-trip tests pass for all converters
3. **Linting**: ESLint, Prettier, and MarkdownLint pass
4. **Tests**: Unit test suite passes with ≥80% coverage
5. **Type Safety**: TypeScript compiles with no errors

### Pre-PR Checks

1. **Build Success**: Production build completes
2. **Integration Tests**: Full test suite passes
3. **Accessibility**: axe-core scan has 0 violations
4. **Performance**: Lighthouse audit ≥90
5. **Documentation**: Updated for changes

### Pre-Merge Checks

1. **ADR Updated**: If schema/governance changed
2. **MANIFEST.json Updated**: If files added/removed
3. **CHANGELOG Updated**: User-facing changes documented
4. **Version Bump**: SemVer applied correctly
5. **Review Approved**: At least 1 reviewer approval

### Release Checks

1. **All Tests Green**: Full CI/CD pipeline passes
2. **Security Scan**: No high/critical vulnerabilities
3. **Bundle Size**: Production bundle <500KB gzipped
4. **Cross-Browser**: Tested in Chrome, Firefox, Safari, Edge
5. **Mobile Tested**: Tested on real devices (iOS, Android)

---

## Critical Failure Conditions

### Automatic PR Rejection

- Schema validation fails
- CSP violations detected
- Remote JS in themes
- ADR missing for schema changes
- MANIFEST.json out of sync
- Test coverage drops below 80%
- Accessibility violations introduced
- Build fails

### Release Blockers

- Critical security vulnerabilities
- Data loss bugs
- Accessibility regressions
- Performance degradation >20%
- Breaking changes without major version bump

---

## Review Cadence

### Daily (Automated)

- CI/CD pipeline runs
- Dependency vulnerability scans
- Link checking

### Weekly (Automated)

- Lighthouse audits
- Bundle size reports
- Test coverage reports

### Monthly (Manual)

- ADR review and cleanup
- MANIFEST.json audit
- Documentation freshness check
- Security policy review

### Quarterly (Manual)

- Full compliance audit
- CLAUDE.md comprehensive review
- Schema versioning assessment
- Theme registry curation

### Annually (Manual)

- Architecture review
- Dependency major version updates
- Roadmap planning
- License compliance audit

---

## Success Metrics

### Phase 0 Success

- All schema files valid and committed
- All mappings tested and documented
- At least 1 ADR recorded
- Repo structure matches specification

### Phase 1 Success

- App deployed and accessible
- All import/export formats working
- 2+ themes available
- Lighthouse score ≥90
- Zero WCAG AA violations

### Overall Project Success

- Zero-cost hosting maintained
- 100% client-side architecture
- All target formats supported
- Active theme ecosystem
- Comprehensive test coverage
- Clean audit trail via ADRs

---

**Last Updated**: 2025-10-03
**Reviewed By**: REVIEWER Agent
**Next Review**: 2025-10-10 (Phase 0 completion)
