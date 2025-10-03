# CloudFlow Resume Testing Strategy
**Version:** 1.0.0
**Date:** 2025-10-03
**Agent:** TESTER
**Status:** AUTHORITATIVE

---

## Executive Summary

This document defines the comprehensive testing strategy for CloudFlow Resume (CFRS), ensuring quality, security, accessibility, and performance compliance. The strategy aligns with CLAUDE.md requirements and supports the project's mission of delivering a reliable, client-side resume generation platform.

### Key Testing Objectives
1. **Schema Compliance:** 100% validation against CFRS v1.0.0
2. **Security:** Zero XSS vulnerabilities, CSP enforcement, no remote JS
3. **Accessibility:** WCAG AA compliance across all UI components
4. **Performance:** <3s load time on 3G networks
5. **Interoperability:** Correct CFRS ↔ JRS ↔ FRESH mappings
6. **Privacy:** Client-side only validation

---

## Test Pyramid Architecture

### Level 1: Unit Tests (70% coverage target)
**Volume:** ~500-700 tests
**Execution Time:** <30 seconds
**Framework:** Vitest + Testing Library

#### Coverage Areas:

**Schema Validation (High Priority)**
- CFRS JSON Schema validator tests
- Field type validation (string, array, object)
- Required vs optional field enforcement
- Namespace validation (`x_cfrs_*` patterns)
- Schema version compatibility checks
- Invalid data rejection tests

**Importers**
- JSON parser (valid/invalid inputs)
- Markdown parser (heading extraction, list parsing)
- Docx parser (mammoth.js integration, fallback handling)
- Plain text heuristic parser (regex patterns, structure detection)
- Edge cases: empty files, malformed data, encoding issues

**Exporters**
- CFRS → JSON Resume mapping accuracy
- CFRS → FRESH transformation
- HTML export (Nunjucks template rendering)
- Markdown export (structure preservation)
- Data loss prevention (round-trip validation)

**Utilities**
- Date formatting functions
- String sanitization (XSS prevention)
- Redaction logic (PII stripping)
- Locale-specific formatting
- Copy-to-clipboard functions

### Level 2: Integration Tests (20% coverage target)
**Volume:** ~100-150 tests
**Execution Time:** 1-2 minutes
**Framework:** Vitest + Playwright Component Testing

#### Coverage Areas:

**End-to-End Data Flows**
- Import → Validate → Render → Export pipeline
- Schema validation → Error surfacing → UI feedback
- Theme selection → Rendering → Preview
- Multi-format export chains

**Component Integration**
- Store state management with UI updates
- Router navigation with data persistence
- Theme engine with data binding
- Form validation with schema enforcement

**Mapping Validation**
- CFRS to JSON Resume (full object mapping)
- JSON Resume to CFRS (reverse mapping)
- CFRS to FRESH (format transformation)
- Data integrity across conversions

**GitHub Integration**
- OAuth flow simulation
- Gist save/load operations
- Error handling for API failures

### Level 3: End-to-End Tests (10% coverage target)
**Volume:** ~30-50 tests
**Execution Time:** 3-5 minutes
**Framework:** Playwright

#### Critical User Journeys:

1. **First-time User Flow**
   - Landing page → Upload JSON → Preview → Export PDF
   - Expected: <3s load, valid output, no errors

2. **JSON Resume Import**
   - Upload JRS file → Auto-convert to CFRS → Render theme
   - Expected: 100% field mapping, theme renders correctly

3. **Markdown Resume Creation**
   - Paste MD → Parse → Validate → Apply theme → Export
   - Expected: Structure preserved, ATS-safe output

4. **Theme Switching**
   - Load resume → Switch themes → Compare outputs
   - Expected: All themes render consistently, no data loss

5. **Redaction Workflow**
   - Load resume → Apply redaction profile → Export
   - Expected: PII removed, structure intact

6. **Multi-format Export**
   - Single resume → Export as JSON/HTML/MD/PDF
   - Expected: All formats valid, content equivalent

---

## Accessibility Testing Plan

### WCAG AA Compliance Checklist

#### Automated Testing (CI Integration)
**Tool:** axe-core + pa11y

**Test Cases:**
- [ ] Color contrast ≥4.5:1 for normal text
- [ ] Color contrast ≥3:1 for large text (18pt+)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (outline ≥2px)
- [ ] Form labels properly associated
- [ ] Alt text for all images
- [ ] ARIA landmarks present (main, nav, banner)
- [ ] Heading hierarchy logical (h1 → h2 → h3)
- [ ] No seizure-inducing animations
- [ ] Screen reader announcements for dynamic content

#### Manual Testing (Per Release)
**Tool:** NVDA/JAWS + VoiceOver

**Test Scenarios:**
1. **Screen Reader Navigation**
   - Tab through entire app with eyes closed
   - Verify announcements clear and contextual
   - Test skip-to-content links

2. **Keyboard-Only Operation**
   - Complete full resume workflow without mouse
   - Verify modals, dropdowns, theme selector accessible
   - Test escape key behavior

3. **Zoom Testing**
   - Test UI at 200% zoom (no horizontal scroll)
   - Verify text reflows correctly
   - Check mobile breakpoints (375px–768px)

4. **Color Blindness Simulation**
   - Test with Deuteranopia filter (red-green)
   - Verify error states not color-only
   - Check theme contrast ratios

#### Accessibility Test Automation
```typescript
// Example: axe-core integration test
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('Homepage accessibility', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});

test('Resume editor keyboard navigation', async ({ page }) => {
  await page.goto('/editor');

  // Verify tab order
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-testid="import-button"]')).toBeFocused();

  // Verify skip link
  await page.keyboard.press('Tab');
  await expect(page.locator('[href="#main-content"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});
```

---

## Performance Testing Strategy

### Target Benchmarks
- **Initial Load:** <3s on 3G (1.6 Mbps, 300ms RTT)
- **Time to Interactive (TTI):** <4s
- **First Contentful Paint (FCP):** <1.5s
- **Largest Contentful Paint (LCP):** <2.5s
- **Cumulative Layout Shift (CLS):** <0.1
- **Bundle Size:** <150KB (gzipped)

### Performance Test Suite

#### Load Time Testing
**Tool:** Lighthouse CI + WebPageTest

**Test Matrix:**
| Network | Device | Target TTI |
|---------|--------|------------|
| 3G      | Mobile | <4s        |
| 4G      | Mobile | <2s        |
| Cable   | Desktop| <1.5s      |

**Automated Tests:**
```typescript
// lighthouse-config.js
export default {
  extends: 'lighthouse:default',
  settings: {
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 300,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4
    }
  },
  assertions: {
    'categories:performance': ['error', { minScore: 0.9 }],
    'categories:accessibility': ['error', { minScore: 0.9 }],
    'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
    'interactive': ['error', { maxNumericValue: 3000 }]
  }
};
```

#### Runtime Performance
**Tool:** Vitest + performance.mark/measure

**Test Cases:**
- [ ] Schema validation <50ms (10KB resume)
- [ ] Theme rendering <200ms
- [ ] Export generation <500ms
- [ ] Import parsing <100ms per format
- [ ] Memory usage <50MB for typical resume

**Example Test:**
```typescript
test('Schema validation performance', () => {
  const largeResume = generateLargeResume(1000); // 1000 work items

  const start = performance.now();
  const result = validateCFRS(largeResume);
  const duration = performance.now() - start;

  expect(result.valid).toBe(true);
  expect(duration).toBeLessThan(50);
});
```

#### Bundle Size Monitoring
**Tool:** bundlesize + size-limit

**Limits:**
```json
{
  "bundlesize": [
    { "path": "./dist/index.html", "maxSize": "5 KB" },
    { "path": "./dist/assets/*.js", "maxSize": "100 KB" },
    { "path": "./dist/assets/*.css", "maxSize": "20 KB" },
    { "path": "./dist/themes/*.css", "maxSize": "10 KB" }
  ]
}
```

---

## Security Testing Plan

### CSP (Content Security Policy) Validation

#### Automated CSP Tests
**Tool:** csp-evaluator + custom validators

**Test Cases:**
- [ ] No `unsafe-inline` in script-src
- [ ] No `unsafe-eval` in script-src
- [ ] All external resources whitelisted
- [ ] Theme CSS contains no inline styles
- [ ] Nunjucks templates properly escaped

**Implementation:**
```typescript
test('CSP headers enforce security policy', async ({ page }) => {
  const response = await page.goto('/');
  const cspHeader = response.headers()['content-security-policy'];

  expect(cspHeader).toContain("script-src 'self'");
  expect(cspHeader).not.toContain('unsafe-inline');
  expect(cspHeader).not.toContain('unsafe-eval');
  expect(cspHeader).toContain("style-src 'self'");
});

test('Themes contain no JavaScript', async () => {
  const themes = await glob('./themes/**/*.{njk,html}');

  for (const theme of themes) {
    const content = await fs.readFile(theme, 'utf-8');

    // No <script> tags
    expect(content).not.toMatch(/<script[\s>]/i);

    // No inline event handlers
    expect(content).not.toMatch(/on\w+\s*=/i);

    // No javascript: protocols
    expect(content).not.toMatch(/javascript:/i);
  }
});
```

### XSS Prevention Testing

#### Injection Attack Vectors
**Tool:** DOMPurify test suite + custom payloads

**Test Payloads:**
```typescript
const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  'javascript:alert("XSS")',
  '<iframe src="javascript:alert(\'XSS\')">',
  '"><script>alert(String.fromCharCode(88,83,83))</script>',
  '<body onload=alert("XSS")>',
];

test.each(xssPayloads)('Sanitizes XSS payload: %s', (payload) => {
  const resume = { basics: { name: payload } };
  const rendered = renderTheme(resume, 'classic');

  expect(rendered).not.toContain('<script');
  expect(rendered).not.toContain('onerror=');
  expect(rendered).not.toContain('javascript:');
});
```

#### Content Injection Tests
- User-supplied URLs (phishing prevention)
- Markdown injection (via CommonMark spec)
- JSON injection (schema validation enforcement)
- Template injection (Nunjucks sandbox)

### Theme Security Validation

#### Theme Submission Checklist
**Automated CI Checks:**
- [ ] No external resource loading (fonts, scripts, images)
- [ ] CSS size limit: <10KB
- [ ] No `@import` statements
- [ ] No `url()` with external domains
- [ ] Passes CSP evaluation
- [ ] Valid Nunjucks syntax
- [ ] Screenshot provided (for preview)

**Test Implementation:**
```typescript
test('Theme meets security requirements', async () => {
  const themeCSS = await fs.readFile('./themes/new-theme/style.css');

  // No external resources
  expect(themeCSS).not.toMatch(/url\(['"]?https?:/);
  expect(themeCSS).not.toMatch(/@import/);

  // Size limit
  expect(themeCSS.length).toBeLessThan(10 * 1024);

  // No JavaScript-like patterns
  expect(themeCSS).not.toMatch(/expression\(/);
  expect(themeCSS).not.toMatch(/javascript:/);
});
```

---

## Golden Fixture & Snapshot Testing

### Golden Fixture Strategy

#### Fixture Categories

**1. Reference Resumes (10 fixtures)**
- `golden/minimal.json` - Minimal valid CFRS
- `golden/complete.json` - All fields populated
- `golden/jrs-compat.json` - JSON Resume format
- `golden/fresh-compat.json` - FRESH format
- `golden/unicode.json` - International characters
- `golden/edge-cases.json` - Boundary values
- `golden/ats-safe.json` - ATS-optimized
- `golden/creative.json` - Rich formatting
- `golden/academic.json` - Publications, awards
- `golden/developer.json` - Projects, skills

**2. Mapping Fixtures (6 fixtures)**
- `mappings/cfrs-to-jrs.json` - Transformation reference
- `mappings/jrs-to-cfrs.json` - Reverse mapping
- `mappings/cfrs-to-fresh.json` - FRESH export
- `mappings/fresh-to-cfrs.json` - FRESH import
- `mappings/edge-cases.json` - Lossy transformations
- `mappings/extensions.json` - Custom field handling

**3. Theme Output Fixtures (Per Theme)**
- `themes/classic/snapshots/*.html` - Rendered HTML
- `themes/modern/snapshots/*.html`
- `themes/minimal/snapshots/*.html`

### Snapshot Testing Implementation

#### Visual Regression Testing
**Tool:** Playwright + pixelmatch

```typescript
test('Theme renders consistently', async ({ page }) => {
  const resume = await loadFixture('golden/complete.json');

  await page.goto(`/preview?theme=classic`);
  await page.evaluate((data) => {
    window.loadResume(data);
  }, resume);

  // Wait for rendering
  await page.waitForSelector('[data-testid="resume-output"]');

  // Visual snapshot
  await expect(page).toHaveScreenshot('classic-complete.png', {
    maxDiffPixels: 100
  });
});
```

#### Schema Snapshot Testing
**Tool:** Vitest snapshots

```typescript
test('CFRS to JRS mapping snapshot', () => {
  const cfrs = loadFixture('golden/complete.json');
  const jrs = convertCFRStoJRS(cfrs);

  expect(jrs).toMatchSnapshot();
});

test('Import produces consistent structure', () => {
  const markdown = loadFixture('imports/resume.md');
  const parsed = parseMarkdown(markdown);

  expect(parsed).toMatchSnapshot();
});
```

### Golden Fixture Maintenance

**Update Triggers:**
- Schema version bump (regenerate all)
- Mapping changes (update affected pairs)
- Theme modifications (regenerate theme snapshots)
- New features (add fixture variants)

**Validation Process:**
1. Run `npm run fixtures:generate`
2. Visual review of diffs
3. Commit approved changes
4. Update fixture manifest

---

## CI/CD Test Automation Pipeline

### GitHub Actions Workflow

#### Stage 1: Fast Feedback (<2 min)
**Triggers:** Every push, PR

```yaml
name: Fast Feedback
on: [push, pull_request]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

#### Stage 2: Schema Validation (<1 min)
**Triggers:** Every push, PR

```yaml
  schema-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci

      # Validate all fixtures against schema
      - run: npm run validate:fixtures

      # Check mapping consistency
      - run: npm run validate:mappings

      # Verify schema version matches CLAUDE.md
      - run: node scripts/check-schema-version.js
```

#### Stage 3: Integration Tests (<3 min)
**Triggers:** PR to main, main branch

```yaml
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration
```

#### Stage 4: E2E & Visual Tests (<5 min)
**Triggers:** PR to main, main branch

```yaml
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

      # Upload failure screenshots
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-screenshots
          path: test-results/
```

#### Stage 5: Accessibility Audit (<2 min)
**Triggers:** PR to main, main branch

```yaml
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build

      # Serve build and run axe-core
      - run: npm run test:a11y

      # Generate report
      - uses: actions/upload-artifact@v3
        with:
          name: a11y-report
          path: reports/accessibility.html
```

#### Stage 6: Security Scans (<3 min)
**Triggers:** PR to main, main branch, daily

```yaml
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci

      # Theme security validation
      - run: npm run validate:themes

      # CSP header checks
      - run: npm run test:csp

      # Dependency audit
      - run: npm audit --audit-level=moderate

      # OWASP dependency check
      - uses: dependency-check/Dependency-Check_Action@main
        with:
          path: '.'
          format: 'HTML'
```

#### Stage 7: Performance Budget (<2 min)
**Triggers:** PR to main, main branch

```yaml
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build

      # Bundle size check
      - run: npm run test:bundle-size

      # Lighthouse CI
      - run: npm run lighthouse:ci

      # Runtime performance tests
      - run: npm run test:performance
```

#### Stage 8: Theme Validation (<1 min)
**Triggers:** Changes to /themes/**

```yaml
  theme-validation:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'themes/')
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci

      # Validate theme structure
      - run: npm run validate:theme-structure

      # Security checks (no JS)
      - run: npm run validate:theme-security

      # Render snapshots
      - run: npm run test:theme-snapshots
```

### Pre-commit Hooks (Husky + lint-staged)

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "npm run test:unit -- --findRelatedTests"
    ],
    "*.json": [
      "prettier --write",
      "npm run validate:schema"
    ],
    "themes/**/*.{njk,css}": [
      "npm run validate:theme-security"
    ]
  }
}
```

### Deployment Gates (Production)

**Required Checks (All must pass):**
- ✅ All unit tests pass (>80% coverage)
- ✅ All integration tests pass
- ✅ All E2E tests pass
- ✅ Accessibility score ≥90
- ✅ Performance score ≥90
- ✅ Security scans clean
- ✅ Schema validation passes
- ✅ Bundle size within budget
- ✅ Visual regression approved (if changed)

**Manual Review Required:**
- Theme additions/modifications
- Schema version bumps
- Mapping changes
- Security-sensitive changes

---

## Critical Path Test Cases

### Test Case 1: JSON Resume Import & Export

**Objective:** Verify round-trip data integrity

**Steps:**
1. Load `golden/complete.json` (JSON Resume format)
2. Convert to CFRS
3. Render with 'classic' theme
4. Export back to JSON Resume
5. Compare original vs exported

**Expected Results:**
- No data loss in conversion
- All fields correctly mapped
- Theme renders all sections
- Exported JSON validates against JRS schema
- Structural equivalence (deep equality)

**Test Code:**
```typescript
test('JSON Resume round-trip preserves data', async () => {
  const original = await loadFixture('golden/jrs-complete.json');

  // Import
  const cfrs = convertJRStoCFRS(original);
  expect(validateCFRS(cfrs).valid).toBe(true);

  // Render
  const html = renderTheme(cfrs, 'classic');
  expect(html).toContain(original.basics.name);

  // Export
  const exported = convertCFRStoJRS(cfrs);
  expect(validateJRS(exported).valid).toBe(true);

  // Compare (order-insensitive)
  expect(exported).toMatchObject(original);
});
```

### Test Case 2: Markdown Import with Edge Cases

**Objective:** Handle malformed Markdown gracefully

**Steps:**
1. Load `imports/edge-cases.md` (missing sections, invalid dates)
2. Parse with error recovery
3. Validate against CFRS
4. Surface warnings to UI
5. Allow user correction

**Expected Results:**
- Parser doesn't crash
- Warnings clearly indicate issues
- Valid sections imported successfully
- Invalid sections skipped with notice
- User can manually fix errors

**Test Code:**
```typescript
test('Markdown parser handles edge cases', async () => {
  const markdown = await loadFixture('imports/edge-cases.md');

  const result = parseMarkdown(markdown);

  expect(result.data).toBeDefined();
  expect(result.warnings).toHaveLength(3);
  expect(result.warnings[0].section).toBe('work');
  expect(result.warnings[0].message).toContain('invalid date');

  // Valid sections parsed
  expect(result.data.basics.name).toBe('John Doe');

  // Invalid sections null/empty
  expect(result.data.work).toHaveLength(0);
});
```

### Test Case 3: Theme Security Enforcement

**Objective:** Prevent malicious theme code execution

**Steps:**
1. Submit theme with `<script>` tag
2. Run theme validation
3. Check CSP compliance
4. Attempt to render
5. Verify rejection

**Expected Results:**
- CI rejects theme submission
- Error message clearly states violation
- No script execution possible
- Theme not added to registry
- Security report generated

**Test Code:**
```typescript
test('Theme with JavaScript is rejected', async () => {
  const maliciousTheme = `
    <div class="resume">
      <script>alert('XSS')</script>
      {{ basics.name }}
    </div>
  `;

  const validation = await validateTheme({
    name: 'malicious',
    template: maliciousTheme,
    style: ''
  });

  expect(validation.valid).toBe(false);
  expect(validation.errors).toContainEqual(
    expect.objectContaining({
      code: 'THEME_CONTAINS_SCRIPT',
      message: expect.stringContaining('JavaScript not allowed')
    })
  );
});
```

### Test Case 4: Accessibility - Keyboard Navigation

**Objective:** Ensure full keyboard operability

**Steps:**
1. Load app with keyboard only
2. Tab through all controls
3. Activate import button (Enter/Space)
4. Navigate theme selector (Arrow keys)
5. Export resume (Enter)

**Expected Results:**
- All controls reachable via Tab
- Focus indicators visible (2px outline)
- Logical tab order (top-to-bottom, left-to-right)
- No keyboard traps
- Screen reader announces state changes

**Test Code:**
```typescript
test('Full keyboard navigation workflow', async ({ page }) => {
  await page.goto('/');

  // Tab to import button
  await page.keyboard.press('Tab');
  await expect(page.locator('[aria-label="Import resume"]')).toBeFocused();

  // Activate with keyboard
  await page.keyboard.press('Enter');
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // Navigate within dialog
  await page.keyboard.press('Tab');
  await expect(page.locator('[aria-label="Upload file"]')).toBeFocused();

  // Close dialog with Escape
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();

  // Focus returns to trigger button
  await expect(page.locator('[aria-label="Import resume"]')).toBeFocused();
});
```

### Test Case 5: Performance - 3G Load Time

**Objective:** Meet <3s load target on 3G

**Steps:**
1. Simulate 3G network (1.6 Mbps, 300ms RTT)
2. Clear cache
3. Load homepage
4. Measure Time to Interactive (TTI)
5. Verify bundle sizes

**Expected Results:**
- TTI <3s
- FCP <1.5s
- LCP <2.5s
- Total bundle <150KB (gzipped)
- No render-blocking resources

**Test Code:**
```typescript
test('Homepage loads under 3s on 3G', async ({ page }) => {
  // Simulate 3G
  await page.route('**/*', (route) => {
    route.continue({
      delay: 300 + Math.random() * 100
    });
  });

  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const tti = entries.find(e => e.name === 'tti');
        resolve(tti);
      }).observe({ entryTypes: ['measure'] });

      // Trigger measurement
      performance.measure('tti', 'navigationStart');
    });
  });

  expect(metrics.duration).toBeLessThan(3000);
});
```

### Test Case 6: Redaction Profile

**Objective:** Strip PII correctly

**Steps:**
1. Load resume with full personal details
2. Apply 'anonymous' redaction profile
3. Verify phone, email, address removed
4. Ensure work history preserved
5. Export and validate

**Expected Results:**
- Phone number: removed
- Email: removed or anonymized (j***@example.com)
- Address: removed or city/country only
- Name: initials only (J.D.)
- Work content: unchanged
- Schema still valid

**Test Code:**
```typescript
test('Anonymous redaction profile strips PII', () => {
  const resume = loadFixture('golden/complete.json');
  const redacted = applyRedaction(resume, 'anonymous');

  // Personal data removed/anonymized
  expect(redacted.basics.name).toBe('J. D.');
  expect(redacted.basics.email).toMatch(/^[a-z]\*\*\*@/);
  expect(redacted.basics.phone).toBeUndefined();
  expect(redacted.basics.location.address).toBeUndefined();

  // Work data preserved
  expect(redacted.work).toHaveLength(resume.work.length);
  expect(redacted.work[0].position).toBe(resume.work[0].position);

  // Still valid CFRS
  expect(validateCFRS(redacted).valid).toBe(true);
});
```

---

## Test Tooling & Infrastructure

### Recommended Stack

**Unit & Integration Testing:**
- Framework: Vitest
- Assertions: Vitest (Jest-compatible)
- Mocking: Vitest mocks
- Coverage: c8

**E2E Testing:**
- Framework: Playwright
- Browsers: Chromium, Firefox, WebKit
- Visual: Playwright screenshots + pixelmatch
- Network: Playwright route mocking

**Accessibility:**
- Automated: axe-core + pa11y
- Manual: NVDA, JAWS, VoiceOver
- Reporting: axe-core HTML reporter

**Performance:**
- Lighthouse CI (automated)
- WebPageTest (manual validation)
- bundlesize (CI integration)
- Chrome DevTools Performance profiling

**Security:**
- CSP Evaluator
- DOMPurify test suite
- npm audit
- OWASP Dependency-Check

### Test Data Management

**Fixture Location:** `/tests/fixtures/`

**Structure:**
```
tests/
├── fixtures/
│   ├── golden/           # Reference resumes
│   ├── imports/          # Import test data
│   ├── mappings/         # Transformation refs
│   └── themes/           # Theme snapshots
├── unit/
├── integration/
├── e2e/
└── helpers/
```

**Fixture Generation:**
```bash
npm run fixtures:generate       # Regenerate all
npm run fixtures:validate       # Validate against schema
npm run fixtures:snapshot       # Update snapshots
```

---

## Continuous Improvement

### Test Metrics Dashboard

**Key Metrics (tracked in CI):**
- Unit test coverage: Target >80%
- E2E test pass rate: Target >95%
- Accessibility score: Target ≥90
- Performance score: Target ≥90
- Security scan status: Zero high/critical
- Visual regression drift: <100px diff

### Review Cadence

**Weekly:**
- Review failed tests
- Update flaky test list
- Check coverage trends

**Monthly:**
- Audit test execution time
- Review accessibility reports
- Update performance baselines

**Quarterly:**
- Major fixture refresh
- Security dependency updates
- Test strategy retrospective

### Test Debt Management

**Priorities:**
1. Fix failing tests (blocker)
2. Address flaky tests (high)
3. Improve coverage gaps (medium)
4. Optimize slow tests (low)

**Definition of Test Debt:**
- Skipped tests (`.skip`, `.todo`)
- Coverage below 80% for new code
- E2E tests >30s execution time
- Accessibility violations not addressed

---

## Appendix: Test Case Templates

### Unit Test Template
```typescript
import { describe, it, expect } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle valid input', () => {
      const input = { /* ... */ };
      const result = functionName(input);
      expect(result).toEqual({ /* ... */ });
    });

    it('should reject invalid input', () => {
      const invalid = { /* ... */ };
      expect(() => functionName(invalid)).toThrow();
    });

    it('should handle edge cases', () => {
      expect(functionName(null)).toBe(null);
      expect(functionName([])).toEqual([]);
    });
  });
});
```

### Integration Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should complete end-to-end flow', async ({ page }) => {
    // Setup
    await page.goto('/');

    // Action
    await page.click('[data-testid="action-button"]');

    // Assert
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
    await expect(page.locator('[data-testid="result"]')).toHaveText('Expected');
  });
});
```

### Accessibility Test Template
```typescript
import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('Component accessibility', async ({ page }) => {
  await page.goto('/component');
  await injectAxe(page);

  await checkA11y(page, '[data-testid="component"]', {
    detailedReport: true,
    rules: {
      'color-contrast': { enabled: true },
      'label': { enabled: true }
    }
  });
});
```

---

## Summary

This testing strategy provides comprehensive coverage across all quality dimensions:

✅ **Schema Compliance** - Automated validation against CFRS v1.0.0
✅ **Security** - CSP enforcement, XSS prevention, theme sandboxing
✅ **Accessibility** - WCAG AA automated + manual testing
✅ **Performance** - <3s load time on 3G with budget enforcement
✅ **Interoperability** - Golden fixtures for mapping validation
✅ **CI/CD** - Multi-stage pipeline with deployment gates

**Next Steps:**
1. Implement test infrastructure (Vitest + Playwright setup)
2. Create golden fixtures (10 reference resumes)
3. Build CI pipeline (GitHub Actions)
4. Establish baseline metrics
5. Train team on testing practices

---

**Document Control:**
- Version: 1.0.0
- Last Updated: 2025-10-03
- Next Review: 2025-11-03
- Owner: TESTER Agent
