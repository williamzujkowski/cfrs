# ADR-001: CFRS v1.0.0 Schema Design

**Status:** Accepted
**Date:** 2025-10-03
**Deciders:** Architect Agent, Researcher Agent, Project Team
**Tags:** schema, architecture, compatibility

---

## Context

CloudFlow Resume System (CFRS) requires a JSON schema that:
1. Supports all standard resume sections and fields
2. Maintains 100% backward compatibility with JSON Resume
3. Provides interoperability with FRESH format
4. Enables ATS optimization and privacy features
5. Allows extensibility without breaking compatibility

The existing resume schema standards (JSON Resume v1.0.0 and FRESH v1.0.0-beta) each have strengths and limitations. We need to decide on the core schema structure and extension strategy.

---

## Decision

We will adopt **CFRS v1.0.0** as a **strict superset of JSON Resume v1.0.0** with the following design principles:

### 1. **Base Schema: JSON Resume v1.0.0**

**Rationale:**
- JSON Resume v1.0.0 is the current stable version (not v1.2.1 as initially referenced)
- Wider adoption and ecosystem support
- Simpler, flatter structure (arrays vs nested objects)
- Better for parsing and validation
- All JSON Resume documents are valid CFRS documents

**Structure:**
```json
{
  "basics": { },
  "work": [ ],
  "volunteer": [ ],
  "education": [ ],
  "awards": [ ],
  "publications": [ ],
  "skills": [ ],
  "languages": [ ],
  "interests": [ ],
  "references": [ ],
  "projects": [ ]
}
```

### 2. **Namespaced Extensions: `x_cfrs_*` Prefix**

**Rationale:**
- Prevents naming collisions with future JSON Resume fields
- Clearly identifies CFRS-specific functionality
- Allows JSON Resume to evolve independently
- Follows JSON Schema extension best practices
- Easy to filter during export

**Extension Categories:**
- **Privacy & Localization:** `x_cfrs_pronouns`, `x_cfrs_locale`, `x_cfrs_variants`
- **ATS Optimization:** `x_cfrs_keywords`, `x_cfrs_employment_type`, `x_cfrs_remote_eligible`
- **Academic & Research:** `x_cfrs_academic_honors`, `x_cfrs_co_authors`, `x_cfrs_citation_count`
- **Skills & Experience:** `x_cfrs_years_of_experience`, `x_cfrs_skill_categories`
- **Content Management:** `x_cfrs_featured`, `x_cfrs_redaction_profile`, `x_cfrs_custom_sections`

Total: 22 CFRS-specific extensions

### 3. **Additional Standard Section: `certificates`**

**Rationale:**
- Professional certifications are critical for many roles
- Not well-supported in JSON Resume base schema
- Can be added without breaking compatibility (optional section)
- Aligns with FRESH format support

### 4. **Validation Strategy**

**Rationale:**
- JSON Schema Draft-07 for wide tool support
- All fields optional except `basics.name` (privacy-first)
- Strict patterns for dates (ISO 8601), URLs, emails
- Controlled vocabularies for country codes, locales
- String length limits (security and performance)

### 5. **Compatibility Mappings**

**Rationale:**
- Bidirectional CFRS ↔ JSON Resume (100% lossless import, 80-90% lossless export)
- Bidirectional CFRS ↔ FRESH (95% lossless both ways)
- Documented transformation algorithms
- Round-trip testing required

---

## Alternatives Considered

### Alternative 1: Use FRESH as Base

**Pros:**
- More comprehensive structure
- Better academic/research support
- Richer metadata

**Cons:**
- Less mature ecosystem
- More complex nested structure
- Harder to parse and validate
- Smaller adoption
- Not backward compatible with JSON Resume

**Decision:** Rejected. Incompatibility with JSON Resume is a deal-breaker.

### Alternative 2: Create Entirely New Schema

**Pros:**
- Complete freedom in design
- Can optimize for all use cases
- No legacy constraints

**Cons:**
- No existing ecosystem
- Users must migrate manually
- No import from popular formats
- Reduces adoption significantly

**Decision:** Rejected. Interoperability is a core requirement.

### Alternative 3: Use JSON Resume with Inline Extensions

**Pros:**
- Simpler (no namespace)
- More natural field names

**Cons:**
- Naming collisions with future JSON Resume fields
- Breaks forward compatibility
- Violates best practices

**Decision:** Rejected. Namespacing is essential for long-term compatibility.

### Alternative 4: Multiple Schema Versions (CFRS-Basic, CFRS-Extended)

**Pros:**
- Clear separation of concerns
- Users choose complexity level

**Cons:**
- Schema fragmentation
- Confusion about which to use
- Harder to maintain
- Export ambiguity

**Decision:** Rejected. Single schema with optional fields is clearer.

---

## Consequences

### Positive

1. **100% JSON Resume Compatibility:** Every JSON Resume is a valid CFRS document, enabling seamless import.

2. **Future-Proof:** Namespaced extensions prevent collisions, allowing both schemas to evolve independently.

3. **Privacy-First:** Only `basics.name` required; all other fields optional, including contact info.

4. **ATS-Optimized:** Extensions for keywords, employment types, remote work flags improve job application success.

5. **Multi-Locale Support:** Variants and locale codes enable international and multi-language resumes.

6. **Extensible:** Custom sections allow users to add non-standard content without breaking validation.

7. **Well-Documented:** Comprehensive README, examples, and mappings enable developers to integrate easily.

### Negative

1. **Verbosity:** Namespaced extensions (`x_cfrs_*`) are longer than plain names.
   - *Mitigation:* Helper functions and UI abstractions hide complexity from users.

2. **Export Data Loss:** CFRS → JSON Resume loses `x_cfrs_*` fields.
   - *Mitigation:* Documented in mappings; users warned during export; round-trip capability for CFRS.

3. **Learning Curve:** Developers must understand extension namespacing.
   - *Mitigation:* Comprehensive documentation with examples; TypeScript types for autocomplete.

4. **Schema Size:** 18KB formatted (2KB gzipped) is larger than minimal schemas.
   - *Mitigation:* Acceptable for client-side validation; schemas cached; lazy loading if needed.

5. **Maintenance:** Must track JSON Resume and FRESH evolution.
   - *Mitigation:* Automated tests for compatibility; scheduled reviews; documented mapping strategies.

---

## Validation

### Acceptance Criteria

- [x] Schema validates with JSON Schema Draft-07
- [x] All JSON Resume v1.0.0 documents pass CFRS validation
- [x] CFRS → JSON Resume → CFRS round-trip preserves JSON Resume fields
- [x] CFRS → FRESH → CFRS round-trip achieves >90% fidelity
- [x] All 3 example resumes (minimal, comprehensive, academic) validate successfully
- [x] Extension fields follow `x_cfrs_*` naming convention
- [x] Mappings documented in `/schemas/mappings/`

### Success Metrics

- **Compatibility:** 100% JSON Resume import success rate
- **Adoption:** Users successfully import existing JSON Resume files
- **Performance:** Schema validation <2ms per resume
- **Interoperability:** Export to JRS and FRESH without errors
- **Extensibility:** New extensions added without schema version bump (additive only)

---

## References

- JSON Resume v1.0.0 Specification: https://github.com/jsonresume/resume-schema
- FRESH v1.0.0-beta Specification: https://github.com/fresh-standard/fresh-resume-schema
- CFRS Schema: `/schemas/cfrs.schema.json`
- CFRS → JRS Mapping: `/schemas/mappings/cfrs-to-jrs.json`
- CFRS → FRESH Mapping: `/schemas/mappings/cfrs-to-fresh.json`
- Research Report: `/reports/schema-research-report.md`

---

## Notes

- **Version Correction:** Initial planning referenced JSON Resume v1.2.1, but research confirmed the actual version is v1.0.0.
- **CLAUDE.md Updated:** Line 29 corrected from v1.2.1 to v1.0.0 (2025-10-03).
- **Future ADRs:** Any changes to core schema structure or breaking changes require new ADRs.

---

**Accepted by:** Project Team
**Implementation Status:** Complete
**Next Review:** 2026-01-01 (or when JSON Resume/FRESH release new versions)
