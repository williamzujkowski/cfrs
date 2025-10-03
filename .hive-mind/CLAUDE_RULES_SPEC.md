---
STATUS: SPECIFICATION
VERSION: 1.0.0
CREATED: 2025-10-03
PURPOSE: .claude-rules.json structure and enforcement specification
---

# .claude-rules.json Specification

## Overview

The `.claude-rules.json` file defines **mandatory enforcement rules** for the CloudFlow Resume project. These rules are automatically enforced via pre-commit hooks and CI/CD pipelines.

**Location**: `/.claude-rules.json` (repository root)

---

## Core Principles

1. **Automation First**: Rules should be enforceable by tools
2. **Fail Fast**: Violations block commits/PRs immediately
3. **Clear Messages**: Violations show actionable error messages
4. **No Exceptions**: Rules apply to all contributors equally
5. **Version Controlled**: Rules tracked in git like code

---

## Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://cloudflow-resume.dev/schemas/claude-rules.schema.json",
  "title": "Claude Rules Enforcement Configuration",
  "type": "object",
  "required": [
    "version",
    "lastUpdated",
    "schema",
    "mappings",
    "themes",
    "governance",
    "security",
    "quality"
  ],
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "lastUpdated": {
      "type": "string",
      "format": "date-time"
    },
    "schema": {
      "type": "object",
      "properties": {
        "required": {
          "type": "array",
          "items": {"type": "string"}
        },
        "validation": {
          "type": "object",
          "properties": {
            "onCommit": {"type": "boolean"},
            "onBuild": {"type": "boolean"},
            "blockOnFail": {"type": "boolean"}
          }
        },
        "versionControl": {
          "type": "object",
          "properties": {
            "enforceSemanticVersioning": {"type": "boolean"},
            "requireVersionBump": {"type": "boolean"}
          }
        }
      }
    },
    "mappings": {
      "type": "object",
      "properties": {
        "roundTripTests": {
          "type": "object",
          "properties": {
            "required": {"type": "boolean"},
            "minCoverage": {"type": "number"}
          }
        },
        "losslessRequired": {
          "type": "array",
          "items": {"type": "string"}
        }
      }
    },
    "themes": {
      "type": "object",
      "properties": {
        "csp": {
          "type": "object",
          "properties": {
            "noInlineScripts": {"type": "boolean"},
            "noRemoteResources": {"type": "boolean"},
            "allowedResourceTypes": {
              "type": "array",
              "items": {"type": "string"}
            }
          }
        },
        "sizeLimit": {
          "type": "object",
          "properties": {
            "maxKb": {"type": "number"},
            "enforce": {"type": "boolean"}
          }
        },
        "requiredFiles": {
          "type": "array",
          "items": {"type": "string"}
        }
      }
    },
    "governance": {
      "type": "object",
      "properties": {
        "adr": {
          "type": "object",
          "properties": {
            "requiredFor": {
              "type": "array",
              "items": {"type": "string"}
            },
            "template": {"type": "string"},
            "numberingScheme": {"type": "string"}
          }
        },
        "manifestSync": {
          "type": "object",
          "properties": {
            "autoUpdate": {"type": "boolean"},
            "validateOnCommit": {"type": "boolean"},
            "blockOnMismatch": {"type": "boolean"}
          }
        }
      }
    },
    "security": {
      "type": "object",
      "properties": {
        "clientSideOnly": {
          "type": "object",
          "properties": {
            "noServerCalls": {"type": "boolean"},
            "noExternalTracking": {"type": "boolean"},
            "allowedDomains": {
              "type": "array",
              "items": {"type": "string"}
            }
          }
        },
        "dependencies": {
          "type": "object",
          "properties": {
            "scanForVulnerabilities": {"type": "boolean"},
            "blockCritical": {"type": "boolean"},
            "allowedLicenses": {
              "type": "array",
              "items": {"type": "string"}
            }
          }
        }
      }
    },
    "quality": {
      "type": "object",
      "properties": {
        "testing": {
          "type": "object",
          "properties": {
            "minCoverage": {"type": "number"},
            "requireTestsForFeatures": {"type": "boolean"},
            "requireA11yTests": {"type": "boolean"}
          }
        },
        "accessibility": {
          "type": "object",
          "properties": {
            "wcagLevel": {"type": "string"},
            "axeCoreViolations": {"type": "number"},
            "scanOnBuild": {"type": "boolean"}
          }
        },
        "performance": {
          "type": "object",
          "properties": {
            "lighthouseMin": {"type": "number"},
            "bundleSizeMaxKb": {"type": "number"},
            "loadTimeMaxMs": {"type": "number"}
          }
        }
      }
    }
  }
}
```

---

## Complete Example

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-10-03T12:00:00Z",

  "schema": {
    "required": [
      "/schemas/cfrs.schema.json",
      "/schemas/cfrs-to-jrs.json",
      "/schemas/cfrs-to-fresh.json"
    ],
    "validation": {
      "onCommit": true,
      "onBuild": true,
      "blockOnFail": true
    },
    "versionControl": {
      "enforceSemanticVersioning": true,
      "requireVersionBump": true
    },
    "namespaceRules": {
      "extensionPrefix": "x_cfrs_",
      "prohibitedPrefixes": ["x_jrs_", "x_fresh_", "custom_"],
      "enforce": true
    },
    "exampleValidation": {
      "validateOnCommit": true,
      "minimumExamples": 3,
      "requireInvalidExample": true
    }
  },

  "mappings": {
    "roundTripTests": {
      "required": true,
      "minCoverage": 100,
      "formats": ["CFRS->JRS->CFRS", "CFRS->FRESH->CFRS"]
    },
    "losslessRequired": [
      "CFRS->JRS",
      "JRS->CFRS"
    ],
    "validationRules": {
      "enforceFieldMapping": true,
      "requireReverseMappings": true,
      "documentEdgeCases": true
    }
  },

  "themes": {
    "csp": {
      "noInlineScripts": true,
      "noRemoteResources": true,
      "allowedResourceTypes": ["css", "fonts", "images"],
      "scanOnSubmit": true,
      "rejectOnViolation": true
    },
    "sizeLimit": {
      "maxKb": 500,
      "enforce": true,
      "includeAssets": true
    },
    "requiredFiles": [
      "manifest.json",
      "template.njk",
      "styles.css",
      "screenshot.png"
    ],
    "metadata": {
      "requireLicense": true,
      "requireVersion": true,
      "requireAuthor": true,
      "requireDescription": true
    },
    "testing": {
      "requireGoldenFixtures": true,
      "requireScreenshots": true,
      "testWithMinimalData": true,
      "testWithMaximalData": true
    }
  },

  "governance": {
    "adr": {
      "requiredFor": [
        "schema-changes",
        "architecture-decisions",
        "dependency-additions",
        "build-process-changes",
        "theme-governance-changes",
        "security-policy-changes"
      ],
      "template": "/.hive-mind/ADR_TEMPLATE.md",
      "numberingScheme": "sequential-padded",
      "statusValues": ["Proposed", "Accepted", "Deprecated", "Superseded"],
      "enforceInPR": true,
      "blockMergeWithoutADR": true
    },
    "manifestSync": {
      "autoUpdate": false,
      "validateOnCommit": true,
      "blockOnMismatch": true,
      "requiredUpdatesFor": [
        "file-additions",
        "file-removals",
        "schema-changes",
        "adr-creation",
        "theme-additions",
        "dependency-changes"
      ]
    },
    "documentation": {
      "requireChangelogUpdate": true,
      "requireReadmeUpdate": false,
      "linkValidation": true
    }
  },

  "security": {
    "clientSideOnly": {
      "noServerCalls": true,
      "noExternalTracking": true,
      "allowedDomains": [],
      "scanCodeForAPICalls": true,
      "prohibitedPatterns": [
        "fetch(",
        "XMLHttpRequest",
        "axios.",
        "$.ajax",
        "navigator.sendBeacon"
      ]
    },
    "dependencies": {
      "scanForVulnerabilities": true,
      "blockCritical": true,
      "blockHigh": false,
      "allowedLicenses": [
        "MIT",
        "Apache-2.0",
        "BSD-2-Clause",
        "BSD-3-Clause",
        "ISC"
      ],
      "requireJustificationFor": "production",
      "scanTools": ["npm audit", "snyk"]
    },
    "dataHandling": {
      "noLocalStorage": false,
      "noSessionStorage": false,
      "noCookies": true,
      "noIndexedDB": false,
      "clearOnClose": false
    }
  },

  "quality": {
    "testing": {
      "minCoverage": 80,
      "requireTestsForFeatures": true,
      "requireA11yTests": true,
      "testTypes": ["unit", "integration", "snapshot", "a11y"],
      "blockOnTestFailure": true
    },
    "accessibility": {
      "wcagLevel": "AA",
      "axeCoreViolations": 0,
      "scanOnBuild": true,
      "scanOnPR": true,
      "requireKeyboardTests": true,
      "requireScreenReaderTests": false,
      "colorContrastMin": 4.5
    },
    "performance": {
      "lighthouseMin": 90,
      "bundleSizeMaxKb": 500,
      "loadTimeMaxMs": 3000,
      "fcp": 1500,
      "tti": 3000,
      "cls": 0.1,
      "testConnection": "3G"
    },
    "codeStandards": {
      "eslint": {
        "enforce": true,
        "maxWarnings": 0
      },
      "prettier": {
        "enforce": true,
        "checkFormatted": true
      },
      "typescript": {
        "strict": true,
        "noImplicitAny": true,
        "noAny": true
      }
    }
  },

  "ci": {
    "requiredChecks": [
      "build",
      "lint",
      "type-check",
      "test",
      "schema-validation",
      "accessibility",
      "security-scan"
    ],
    "optionalChecks": [
      "performance-audit",
      "bundle-size",
      "link-validation"
    ],
    "blockMergeOnFailure": true,
    "requireApprovals": 1
  },

  "preCommitHooks": {
    "enabled": true,
    "hooks": [
      {
        "name": "lint-staged",
        "command": "npm run lint:staged",
        "files": ["*.ts", "*.tsx", "*.js", "*.jsx"]
      },
      {
        "name": "schema-validation",
        "command": "npm run validate:schemas",
        "files": ["schemas/**/*.json"]
      },
      {
        "name": "manifest-sync",
        "command": "npm run validate:manifest",
        "files": ["MANIFEST.json", "schemas/**/*", "themes/**/*"]
      },
      {
        "name": "type-check",
        "command": "npm run type-check",
        "files": ["*.ts", "*.tsx"]
      }
    ]
  },

  "errorMessages": {
    "schemaValidationFailed": "Schema validation failed. Run 'npm run validate:schemas' for details.",
    "manifestOutOfSync": "MANIFEST.json is out of sync. Update it or run 'npm run sync:manifest'.",
    "adrRequired": "ADR required for this type of change. Create ADR using template at .hive-mind/ADR_TEMPLATE.md",
    "cspViolation": "Theme contains CSP violation (inline script or remote resource).",
    "testCoverageLow": "Test coverage below 80%. Add tests to meet minimum.",
    "a11yViolations": "Accessibility violations found. Fix issues reported by axe-core.",
    "bundleSizeExceeded": "Bundle size exceeds 500KB limit. Optimize or use code splitting.",
    "securityVulnerability": "Critical security vulnerability detected. Fix before merging."
  },

  "notifications": {
    "onViolation": "block",
    "onWarning": "log",
    "includeFixSuggestions": true,
    "includeDocs": true
  }
}
```

---

## Rule Categories

### Schema Rules

**Purpose**: Ensure schema integrity and consistency

**Enforced Rules**:
1. All schema files validate against JSON Schema Draft-07
2. Schema versions follow SemVer
3. Schema changes require ADR
4. Extension fields use `x_cfrs_*` namespace only
5. At least 3 example files exist (valid + invalid)
6. Examples validate correctly (valid pass, invalid fail)

**Validation Commands**:
```bash
npm run validate:schemas
npm run validate:examples
```

**Failure Actions**:
- Block commit if schema invalid
- Block PR if ADR missing for schema change
- Block merge if examples don't validate

---

### Mapping Rules

**Purpose**: Ensure data conversion accuracy

**Enforced Rules**:
1. Round-trip tests exist for all mappings
2. Round-trip tests have 100% coverage
3. CFRS→JRS→CFRS is lossless
4. All mapping changes require tests
5. Edge cases are documented

**Validation Commands**:
```bash
npm run test:mappings
npm run test:roundtrip
```

**Failure Actions**:
- Block commit if round-trip tests fail
- Block PR if mapping coverage <100%
- Warn if new edge case not documented

---

### Theme Rules

**Purpose**: Ensure theme security and quality

**Enforced Rules**:
1. No JavaScript in theme files
2. No remote resource loading
3. CSP headers compliant
4. Total theme size ≤500KB
5. Required files present (manifest, template, css, screenshot)
6. Metadata complete (license, version, author)
7. Golden fixtures exist

**Validation Commands**:
```bash
npm run validate:theme <theme-name>
npm run scan:csp <theme-name>
```

**Failure Actions**:
- Reject theme if JavaScript detected
- Reject theme if CSP violation found
- Reject theme if >500KB
- Block merge if required files missing

---

### Governance Rules

**Purpose**: Maintain project documentation standards

**Enforced Rules**:
1. ADR required for:
   - Schema changes
   - Architecture decisions
   - Dependency additions
   - Build process changes
   - Theme governance changes
   - Security policy changes
2. MANIFEST.json updated when:
   - Files added/removed
   - Schemas changed
   - ADRs created
   - Themes added
   - Dependencies changed
3. CHANGELOG updated for user-facing changes

**Validation Commands**:
```bash
npm run validate:manifest
npm run check:adr-required
```

**Failure Actions**:
- Block PR if ADR missing for required change
- Block commit if MANIFEST.json out of sync
- Warn if CHANGELOG not updated

---

### Security Rules

**Purpose**: Enforce privacy and security standards

**Enforced Rules**:
1. No server API calls in code
2. No external tracking/analytics
3. No critical/high vulnerabilities in dependencies
4. Only allowed licenses (MIT, Apache-2.0, BSD, ISC)
5. No cookies set
6. Production dependencies require justification

**Validation Commands**:
```bash
npm run scan:security
npm audit
npm run check:licenses
```

**Failure Actions**:
- Block commit if server call detected
- Block PR if critical vulnerability found
- Block merge if incompatible license added
- Require ADR for new production dependency

---

### Quality Rules

**Purpose**: Maintain code quality and accessibility

**Enforced Rules**:
1. Test coverage ≥80%
2. Zero accessibility violations (axe-core)
3. WCAG AA compliance
4. Lighthouse Performance ≥90
5. Bundle size ≤500KB gzipped
6. Load time ≤3s on 3G
7. ESLint zero errors/warnings
8. Prettier formatting enforced
9. TypeScript strict mode

**Validation Commands**:
```bash
npm run test:coverage
npm run test:a11y
npm run audit:lighthouse
npm run check:bundle-size
npm run lint
npm run format:check
npm run type-check
```

**Failure Actions**:
- Block commit if lint errors
- Block PR if coverage <80%
- Block merge if a11y violations
- Block merge if Lighthouse <90
- Warn if bundle size increasing

---

## Enforcement Mechanisms

### Pre-Commit Hooks (Local)

**Tool**: Husky + lint-staged

**Runs On**: Every `git commit`

**Checks**:
1. Lint staged files (ESLint, Prettier)
2. Validate schemas if changed
3. Type-check TypeScript files
4. Run unit tests for changed files
5. Validate MANIFEST.json if changed

**Configuration**:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "tsc --noEmit"
    ],
    "*.{js,jsx,json,md}": [
      "prettier --write"
    ],
    "schemas/**/*.json": [
      "npm run validate:schemas"
    ],
    "MANIFEST.json": [
      "npm run validate:manifest"
    ]
  }
}
```

---

### GitHub Actions (CI)

**Runs On**: Every push and PR

**Required Checks**:
1. **Build**: Production build succeeds
2. **Lint**: ESLint passes with 0 warnings
3. **Type Check**: TypeScript compiles
4. **Test**: All tests pass with ≥80% coverage
5. **Schema Validation**: All schemas valid
6. **Accessibility**: axe-core scan passes
7. **Security Scan**: No critical vulnerabilities

**Optional Checks**:
1. **Performance**: Lighthouse audit
2. **Bundle Size**: Size impact report
3. **Link Validation**: No broken links

**Branch Protection**:
- All required checks must pass
- At least 1 approval required
- CODEOWNERS review for sensitive files

---

### PR Templates

**Checklist Items**:
```markdown
## Governance
- [ ] MANIFEST.json updated (if files added/removed)
- [ ] ADR created/updated (if required)
- [ ] CHANGELOG updated (if user-facing change)

## Quality
- [ ] Tests added/updated
- [ ] Test coverage ≥80%
- [ ] Accessibility tested
- [ ] Keyboard navigation verified

## Security
- [ ] No server calls added
- [ ] No tracking/analytics added
- [ ] Dependencies scanned
- [ ] CSP compliant (if theme)
```

---

## Violation Handling

### Severity Levels

**CRITICAL (Block)**:
- Schema validation failure
- Security vulnerability
- CSP violation in theme
- Accessibility regression

**ERROR (Block)**:
- Test failure
- Lint errors
- Type errors
- Coverage drop below 80%

**WARNING (Log)**:
- Bundle size increase
- Performance regression
- Missing documentation

---

### Error Messages

All error messages should:
1. **Identify the issue**: What rule was violated
2. **Explain why**: Why the rule exists
3. **Provide fix**: How to resolve the violation
4. **Link docs**: Where to learn more

**Example**:
```
❌ Schema Validation Failed

schemas/cfrs.schema.json does not validate.

Why: All schema files must conform to JSON Schema Draft-07 to ensure
compatibility with validation tools.

Fix: Run 'npm run validate:schemas -- --verbose' to see validation errors.
Then correct the schema and re-run validation.

Learn more: /docs/SCHEMA.md#validation-rules
```

---

## Customization

### Adding New Rules

1. **Define Rule**: Add to .claude-rules.json
2. **Implement Validation**: Create script in /scripts
3. **Add to CI**: Update GitHub Actions workflow
4. **Document**: Update this spec
5. **Create ADR**: Document decision

### Disabling Rules (Emergency Only)

**Never disable rules in .claude-rules.json**

For temporary bypass:
```bash
# Use git commit --no-verify (emergency only)
git commit --no-verify -m "Emergency fix"
```

**Required Follow-up**:
- Create issue to fix properly
- Create ADR explaining why bypass was needed
- Fix and re-commit with verification enabled

---

## Validation Scripts

### Pre-Commit Validation
```bash
#!/bin/bash
# scripts/validate-pre-commit.sh

set -e

echo "Running pre-commit validation..."

# Lint staged files
npm run lint:staged

# Validate schemas if changed
if git diff --cached --name-only | grep -q "schemas/"; then
  npm run validate:schemas
fi

# Validate manifest if changed
if git diff --cached --name-only | grep -q "MANIFEST.json"; then
  npm run validate:manifest
fi

# Type check
npm run type-check

echo "✓ Pre-commit validation passed"
```

### PR Validation
```bash
#!/bin/bash
# scripts/validate-pr.sh

set -e

echo "Running PR validation..."

# All builds must succeed
npm run build

# All tests must pass
npm run test:coverage

# Check coverage threshold
coverage=$(npm run test:coverage -- --silent | grep "All files" | awk '{print $10}' | tr -d '%')
if (( $(echo "$coverage < 80" | bc -l) )); then
  echo "❌ Coverage $coverage% is below 80%"
  exit 1
fi

# Schema validation
npm run validate:schemas
npm run validate:manifest

# Accessibility scan
npm run test:a11y

# Security scan
npm audit --audit-level=high

echo "✓ PR validation passed"
```

---

## FAQ

### Can I skip pre-commit hooks?
**No.** Use `--no-verify` only for emergencies and create follow-up issue.

### What if a rule is too strict?
Create ADR proposing rule change, discuss with team, update if consensus.

### How do I add a new check?
Add to .claude-rules.json, implement script, add to CI, document, create ADR.

### What if CI is failing incorrectly?
Investigate root cause. If CI bug, fix CI. Never merge failing checks.

### Can themes have exceptions?
No. All themes must pass CSP, size, and metadata checks without exception.

---

**Last Updated**: 2025-10-03
**Maintained By**: REVIEWER Agent
**Version**: 1.0.0
