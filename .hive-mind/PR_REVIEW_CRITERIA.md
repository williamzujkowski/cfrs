---
STATUS: AUTHORITATIVE
VERSION: 1.0.0
CREATED: 2025-10-03
PURPOSE: Pull Request review criteria and checklist
---

# Pull Request Review Criteria

## Overview

This document defines the review standards for all pull requests in the CloudFlow Resume project. Reviews MUST verify compliance with project governance, technical standards, and quality gates.

---

## Pre-Review Automated Checks

### CI Pipeline Status
All automated checks MUST pass before human review begins:

- [ ] **Build Success**: Production build completes without errors
- [ ] **Lint Passing**: ESLint, Prettier, and MarkdownLint show no violations
- [ ] **Type Check**: TypeScript compiles with zero errors
- [ ] **Unit Tests**: All tests pass with ≥80% coverage
- [ ] **Integration Tests**: End-to-end scenarios pass
- [ ] **Schema Validation**: All JSON files validate against schemas
- [ ] **Accessibility**: axe-core scan reports zero violations
- [ ] **Security Scan**: No high/critical vulnerabilities introduced

**If any automated check fails**: Request fixes before human review.

---

## Human Review Checklist

### 1. Governance Compliance

#### Schema Changes
- [ ] If schema modified: ADR created/updated
- [ ] Schema version bumped appropriately (SemVer)
- [ ] Mappings updated (CFRS↔JRS, CFRS↔FRESH)
- [ ] Round-trip tests added/updated
- [ ] Example resumes validate against new schema
- [ ] Breaking changes flagged in CHANGELOG
- [ ] Migration guide provided if needed

#### Documentation Updates
- [ ] MANIFEST.json updated if files added/removed
- [ ] CLAUDE.md updated if governance changed
- [ ] .claude-rules.json updated if enforcement changed
- [ ] Relevant /docs updated for feature changes
- [ ] CHANGELOG.md updated for user-facing changes
- [ ] Code comments added for complex logic

#### ADR Requirements
Must create/update ADR for:
- Schema changes
- Architecture decisions
- Dependency additions
- Build process changes
- Theme governance changes
- Security policy changes

**Verification**:
- [ ] ADR number sequential and not reused
- [ ] ADR follows template structure
- [ ] ADR status is Proposed or Accepted
- [ ] ADR referenced in PR description
- [ ] MANIFEST.json includes new ADR

---

### 2. Code Quality

#### TypeScript Standards
- [ ] No `any` types (use `unknown` or specific types)
- [ ] Interfaces/types properly exported
- [ ] No TypeScript errors or warnings
- [ ] Return types explicitly declared
- [ ] Generics used appropriately
- [ ] Enums preferred over string literals

#### Code Organization
- [ ] Files in correct directory per architecture
- [ ] Import statements organized (external, internal, types)
- [ ] Single Responsibility Principle followed
- [ ] Functions ≤50 lines (complex logic extracted)
- [ ] Files ≤300 lines (split if larger)
- [ ] No duplicate code (DRY principle)

#### Naming Conventions
- [ ] Variables: camelCase
- [ ] Functions: camelCase
- [ ] Components: PascalCase
- [ ] Types/Interfaces: PascalCase
- [ ] Constants: SCREAMING_SNAKE_CASE
- [ ] Files: kebab-case.ts or PascalCase.tsx
- [ ] Descriptive names (avoid abbreviations)

#### Error Handling
- [ ] All async functions handle errors
- [ ] User-facing errors have clear messages
- [ ] Error boundaries implemented for components
- [ ] Network errors handled gracefully
- [ ] Validation errors surfaced to UI
- [ ] No console.error in production code

---

### 3. Schema & Data Compliance

#### CFRS Schema Adherence
- [ ] All data conforms to CFRS v1.x.x
- [ ] Only namespaced extensions (`x_cfrs_*`) used
- [ ] No undocumented fields added
- [ ] Required fields always present
- [ ] Optional fields handled gracefully
- [ ] Arrays properly typed and validated

#### Mapping Integrity
- [ ] CFRS→JRS mapping lossless
- [ ] JRS→CFRS mapping functional
- [ ] CFRS→FRESH mapping preserves data
- [ ] Round-trip tests demonstrate correctness
- [ ] Edge cases documented

#### Data Validation
- [ ] Client-side validation before processing
- [ ] Schema validation on import
- [ ] Clear error messages for invalid data
- [ ] Graceful degradation for missing fields
- [ ] No silent data loss

---

### 4. Security & Privacy

#### Client-Side Architecture
- [ ] No server API calls introduced
- [ ] No data transmitted externally
- [ ] No analytics/tracking added
- [ ] No cookies set (except essential preferences)
- [ ] LocalStorage use justified and minimal

#### Content Security Policy
- [ ] No inline scripts added
- [ ] No eval() or Function() constructor
- [ ] No remote script loading
- [ ] No unsafe-inline or unsafe-eval directives
- [ ] Theme rendering sandboxed

#### Theme Security
- [ ] Themes contain CSS only (no JS)
- [ ] No remote resource loading in themes
- [ ] No data URIs exceeding size limits
- [ ] Theme metadata sanitized
- [ ] User-provided content escaped

#### Dependency Security
- [ ] New dependencies justified in ADR
- [ ] Dependencies from trusted sources only
- [ ] No dependencies with known vulnerabilities
- [ ] License compatibility verified (MIT/Apache/BSD)
- [ ] Dependency size impact assessed

---

### 5. Accessibility (WCAG AA)

#### Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Focus order logical and predictable
- [ ] Focus indicators visible (outline/ring)
- [ ] Keyboard shortcuts documented
- [ ] No keyboard traps

#### Screen Reader Support
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] ARIA roles appropriate
- [ ] Alt text for images
- [ ] Form labels associated with inputs
- [ ] Error messages announced

#### Visual Accessibility
- [ ] Color contrast ≥4.5:1 (normal text)
- [ ] Color contrast ≥3:1 (large text)
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without loss
- [ ] No flickering/flashing content

#### Testing Evidence
- [ ] axe-core scan results included
- [ ] Manual keyboard test performed
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] High contrast mode verified
- [ ] Zoom tested (200% and 400%)

---

### 6. Performance

#### Bundle Size
- [ ] Production bundle <500KB gzipped
- [ ] New dependencies justified vs size impact
- [ ] Code splitting used where appropriate
- [ ] Tree shaking verified
- [ ] Lazy loading for heavy components

#### Load Performance
- [ ] Lighthouse Performance score ≥90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3.0s
- [ ] Cumulative Layout Shift <0.1
- [ ] Total Blocking Time <200ms
- [ ] Load time <3s on simulated 3G

#### Runtime Performance
- [ ] No unnecessary re-renders
- [ ] Expensive computations memoized
- [ ] Large lists virtualized
- [ ] Images optimized (WebP/AVIF)
- [ ] Debouncing/throttling for expensive operations

---

### 7. UI/UX Quality

#### Responsive Design
- [ ] Tested at 375px (mobile)
- [ ] Tested at 768px (tablet)
- [ ] Tested at 1920px (desktop)
- [ ] Tested at 2560px (ultra-wide)
- [ ] Touch targets ≥44px on mobile
- [ ] No horizontal scroll at any breakpoint
- [ ] Mobile-first approach followed

#### Theme Rendering
- [ ] Themes render correctly with all data
- [ ] Themes handle missing optional fields
- [ ] Print preview functional
- [ ] PDF export quality acceptable
- [ ] Theme switching instant
- [ ] No flash of unstyled content (FOUC)

#### User Feedback
- [ ] Loading states for async operations
- [ ] Success/error messages clear
- [ ] Validation messages contextual
- [ ] Progress indicators for multi-step flows
- [ ] Confirmation for destructive actions
- [ ] Help text where needed

#### Dark/Light Mode
- [ ] Both modes tested
- [ ] Smooth transitions between modes
- [ ] All themes support both modes
- [ ] System preference detected
- [ ] User override persists

---

### 8. Testing

#### Unit Tests
- [ ] Coverage ≥80% for new code
- [ ] Edge cases tested
- [ ] Error paths tested
- [ ] Mock dependencies appropriately
- [ ] Tests are deterministic (no flakiness)
- [ ] Tests are fast (<10s total runtime)

#### Integration Tests
- [ ] User flows tested end-to-end
- [ ] Import/export flows validated
- [ ] Theme rendering tested
- [ ] Validation workflow tested
- [ ] Error scenarios covered

#### Snapshot Tests
- [ ] UI components have snapshots
- [ ] Theme outputs have golden fixtures
- [ ] Breaking changes to snapshots justified
- [ ] Snapshots are reviewable

#### Test Quality
- [ ] Test names describe behavior
- [ ] Tests are independent
- [ ] No test interdependencies
- [ ] Cleanup after tests
- [ ] Meaningful assertions

---

### 9. Import/Export Compliance

#### Import Formats
If modifying importers:
- [ ] JSON Resume import functional
- [ ] CFRS import functional
- [ ] Markdown import functional
- [ ] Error handling comprehensive
- [ ] Preview before import shown
- [ ] File size limits enforced

#### Export Formats
If modifying exporters:
- [ ] CFRS export valid
- [ ] JSON Resume export valid
- [ ] HTML export self-contained
- [ ] Markdown export readable
- [ ] Print/PDF optimized
- [ ] Download triggers correctly

#### Data Integrity
- [ ] No data loss during conversion
- [ ] Round-trip import/export tested
- [ ] Character encoding correct (UTF-8)
- [ ] Special characters handled
- [ ] Whitespace preserved where needed

---

### 10. Theme Development

If adding/modifying themes:

#### Theme Structure
- [ ] Theme follows directory structure
- [ ] manifest.json present and valid
- [ ] Nunjucks template valid
- [ ] CSS-only styling
- [ ] No JavaScript in theme
- [ ] No remote resources

#### Theme Metadata
- [ ] Name, version, author present
- [ ] Description clear and accurate
- [ ] License specified (MIT preferred)
- [ ] Screenshot provided (PNG, 1200x900)
- [ ] Tags appropriate
- [ ] Category assigned

#### Theme Quality
- [ ] Renders all CFRS sections
- [ ] Handles missing optional fields
- [ ] ATS-safe if claimed
- [ ] Print-optimized
- [ ] Size <500KB total
- [ ] Passes CSP validation

#### Theme Testing
- [ ] Golden fixture snapshots created
- [ ] Tested with minimal data
- [ ] Tested with maximal data
- [ ] Print preview verified
- [ ] Cross-browser tested

---

## Review Process

### Step 1: Automated Checks
1. Wait for all CI checks to complete
2. Verify all checks are green
3. If any fail, request fixes before proceeding

### Step 2: Governance Review
1. Check MANIFEST.json updated if needed
2. Verify ADR present for architectural changes
3. Confirm .claude-rules.json updated if enforcement changed
4. Ensure CHANGELOG.md updated for user-facing changes

### Step 3: Code Review
1. Review for code quality and standards
2. Check test coverage and quality
3. Verify security and privacy compliance
4. Assess performance impact

### Step 4: Functional Review
1. Pull branch locally
2. Test primary use cases
3. Verify accessibility with keyboard
4. Test responsive breakpoints
5. Validate dark/light mode

### Step 5: Approval Decision
- **Approve**: If all criteria met
- **Request Changes**: If critical issues found
- **Comment**: If minor suggestions or questions

---

## Review Comments Best Practices

### Constructive Feedback
- **Be specific**: Point to exact lines/files
- **Be kind**: Assume positive intent
- **Be educational**: Explain the "why"
- **Be actionable**: Suggest concrete fixes

### Comment Prefixes
- **CRITICAL**: Must be fixed before merge
- **REQUIRED**: Must be addressed (fix or discussion)
- **SUGGESTION**: Optional improvement
- **QUESTION**: Seeking clarification
- **NIT**: Minor style/preference
- **PRAISE**: Recognition of good work

### Example Good Comments
```
CRITICAL: Line 42 - This introduces a SQL injection vulnerability.
Use parameterized queries instead. See: [link to docs]

REQUIRED: The ADR for this schema change is missing. Please create
ADR-015 following the template and link it in the PR description.

SUGGESTION: Consider extracting lines 100-150 into a separate
function for better testability.

QUESTION: What's the expected behavior when `data.work` is undefined?
Should we show a message or hide the section?

NIT: Prefer const over let here since it's never reassigned.

PRAISE: Excellent test coverage and clear test names!
```

---

## Common Rejection Reasons

### Automatic Rejection (No Review Needed)
- CI checks failing
- Merge conflicts present
- Work-in-progress without [WIP] tag
- No description provided

### Governance Violations
- Schema change without ADR
- MANIFEST.json not updated
- Breaking change without major version bump
- Bypassing required enforcement rules

### Quality Issues
- Test coverage <80%
- Accessibility violations
- Security vulnerabilities
- Performance regression >20%

### Non-Compliance
- Remote JS added to themes
- Server-side logic introduced
- User data transmitted externally
- License incompatibility

---

## Expedited Review Path

For urgent fixes, tag PR with `urgent` label and:
- [ ] Clearly state urgency reason
- [ ] Link to related incident/issue
- [ ] Ensure all automated checks pass
- [ ] Include before/after evidence
- [ ] Commit to follow-up refactor if needed

---

## Reviewer Responsibilities

### Required Actions
1. Review within 24 hours of PR creation
2. Provide clear, actionable feedback
3. Re-review within 24 hours of updates
4. Approve only when all criteria met
5. Document approval reasoning if complex

### Reviewer Checklist
- [ ] Understood the change purpose
- [ ] Verified all automated checks passed
- [ ] Reviewed for governance compliance
- [ ] Assessed code quality
- [ ] Checked test coverage
- [ ] Considered security implications
- [ ] Evaluated accessibility
- [ ] Tested locally if significant change
- [ ] Provided constructive feedback
- [ ] Approved or requested changes clearly

---

## Post-Merge Validation

### Within 1 Hour
- [ ] Verify deployment successful
- [ ] Check production build artifacts
- [ ] Monitor for errors in logs (if applicable)

### Within 24 Hours
- [ ] Verify Lighthouse scores maintained
- [ ] Check bundle size impact
- [ ] Review user feedback channels

### Within 1 Week
- [ ] Assess adoption of new feature
- [ ] Monitor for regression reports
- [ ] Update documentation if gaps found

---

## Continuous Improvement

### Review Metrics
Track and improve:
- Time to first review
- Time to merge after approval
- Number of review cycles
- Defect escape rate

### Process Updates
- Review criteria updated quarterly
- Lessons learned documented
- Common issues added to checklist
- Automation opportunities identified

---

**Last Updated**: 2025-10-03
**Maintained By**: REVIEWER Agent
**Next Review**: 2025-11-03
