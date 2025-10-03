# Schema Compatibility Quick Reference

**CloudFlow Resume System (CFRS)**
**Last Updated:** 2025-10-03

---

## Quick Facts

### JSON Resume v1.0.0

- **Status:** Stable (current version, not v1.2.1)
- **Sections:** 12 main sections
- **License:** MIT
- **Repository:** github.com/jsonresume/resume-schema
- **Target:** Generic, worldwide audience

### FRESH v1.0.0-beta

- **Status:** Beta
- **Sections:** 21+ sections
- **License:** MIT
- **Repository:** github.com/fresh-standard/fresh-resume-schema
- **Target:** Technical candidates, universal container

---

## Field Mapping Cheat Sheet

### Core Personal Info

| Field     | JSON Resume      | FRESH             | CFRS Strategy                |
| --------- | ---------------- | ----------------- | ---------------------------- |
| Name      | `basics.name`    | `name`            | Use `basics.name` (JRS base) |
| Job Title | `basics.label`   | `info.label`      | Use `basics.label`           |
| Summary   | `basics.summary` | `info.brief`      | Use `basics.summary`         |
| Photo     | `basics.image`   | `info.image`      | Use `basics.image`           |
| Email     | `basics.email`   | `contact.email`   | Use `basics.email`           |
| Phone     | `basics.phone`   | `contact.phone`   | Use `basics.phone`           |
| Website   | `basics.url`     | `contact.website` | Use `basics.url`             |

### Work Experience

| Field    | JSON Resume          | FRESH                   | Conversion Note         |
| -------- | -------------------- | ----------------------- | ----------------------- |
| Section  | `work[]`             | `employment.history[]`  | CFRS: `work[]`          |
| Company  | `work[].name`        | `employment[].employer` | Map: name ↔ employer   |
| Position | `work[].position`    | `employment[].position` | Direct                  |
| Start    | `work[].startDate`   | `employment[].start`    | Map: startDate ↔ start |
| End      | `work[].endDate`     | `employment[].end`      | Map: endDate ↔ end     |
| Current  | Empty/null `endDate` | `end: "current"`        | CFRS: null = current    |

### Education

| Field   | JSON Resume   | FRESH                 | Conversion Note            |
| ------- | ------------- | --------------------- | -------------------------- |
| Section | `education[]` | `education.history[]` | CFRS: `education[]`        |
| School  | `institution` | `institution`         | Direct                     |
| Degree  | `studyType`   | `studyType`           | Direct                     |
| Field   | `area`        | `area`                | Direct                     |
| GPA     | `score`       | `grade`               | Map: score ↔ grade        |
| Courses | `courses[]`   | `curriculum[]`        | Map: courses ↔ curriculum |

### Skills

| Field   | JSON Resume           | FRESH                    | Conversion Note          |
| ------- | --------------------- | ------------------------ | ------------------------ |
| Section | `skills[]`            | `skills.sets[]`          | JRS: flat; FRESH: nested |
| Name    | `skills[].name`       | `skills.sets[].name`     | FRESH = category name    |
| Level   | `skills[].level`      | `skills.sets[].level`    | Direct                   |
| Items   | `skills[].keywords[]` | `skills.sets[].skills[]` | Map: keywords ↔ skills  |

---

## ATS Requirements Checklist

### File Format

- ✅ **Best:** .docx (Word)
- ✅ **Good:** .pdf (non-image)
- ❌ **Avoid:** .pdf with images/graphics

### Layout

- ✅ Single column only
- ✅ Contact info in body (NOT header/footer)
- ✅ Reverse chronological order
- ❌ NO multi-column layouts
- ❌ NO tables or text boxes
- ❌ NO images or graphics

### Typography

- ✅ **Safe fonts:** Arial, Calibri, Garamond, Georgia, Helvetica
- ✅ **Body text:** 11-12pt
- ✅ **Headers:** 14-16pt
- ❌ NO decorative or script fonts

### Section Headings (Use these exact names!)

| Section   | Standard Heading                              | ❌ Avoid              |
| --------- | --------------------------------------------- | --------------------- |
| Contact   | "Contact Information"                         | "Get In Touch"        |
| Summary   | "Professional Summary"                        | "About Me"            |
| Work      | "Work Experience" / "Professional Experience" | "My Journey"          |
| Education | "Education"                                   | "Academic Background" |
| Skills    | "Skills" / "Technical Skills"                 | "Competencies"        |
| Projects  | "Projects"                                    | "Portfolio"           |
| Volunteer | "Volunteer Experience"                        | "Community Service"   |
| Awards    | "Awards" / "Recognition"                      | "Achievements"        |

### Date Format

- ✅ **Best:** "Month YYYY" (e.g., "January 2023")
- ✅ **Good:** "MM/YYYY" or "YYYY-MM"
- ✅ **Consistent** formatting across all dates

### Content

- ✅ Start bullets with action verbs
- ✅ Quantify achievements (numbers, %)
- ✅ Include keywords from job description
- ✅ Spell out abbreviations (degree types, companies)

---

## CFRS Extension Namespace

**All custom fields must use `x_cfrs_` prefix:**

```json
{
  "x_cfrs_custom_field": "value",
  "x_cfrs_privacy": {
    "level": "public|private|redacted"
  },
  "x_cfrs_keywords": ["tech1", "tech2"],
  "x_cfrs_current": true,
  "x_cfrs_ats_optimized": true
}
```

**Rules:**

1. Never override standard fields
2. Document all custom fields
3. Strip extensions when exporting to JRS/FRESH (unless needed)
4. Use for CFRS-specific features only

---

## Privacy Redaction Presets

### Public Web

```
✅ Name, Location (city only)
❌ Phone → [REDACTED]
❌ Email → [email protected]
❌ Full Address
❌ Reference contacts
```

### Networking

```
✅ All contact info
❌ Full street address
❌ Postal code
```

### Recruiter (No Redaction)

```
✅ All information visible
```

### Maximum Privacy

```
✅ Initials only (J.D.)
✅ City, State only
❌ All contact details → [REDACTED]
❌ References removed
```

---

## Conversion Data Loss Matrix

### JSON Resume → CFRS

**Data Loss:** NONE (0%)

- All fields preserved
- CFRS is superset

### FRESH → CFRS

**Data Loss:** MINIMAL (<5%)

- All standard fields preserved
- FRESH-specific sections stored in extensions
- Some structure flattening (nested → flat)

### CFRS → JSON Resume

**Data Loss:** MODERATE (10-20%)

- FRESH-specific sections dropped: `disposition`, `reading`, `speaking`, `governance`, `samples`, `testimonials`, `extracurricular`, `affiliation`
- Extension fields dropped: `x_cfrs_*` (unless `edge: true` for v1.0.0-candidate)

### CFRS → FRESH

**Data Loss:** MINIMAL (<5%)

- All JRS-compatible fields map cleanly
- Some extension data may be dropped

---

## ATS Score Calculation

```
Base Score: 100 points

Critical Issues (-10 points each):
❌ Contact info in header/footer
❌ Multi-column layout
❌ Tables used
❌ Non-standard section headings

Major Issues (-5 points each):
❌ Inconsistent date formatting
❌ Non-standard fonts
❌ Images/graphics included

Minor Issues (-2 points each):
❌ Low keyword density (<70%)
❌ No action verbs in bullets
❌ No quantified achievements

Scoring:
90-100: Excellent ATS compatibility
70-89: Good, minor improvements needed
50-69: Fair, significant improvements recommended
0-49: Poor, major ATS issues detected
```

---

## Key Implementation Files

### Schema Files

- `/schemas/cfrs.schema.json` - Core CFRS schema
- `/schemas/mappings/jrs-to-cfrs.json` - JSON Resume mappings
- `/schemas/mappings/fresh-to-cfrs.json` - FRESH mappings
- `/schemas/mappings/cfrs-to-jrs.json` - Export to JRS rules
- `/schemas/mappings/cfrs-to-fresh.json` - Export to FRESH rules

### Converters

- `/apps/web/src/importers/jrs.ts` - JSON Resume import
- `/apps/web/src/importers/fresh.ts` - FRESH import
- `/apps/web/src/exporters/jrs.ts` - JSON Resume export
- `/apps/web/src/exporters/fresh.ts` - FRESH export

### Themes

- `/themes/ats-safe-professional/` - ATS-optimized theme
- `/themes/ats-safe-modern/` - ATS + modern design
- `/themes/ats-safe-minimal/` - ATS + minimalist

### Validation

- `/apps/web/src/validators/schema-validator.ts` - Schema validation
- `/apps/web/src/validators/ats-validator.ts` - ATS compliance
- `/apps/web/src/validators/privacy-validator.ts` - Privacy checks

---

## Action Items Priority

### P0 (Critical - Week 1)

- [ ] Create CFRS schema v1.0.0 at `/schemas/cfrs.schema.json`
- [ ] Document field mappings in `/schemas/mappings/`
- [ ] Implement JRS import/export converters
- [ ] Set up schema validation tests

### P1 (High - Week 2-3)

- [ ] Implement FRESH import/export converters
- [ ] Create ATS-safe theme templates
- [ ] Build ATS compliance validator
- [ ] Implement privacy redaction system

### P2 (Medium - Week 4+)

- [ ] Add keyword analyzer
- [ ] Build completeness scorer
- [ ] Create round-trip conversion tests
- [ ] Document API for converters

### P3 (Low - Future)

- [ ] LinkedIn JSON importer
- [ ] Markdown parser
- [ ] Multi-language support
- [ ] AI content suggestions

---

## Testing Strategy

### Unit Tests

```javascript
// Test field mapping
test('JRS to CFRS: basics.summary → basics.summary', () => {
  const jrs = { basics: { summary: 'Test summary' } };
  const cfrs = importFromJRS(jrs);
  expect(cfrs.basics.summary).toBe('Test summary');
});

// Test extension preservation
test('CFRS extensions preserved in round-trip', () => {
  const original = { x_cfrs_custom: 'value' };
  const exported = exportToJRS(original);
  const reimported = importFromJRS(exported);
  // Extensions may be lost in JRS export
  expect(reimported.x_cfrs_custom).toBeUndefined();
});
```

### Integration Tests

```javascript
// Round-trip conversion
test('JRS → CFRS → JRS preserves all data', () => {
  const original = loadFixture('jrs-sample.json');
  const cfrs = importFromJRS(original);
  const exported = exportToJRS(cfrs);
  expect(exported).toEqual(original);
});

// Cross-format conversion
test('FRESH → CFRS → JRS maps correctly', () => {
  const fresh = loadFixture('fresh-sample.json');
  const cfrs = importFromFRESH(fresh);
  const jrs = exportToJRS(cfrs);

  // Verify key mappings
  expect(jrs.basics.summary).toBe(fresh.info.brief);
  expect(jrs.work[0].name).toBe(fresh.employment.history[0].employer);
});
```

### ATS Validation Tests

```javascript
test('ATS score calculation', () => {
  const resume = loadFixture('ats-compliant.json');
  const score = calculateATSScore(resume, atsTheme);
  expect(score).toBeGreaterThanOrEqual(90);
});

test('Detects contact info in header', () => {
  const resume = {
    /* contact in header */
  };
  const validation = validateATSCompliance(resume);
  expect(validation.issues).toContain('Contact information in header/footer');
});
```

---

## Resources

### Official Documentation

- **JSON Resume:** https://jsonresume.org/schema
- **FRESH Schema:** https://github.com/fresh-standard/fresh-resume-schema
- **FRESH-JRS Converter:** https://github.com/fresh-standard/fresh-jrs-converter

### ATS Resources

- **TopResume ATS Guide:** https://topresume.com/career-advice/what-is-an-ats-resume
- **Jobscan ATS Tips:** https://www.jobscan.co/blog/ats-formatting-mistakes/
- **ATS Resume Checker:** https://www.myperfectresume.com/resume/ats-resume-checker

### Tools

- **HackMyResume:** https://github.com/hacksalot/HackMyResume
- **JSON Schema Validator:** https://www.jsonschemavalidator.net/

---

**For detailed information, see:** `/reports/schema-research-report.md`
