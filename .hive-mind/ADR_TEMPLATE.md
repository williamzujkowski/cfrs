---
STATUS: TEMPLATE
VERSION: 1.0.0
CREATED: 2025-10-03
PURPOSE: Standard template for Architecture Decision Records
---

# ADR-{NUMBER}: {Title in Title Case}

**Status**: {Proposed | Accepted | Deprecated | Superseded}
**Date**: {ISO 8601 format from time.gov, e.g., 2025-10-03}
**Decision Makers**: {Names/roles of key stakeholders}
**Supersedes**: {ADR-XXX (if applicable)}
**Superseded By**: {ADR-XXX (if applicable)}

---

## Context

### Background

{Describe the situation, problem, or opportunity that requires a decision. Include:}

- Current state of the system/feature
- Business or technical drivers
- Constraints or requirements
- Stakeholder concerns

### Problem Statement

{Clearly articulate the specific problem or question that needs resolution.}

### Forces

{List the factors influencing the decision:}

- Technical considerations
- Business requirements
- Time/resource constraints
- User experience impacts
- Security/privacy requirements
- Maintainability concerns
- Compliance requirements

---

## Decision

### Chosen Approach

{Clearly state the decision made. Be specific and unambiguous.}

### Rationale

{Explain why this decision was made:}

- How it addresses the problem
- Why it's better than alternatives
- What trade-offs were accepted
- How it aligns with project principles

---

## Alternatives Considered

### Alternative 1: {Name}

**Description**: {Brief overview}
**Pros**:

- {Advantage 1}
- {Advantage 2}

**Cons**:

- {Disadvantage 1}
- {Disadvantage 2}

**Rejected Because**: {Specific reason}

### Alternative 2: {Name}

**Description**: {Brief overview}
**Pros**:

- {Advantage 1}
- {Advantage 2}

**Cons**:

- {Disadvantage 1}
- {Disadvantage 2}

**Rejected Because**: {Specific reason}

---

## Consequences

### Positive

- {Benefit 1}
- {Benefit 2}
- {Benefit 3}

### Negative

- {Cost/limitation 1}
- {Cost/limitation 2}

### Neutral

- {Change that is neither good nor bad}

### Risks

- {Risk 1 and mitigation strategy}
- {Risk 2 and mitigation strategy}

---

## Implementation

### Required Changes

- {Component/file to modify}
- {New dependencies to add}
- {Configuration changes}

### Migration Path

{If changing existing functionality:}

- Backward compatibility approach
- Data migration requirements
- Deprecation timeline

### Validation Criteria

{How to verify the decision was implemented correctly:}

- Test requirements
- Performance benchmarks
- Compliance checks

---

## References

### Related Documents

- {Link to related ADRs}
- {Link to design docs}
- {Link to external specifications}

### External Resources

- {Research papers}
- {Blog posts}
- {Library documentation}
- {Standards/RFCs}

### Discussion Threads

- {GitHub issue #XXX}
- {Meeting notes link}
- {Email thread summary}

---

## Notes

### Open Questions

- {Question 1}
- {Question 2}

### Future Considerations

- {Potential future changes}
- {Areas to revisit}

### Change Log

| Date         | Author | Change                |
| ------------ | ------ | --------------------- |
| {YYYY-MM-DD} | {Name} | Initial draft         |
| {YYYY-MM-DD} | {Name} | Accepted after review |

---

## Template Usage Guidelines

### Numbering

- Use sequential numbering: ADR-001, ADR-002, etc.
- Pad with leading zeros (3 digits)
- Never reuse numbers

### Status Values

- **Proposed**: Draft/under discussion
- **Accepted**: Approved and implemented
- **Deprecated**: No longer recommended but not replaced
- **Superseded**: Replaced by a newer ADR

### File Naming

- Format: `ADR-{NUMBER}-{kebab-case-title}.md`
- Example: `ADR-001-schema-design.md`
- Location: `/docs/` directory

### Required Sections

All sections above marked with {placeholders} are mandatory except:

- Supersedes/Superseded By (only if applicable)
- Open Questions (only if questions remain)

### Writing Tips

1. **Be specific**: Avoid vague language
2. **Be timely**: Record decisions when fresh
3. **Be honest**: Document real trade-offs
4. **Be concise**: Respect reader's time
5. **Be searchable**: Use keywords and tags

### Review Process

1. Create ADR in Proposed status
2. Share with stakeholders for review
3. Incorporate feedback
4. Mark as Accepted when consensus reached
5. Update MANIFEST.json to include ADR
6. Reference ADR in related PRs

---

**Template Version**: 1.0.0
**Last Updated**: 2025-10-03
**Maintained By**: REVIEWER Agent
