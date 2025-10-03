# CFRS (CloudFlow Resume Schema) v1.0.0

**The authoritative JSON Schema specification for structured resume data in the CloudFlow Resume project.**

---

## Overview

The CloudFlow Resume Schema (CFRS) is a comprehensive, privacy-focused JSON Schema for representing professional resumes and CVs. It is designed with the following principles:

- **Backward Compatible**: 100% compatible with JSON Resume v1.2.1
- **Extensible**: Uses namespaced `x_cfrs_*` extensions for additional features
- **Privacy-First**: Supports redaction profiles and PII protection
- **ATS-Optimized**: Includes fields for ATS keyword targeting
- **International**: Multi-locale support with CEFR language levels
- **Interoperable**: Documented mappings to JSON Resume and FRESH

---

## Schema Files

- **`cfrs.schema.json`** - Main JSON Schema definition (draft-07)
- **`mappings/cfrs-to-jrs.json`** - Mapping specification for JSON Resume compatibility
- **`mappings/cfrs-to-fresh.json`** - Mapping specification for FRESH Resume compatibility
- **`examples/`** - Validated example resumes demonstrating schema usage

---

## Quick Start

### Validate a Resume

```javascript
import Ajv from 'ajv';
import cfrsSchema from './cfrs.schema.json';
import myResume from './my-resume.json';

const ajv = new Ajv();
const validate = ajv.compile(cfrsSchema);

if (validate(myResume)) {
  console.log('Resume is valid!');
} else {
  console.error('Validation errors:', validate.errors);
}
```

### Minimal Valid Resume

```json
{
  "$schema": "https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json",
  "basics": {
    "name": "Jane Doe"
  }
}
```

---

## Core Schema Structure

### Required Fields

- `$schema` - Schema version identifier
- `basics.name` - Person's full name

### Standard Sections

All sections are optional except `basics`:

- **basics** - Personal information and contact details
- **work** - Employment history
- **education** - Educational background
- **skills** - Professional competencies
- **projects** - Portfolio items and notable work
- **volunteer** - Community involvement
- **awards** - Recognition and honors
- **publications** - Published works
- **certificates** - Professional certifications
- **languages** - Language proficiencies
- **interests** - Professional and personal interests
- **references** - Professional references
- **meta** - Document metadata

---

## CFRS Extensions

All CFRS-specific features use the `x_cfrs_*` namespace prefix:

### Basics Extensions

- `x_cfrs_pronouns` - Preferred pronouns (e.g., "she/her", "they/them")
- `x_cfrs_locale` - Primary locale code (e.g., "en-US", "fr-FR")

### Work Experience Extensions

- `x_cfrs_employment_type` - Employment classification (full-time, contract, etc.)
- `x_cfrs_remote` - Boolean indicating remote work
- `x_cfrs_keywords` - ATS-targeted keywords for this position

### Education Extensions

- `x_cfrs_honors` - Academic honors and distinctions

### Skills Extensions

- `x_cfrs_years` - Years of experience with this skill
- `x_cfrs_category` - Skill grouping (technical, soft, language, etc.)

### Projects Extensions

- `x_cfrs_featured` - Boolean to highlight important projects

### Publications Extensions

- `x_cfrs_authors` - Co-author list
- `x_cfrs_citation_count` - Citation metrics

### Languages Extensions

- `x_cfrs_cefr_level` - Common European Framework level (A1-C2)

### References Extensions

- `x_cfrs_relationship` - Reference's relationship to candidate
- `x_cfrs_email` - Reference email address
- `x_cfrs_phone` - Reference phone number

### Certificates Extensions

- `x_cfrs_expiry_date` - Certification expiration date
- `x_cfrs_credential_id` - License/credential number

### Metadata Extensions

- `x_cfrs_theme` - Preferred theme identifier
- `x_cfrs_ats_optimized` - Boolean indicating ATS optimization
- `x_cfrs_redaction_profile` - Active redaction level (none, partial, full, custom)
- `x_cfrs_locale_variants` - Available locale versions of resume

### Custom Sections

- `x_cfrs_custom_sections` - Array of arbitrary sections for non-standard content

---

## JSON Resume Compatibility

CFRS is a **superset** of JSON Resume v1.2.1:

✅ **All JSON Resume fields are valid CFRS**
✅ **JSON Resume → CFRS conversion is lossless**
⚠️ **CFRS → JSON Resume loses extension data**

### Converting CFRS to JSON Resume

```javascript
import { convertCfrsToJrs } from './converters/cfrs-to-jrs';

const cfrsResume = {
  /* ... */
};
const jrsResume = convertCfrsToJrs(cfrsResume, {
  preserveExtensions: true, // Store CFRS data in $.x_cfrs for round-trip
});
```

### Converting JSON Resume to CFRS

```javascript
import { convertJrsToCfrs } from './converters/jrs-to-cfrs';

const jrsResume = {
  /* ... */
};
const cfrsResume = convertJrsToCfrs(jrsResume);
```

See **`mappings/cfrs-to-jrs.json`** for complete mapping specification.

---

## FRESH Compatibility

CFRS can be converted to/from FRESH Resume Schema with some semantic mapping:

⚠️ **Different structure** - FRESH uses nested objects (e.g., `employment.history`)
⚠️ **Different terminology** - FRESH uses different field names (e.g., `employer` vs `name`)
⚠️ **Partial coverage** - FRESH has unique sections (testimonials, governance)

### Key Differences

| Concept      | CFRS               | FRESH                            |
| ------------ | ------------------ | -------------------------------- |
| Company name | `work[*].name`     | `employment.history[*].employer` |
| Job title    | `work[*].position` | `employment.history[*].position` |
| Awards       | `awards[*]`        | `recognition[*]`                 |
| Publications | `publications[*]`  | `writing[*]`                     |
| Volunteer    | `volunteer[*]`     | `service.history[*]`             |

See **`mappings/cfrs-to-fresh.json`** for complete mapping specification.

---

## Data Validation Rules

### Date Formats

All dates must use ISO 8601 format:

- Full date: `YYYY-MM-DD` (e.g., "2023-06-15")
- Month precision: `YYYY-MM` (e.g., "2023-06")

### URLs

All URL fields must be valid URIs:

- Must include protocol (https://, http://)
- Must be properly encoded

### Email Addresses

Email fields must match RFC 5322 format.

### Country Codes

Location country codes must be ISO 3166-1 alpha-2 (e.g., "US", "GB", "FR").

### Language Codes

Locale codes must follow BCP 47 (e.g., "en-US", "fr-CA", "zh-CN").

---

## Example Resumes

### Minimal Example

See: **`examples/minimal-example.json`**

- Basic contact information
- Work history with 2 positions
- Education and skills
- Demonstrates core schema usage

### Comprehensive Example

See: **`examples/comprehensive-example.json`**

- Complete professional profile
- Multiple employment positions
- Advanced education (Ph.D. + B.S.)
- Publications, awards, certifications
- Demonstrates all CFRS extensions
- Custom sections (patents, speaking)

### Academic CV Example

See: **`examples/academic-example.json`**

- Academic career path
- Research-focused content
- Publications with citations
- Grant funding information
- Teaching and service record
- Demonstrates academic use case

---

## Schema Validation

### Using AJV (Node.js)

```javascript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
});
addFormats(ajv);

const validate = ajv.compile(cfrsSchema);

if (!validate(resume)) {
  console.error('Validation failed:');
  validate.errors.forEach((error) => {
    console.error(`  ${error.instancePath}: ${error.message}`);
  });
}
```

### Common Validation Errors

**Missing required fields:**

```
Error: must have required property 'name' at $.basics
```

**Invalid date format:**

```
Error: must match pattern "^\\d{4}(-\\d{2}(-\\d{2})?)?$" at $.work[0].startDate
```

**Invalid URL:**

```
Error: must match format "uri" at $.basics.url
```

---

## Best Practices

### 1. Always Include Schema Reference

```json
{
  "$schema": "https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json",
  "basics": { ... }
}
```

### 2. Use Semantic Dates

Prefer `YYYY-MM-DD` when exact date is known, `YYYY-MM` for month precision:

```json
{
  "startDate": "2020-03-15", // Exact start date known
  "endDate": "2023-06" // Left in June, exact day unknown
}
```

### 3. Omit End Date for Current Positions

```json
{
  "startDate": "2021-01",
  "endDate": null // or omit entirely
}
```

### 4. Use Extensions Sparingly

Only use `x_cfrs_*` extensions when needed:

```json
{
  "x_cfrs_remote": true, // Adds value for remote positions
  "x_cfrs_keywords": ["React", "TypeScript"] // Useful for ATS optimization
}
```

### 5. Validate Before Export

Always validate your resume before exporting or publishing:

```javascript
if (!validate(resume)) {
  throw new Error('Resume validation failed');
}
```

---

## Migration Guide

### From JSON Resume

No migration needed! JSON Resume is 100% compatible:

```javascript
// Your existing JSON Resume
const jrsResume = {
  /* ... */
};

// Just add the CFRS schema reference
jrsResume.$schema = 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json';

// Optionally add CFRS extensions
jrsResume.work[0].x_cfrs_remote = true;
```

### From FRESH

Use the conversion utility:

```javascript
import { convertFreshToCfrs } from './converters/fresh-to-cfrs';

const freshResume = {
  /* ... */
};
const cfrsResume = convertFreshToCfrs(freshResume);
```

Key transformations:

- `employment.history` → `work`
- `recognition` → `awards`
- `writing` → `publications`
- `service.history` → `volunteer`

---

## Schema Governance

### Version History

- **v1.0.0** (2025-10-03) - Initial release
  - JSON Resume v1.2.1 compatibility
  - CFRS extensions defined
  - Mapping specifications for JRS and FRESH

### Versioning Policy

CFRS follows Semantic Versioning:

- **Major version** - Breaking changes to core schema
- **Minor version** - New optional fields or extensions
- **Patch version** - Bug fixes, documentation updates

### Change Process

All schema changes require:

1. Architecture Decision Record (ADR)
2. Update to this README
3. Update to CLAUDE.md if governance changes
4. Validation against existing test cases
5. Migration guide for breaking changes

---

## Implementation Roadmap

### Phase 0 (Current)

✅ Schema definition
✅ Mapping specifications
✅ Example resumes
✅ Documentation

### Phase 1 (MVP)

- [ ] JavaScript/TypeScript validators
- [ ] Conversion utilities (JRS ↔ CFRS, FRESH ↔ CFRS)
- [ ] CLI validation tool
- [ ] Browser-based validator

### Phase 2 (Enhancements)

- [ ] Redaction engine
- [ ] ATS keyword analyzer
- [ ] Multi-locale variant manager
- [ ] Schema documentation generator

---

## Contributing

Schema changes require ADRs and must maintain backward compatibility with JSON Resume.

See `/docs/ENFORCEMENT.md` for contribution guidelines.

---

## License

MIT License - See LICENSE file for details

---

## Resources

- **JSON Resume**: https://jsonresume.org/schema/
- **FRESH Resume**: https://github.com/fresh-standard/fresh-resume-schema
- **JSON Schema**: https://json-schema.org/
- **ISO 8601 Dates**: https://en.wikipedia.org/wiki/ISO_8601
- **BCP 47 Locales**: https://tools.ietf.org/html/bcp47

---

**Status:** ✅ Schema v1.0.0 Stable
**Last Updated:** 2025-10-03
**Maintainer:** CloudFlow Resume Project
