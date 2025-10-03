---
STATUS: SPECIFICATION
VERSION: 1.0.0
CREATED: 2025-10-03
PURPOSE: MANIFEST.json structure and validation rules
---

# MANIFEST.json Structure Specification

## Overview

The MANIFEST.json file serves as the **central inventory and metadata registry** for the CloudFlow Resume project. It tracks all critical files, schemas, mappings, themes, ADRs, and project metadata.

**Location**: `/MANIFEST.json` (repository root)

---

## Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://cloudflow-resume.dev/schemas/manifest.schema.json",
  "title": "CloudFlow Resume MANIFEST",
  "description": "Central inventory and metadata for CFRS project",
  "type": "object",
  "required": [
    "manifestVersion",
    "projectVersion",
    "projectName",
    "lastUpdated",
    "schema",
    "mappings",
    "documentation",
    "adrs",
    "themes",
    "enforcement"
  ],
  "properties": {
    "manifestVersion": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "description": "SemVer of this MANIFEST schema"
    },
    "projectVersion": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "description": "Current version of CFRS project"
    },
    "projectName": {
      "type": "string",
      "const": "CloudFlow Resume"
    },
    "repository": {
      "type": "string",
      "format": "uri",
      "description": "GitHub repository URL"
    },
    "homepage": {
      "type": "string",
      "format": "uri",
      "description": "GitHub Pages URL"
    },
    "lastUpdated": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp from time.gov"
    },
    "schema": {
      "type": "object",
      "required": ["cfrs", "examples"],
      "properties": {
        "cfrs": {
          "type": "object",
          "required": ["version", "path", "hash"],
          "properties": {
            "version": {"type": "string"},
            "path": {"type": "string"},
            "hash": {"type": "string"},
            "lastModified": {"type": "string", "format": "date-time"}
          }
        },
        "examples": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "path", "valid"],
            "properties": {
              "name": {"type": "string"},
              "path": {"type": "string"},
              "valid": {"type": "boolean"},
              "description": {"type": "string"}
            }
          }
        }
      }
    },
    "mappings": {
      "type": "object",
      "required": ["cfrsToJrs", "cfrsToFresh"],
      "properties": {
        "cfrsToJrs": {
          "type": "object",
          "required": ["version", "path", "hash"],
          "properties": {
            "version": {"type": "string"},
            "path": {"type": "string"},
            "hash": {"type": "string"},
            "lastModified": {"type": "string", "format": "date-time"},
            "lossless": {"type": "boolean"},
            "testPath": {"type": "string"}
          }
        },
        "cfrsToFresh": {
          "type": "object",
          "required": ["version", "path", "hash"],
          "properties": {
            "version": {"type": "string"},
            "path": {"type": "string"},
            "hash": {"type": "string"},
            "lastModified": {"type": "string", "format": "date-time"},
            "lossless": {"type": "boolean"},
            "testPath": {"type": "string"}
          }
        }
      }
    },
    "documentation": {
      "type": "object",
      "required": ["primary", "secondary"],
      "properties": {
        "primary": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "path"],
            "properties": {
              "name": {"type": "string"},
              "path": {"type": "string"},
              "purpose": {"type": "string"}
            }
          }
        },
        "secondary": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "path"],
            "properties": {
              "name": {"type": "string"},
              "path": {"type": "string"},
              "purpose": {"type": "string"}
            }
          }
        }
      }
    },
    "adrs": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["number", "title", "status", "path", "date"],
        "properties": {
          "number": {"type": "integer", "minimum": 1},
          "title": {"type": "string"},
          "status": {
            "type": "string",
            "enum": ["Proposed", "Accepted", "Deprecated", "Superseded"]
          },
          "path": {"type": "string"},
          "date": {"type": "string", "format": "date"},
          "supersedes": {"type": "integer"},
          "supersededBy": {"type": "integer"},
          "tags": {
            "type": "array",
            "items": {"type": "string"}
          }
        }
      }
    },
    "themes": {
      "type": "object",
      "required": ["builtin", "registry"],
      "properties": {
        "builtin": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "name", "version", "path"],
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "version": {"type": "string"},
              "path": {"type": "string"},
              "category": {"type": "string"},
              "atsSafe": {"type": "boolean"},
              "printOptimized": {"type": "boolean"}
            }
          }
        },
        "registry": {
          "type": "object",
          "required": ["path", "count"],
          "properties": {
            "path": {"type": "string"},
            "count": {"type": "integer"},
            "lastUpdated": {"type": "string", "format": "date-time"}
          }
        }
      }
    },
    "enforcement": {
      "type": "object",
      "required": ["rulesPath", "preCommitHooks", "ciWorkflows"],
      "properties": {
        "rulesPath": {"type": "string"},
        "preCommitHooks": {
          "type": "array",
          "items": {"type": "string"}
        },
        "ciWorkflows": {
          "type": "array",
          "items": {"type": "string"}
        },
        "requiredChecks": {
          "type": "array",
          "items": {"type": "string"}
        }
      }
    },
    "compliance": {
      "type": "object",
      "properties": {
        "lastAudit": {"type": "string", "format": "date"},
        "nextAudit": {"type": "string", "format": "date"},
        "status": {
          "type": "string",
          "enum": ["Compliant", "Partial", "Non-Compliant"]
        },
        "checklist": {"type": "string"}
      }
    },
    "dependencies": {
      "type": "object",
      "properties": {
        "production": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "version", "license"],
            "properties": {
              "name": {"type": "string"},
              "version": {"type": "string"},
              "license": {"type": "string"},
              "justification": {"type": "string"}
            }
          }
        },
        "development": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "version", "license"],
            "properties": {
              "name": {"type": "string"},
              "version": {"type": "string"},
              "license": {"type": "string"}
            }
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
  "manifestVersion": "1.0.0",
  "projectVersion": "0.1.0",
  "projectName": "CloudFlow Resume",
  "repository": "https://github.com/your-org/cloudflow-resume",
  "homepage": "https://your-org.github.io/cloudflow-resume",
  "lastUpdated": "2025-10-03T12:00:00Z",

  "schema": {
    "cfrs": {
      "version": "1.0.0",
      "path": "/schemas/cfrs.schema.json",
      "hash": "sha256:abc123...",
      "lastModified": "2025-10-03T10:00:00Z"
    },
    "examples": [
      {
        "name": "minimal-resume",
        "path": "/schemas/examples/minimal.json",
        "valid": true,
        "description": "Minimal valid CFRS resume"
      },
      {
        "name": "complete-resume",
        "path": "/schemas/examples/complete.json",
        "valid": true,
        "description": "Resume with all optional fields"
      },
      {
        "name": "invalid-resume",
        "path": "/schemas/examples/invalid.json",
        "valid": false,
        "description": "Example of validation errors"
      }
    ]
  },

  "mappings": {
    "cfrsToJrs": {
      "version": "1.0.0",
      "path": "/schemas/cfrs-to-jrs.json",
      "hash": "sha256:def456...",
      "lastModified": "2025-10-03T10:00:00Z",
      "lossless": true,
      "testPath": "/tests/mappings/cfrs-jrs.test.ts"
    },
    "cfrsToFresh": {
      "version": "1.0.0",
      "path": "/schemas/cfrs-to-fresh.json",
      "hash": "sha256:ghi789...",
      "lastModified": "2025-10-03T10:00:00Z",
      "lossless": false,
      "testPath": "/tests/mappings/cfrs-fresh.test.ts"
    }
  },

  "documentation": {
    "primary": [
      {
        "name": "CLAUDE.md",
        "path": "/CLAUDE.md",
        "purpose": "Single source of truth for project governance"
      },
      {
        "name": "MANIFEST.json",
        "path": "/MANIFEST.json",
        "purpose": "Central inventory and metadata registry"
      },
      {
        "name": ".claude-rules.json",
        "path": "/.claude-rules.json",
        "purpose": "Enforcement rules for automated checks"
      }
    ],
    "secondary": [
      {
        "name": "ARCHITECTURE.md",
        "path": "/docs/ARCHITECTURE.md",
        "purpose": "System design and component architecture"
      },
      {
        "name": "ENFORCEMENT.md",
        "path": "/docs/ENFORCEMENT.md",
        "purpose": "Critical enforcement rules"
      },
      {
        "name": "SCHEMA.md",
        "path": "/docs/SCHEMA.md",
        "purpose": "CFRS specification and mappings"
      },
      {
        "name": "THEMES.md",
        "path": "/docs/THEMES.md",
        "purpose": "Theme SDK and registry rules"
      }
    ]
  },

  "adrs": [
    {
      "number": 1,
      "title": "CFRS Schema Design",
      "status": "Accepted",
      "path": "/docs/ADR-001-schema-design.md",
      "date": "2025-10-03",
      "tags": ["schema", "architecture"]
    },
    {
      "number": 2,
      "title": "Client-Side Only Architecture",
      "status": "Accepted",
      "path": "/docs/ADR-002-client-side-only.md",
      "date": "2025-10-03",
      "tags": ["architecture", "privacy"]
    }
  ],

  "themes": {
    "builtin": [
      {
        "id": "classic",
        "name": "Classic ATS",
        "version": "1.0.0",
        "path": "/themes/classic",
        "category": "ATS-Safe",
        "atsSafe": true,
        "printOptimized": true
      },
      {
        "id": "modern",
        "name": "Modern Professional",
        "version": "1.0.0",
        "path": "/themes/modern",
        "category": "Modern",
        "atsSafe": false,
        "printOptimized": true
      }
    ],
    "registry": {
      "path": "/themes/registry.json",
      "count": 2,
      "lastUpdated": "2025-10-03T12:00:00Z"
    }
  },

  "enforcement": {
    "rulesPath": "/.claude-rules.json",
    "preCommitHooks": [
      "lint-staged",
      "schema-validation",
      "type-check"
    ],
    "ciWorkflows": [
      ".github/workflows/build.yml",
      ".github/workflows/test.yml",
      ".github/workflows/deploy.yml",
      ".github/workflows/schema-validation.yml"
    ],
    "requiredChecks": [
      "Build",
      "Lint",
      "Type Check",
      "Unit Tests",
      "Schema Validation",
      "Accessibility"
    ]
  },

  "compliance": {
    "lastAudit": "2025-10-03",
    "nextAudit": "2025-11-03",
    "status": "Compliant",
    "checklist": "/.hive-mind/COMPLIANCE_CHECKLIST.md"
  },

  "dependencies": {
    "production": [
      {
        "name": "preact",
        "version": "^10.19.0",
        "license": "MIT",
        "justification": "Lightweight React alternative for UI"
      },
      {
        "name": "nunjucks",
        "version": "^3.2.4",
        "license": "BSD-2-Clause",
        "justification": "Template engine for theme rendering"
      },
      {
        "name": "ajv",
        "version": "^8.12.0",
        "license": "MIT",
        "justification": "JSON Schema validation"
      }
    ],
    "development": [
      {
        "name": "vite",
        "version": "^5.0.0",
        "license": "MIT"
      },
      {
        "name": "typescript",
        "version": "^5.3.0",
        "license": "Apache-2.0"
      },
      {
        "name": "vitest",
        "version": "^1.0.0",
        "license": "MIT"
      }
    ]
  }
}
```

---

## Field Descriptions

### Top-Level Metadata
- **manifestVersion**: Version of MANIFEST schema (SemVer)
- **projectVersion**: Current CFRS project version (SemVer)
- **projectName**: Always "CloudFlow Resume"
- **repository**: Full GitHub repository URL
- **homepage**: GitHub Pages deployment URL
- **lastUpdated**: ISO 8601 timestamp from time.gov (UTC)

### Schema Section
- **cfrs**: Primary CFRS schema metadata
  - **version**: Schema version (SemVer)
  - **path**: Relative path from repo root
  - **hash**: SHA-256 hash for integrity verification
  - **lastModified**: ISO 8601 timestamp
- **examples**: Array of example resume files
  - **valid**: Whether example should pass validation

### Mappings Section
- **cfrsToJrs**: CFRS ↔ JSON Resume mapping
- **cfrsToFresh**: CFRS ↔ FRESH mapping
- **lossless**: Whether round-trip preserves all data
- **testPath**: Path to round-trip tests

### Documentation Section
- **primary**: Authoritative governance documents
- **secondary**: Supporting technical documentation

### ADRs Section
Array of all Architecture Decision Records:
- **number**: Sequential integer (1, 2, 3...)
- **status**: Current lifecycle status
- **supersedes/supersededBy**: Links to related ADRs
- **tags**: Categorization tags

### Themes Section
- **builtin**: Themes included in repo
- **registry**: External theme registry metadata
- **atsSafe**: Whether theme is ATS-optimized
- **printOptimized**: Whether theme is print-ready

### Enforcement Section
- **rulesPath**: Path to .claude-rules.json
- **preCommitHooks**: Git hooks that run before commit
- **ciWorkflows**: GitHub Actions workflow files
- **requiredChecks**: CI checks that must pass

### Compliance Section
- **lastAudit**: Date of last comprehensive review
- **nextAudit**: Scheduled next review date
- **status**: Current compliance state
- **checklist**: Path to compliance checklist

### Dependencies Section
- **production**: Runtime dependencies
- **development**: Build/test dependencies
- **justification**: Why dependency is needed (for production only)

---

## Validation Rules

### Automatic Validation
MANIFEST.json MUST be validated on every commit:

1. **Schema Validation**: Validates against manifest.schema.json
2. **Path Verification**: All referenced paths exist
3. **Hash Verification**: File hashes match current content
4. **Version Consistency**: Versions follow SemVer
5. **Date Format**: All dates are valid ISO 8601
6. **ADR Sequence**: ADR numbers are sequential
7. **Unique IDs**: Theme IDs are unique

### Manual Validation
Quarterly reviews should verify:

1. **Documentation Currency**: All docs are up-to-date
2. **Dependency Audit**: No outdated/vulnerable deps
3. **Theme Registry**: All themes still valid
4. **Compliance Status**: Status accurately reflects state

---

## Update Procedures

### When to Update MANIFEST.json

**REQUIRED Updates**:
- Schema version changes
- New/removed mapping files
- ADR creation
- Theme additions/removals
- Enforcement rule changes
- Major dependency changes
- Documentation restructuring

**RECOMMENDED Updates**:
- Minor dependency updates
- Documentation corrections
- Compliance audit results
- Project version bumps

### Update Process

1. **Make Changes**: Modify project files
2. **Update MANIFEST**: Add/modify relevant entries
3. **Update Timestamp**: Set lastUpdated to current time.gov time
4. **Generate Hashes**: Update hash fields for changed files
5. **Validate**: Run manifest validation script
6. **Commit Together**: MANIFEST.json and related changes in same commit

### Hash Generation

```bash
# Generate SHA-256 hash for a file
sha256sum /path/to/file.json | awk '{print "sha256:" $1}'
```

### Automated Updates

Some fields can be auto-updated by CI:
- File hashes
- Timestamps
- Theme registry count
- Dependency lists (from package.json)

---

## Validation Script

```typescript
// scripts/validate-manifest.ts
import Ajv from 'ajv';
import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';

const ajv = new Ajv({ strict: true });

// Load and validate schema
const manifestSchema = JSON.parse(
  readFileSync('./schemas/manifest.schema.json', 'utf-8')
);
const manifest = JSON.parse(readFileSync('./MANIFEST.json', 'utf-8'));

const validate = ajv.compile(manifestSchema);
const valid = validate(manifest);

if (!valid) {
  console.error('MANIFEST.json validation failed:');
  console.error(validate.errors);
  process.exit(1);
}

// Verify paths exist
const paths = [
  manifest.schema.cfrs.path,
  ...manifest.schema.examples.map(e => e.path),
  manifest.mappings.cfrsToJrs.path,
  manifest.mappings.cfrsToFresh.path,
  ...manifest.documentation.primary.map(d => d.path),
  ...manifest.documentation.secondary.map(d => d.path),
  ...manifest.adrs.map(a => a.path),
  ...manifest.themes.builtin.map(t => t.path),
];

for (const path of paths) {
  if (!existsSync(`.${path}`)) {
    console.error(`Path not found: ${path}`);
    process.exit(1);
  }
}

// Verify hashes
const hashFiles = [
  { path: manifest.schema.cfrs.path, hash: manifest.schema.cfrs.hash },
  { path: manifest.mappings.cfrsToJrs.path, hash: manifest.mappings.cfrsToJrs.hash },
  { path: manifest.mappings.cfrsToFresh.path, hash: manifest.mappings.cfrsToFresh.hash },
];

for (const { path, hash } of hashFiles) {
  const content = readFileSync(`.${path}`, 'utf-8');
  const computed = 'sha256:' + createHash('sha256').update(content).digest('hex');

  if (computed !== hash) {
    console.error(`Hash mismatch for ${path}`);
    console.error(`Expected: ${hash}`);
    console.error(`Computed: ${computed}`);
    process.exit(1);
  }
}

// Verify ADR sequence
const adrNumbers = manifest.adrs.map(a => a.number).sort((a, b) => a - b);
const expectedSequence = Array.from({ length: adrNumbers.length }, (_, i) => i + 1);

if (JSON.stringify(adrNumbers) !== JSON.stringify(expectedSequence)) {
  console.error('ADR numbers are not sequential');
  process.exit(1);
}

console.log('MANIFEST.json validation passed ✓');
```

---

## CI Integration

### Pre-Commit Hook
```yaml
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate MANIFEST.json
npm run validate:manifest || exit 1
```

### GitHub Action
```yaml
# .github/workflows/validate-manifest.yml
name: Validate MANIFEST

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run validate:manifest
```

---

## Best Practices

### Maintenance
1. **Update immediately** when adding/removing files
2. **Validate before commit** using pre-commit hook
3. **Review quarterly** for accuracy
4. **Keep timestamps current** using time.gov
5. **Regenerate hashes** when files change

### Documentation
1. **Link from CLAUDE.md** for authority
2. **Reference in ADRs** when relevant
3. **Include in PR templates** as checklist item
4. **Explain in onboarding docs** for new contributors

### Automation
1. **Auto-generate** what can be computed
2. **Validate in CI** on every PR
3. **Block merges** if validation fails
4. **Generate reports** from MANIFEST data

---

## Migration Guide

### From No MANIFEST to v1.0.0

1. **Create Initial MANIFEST**:
   ```bash
   npm run generate:manifest
   ```

2. **Review and Adjust**:
   - Verify all paths
   - Add descriptions
   - Set correct versions

3. **Validate**:
   ```bash
   npm run validate:manifest
   ```

4. **Commit**:
   ```bash
   git add MANIFEST.json
   git commit -m "Add MANIFEST.json v1.0.0"
   ```

### Future Version Upgrades

When manifest schema changes:

1. **Update manifestVersion** in MANIFEST.json
2. **Add new required fields**
3. **Migrate existing data** if needed
4. **Validate against new schema**
5. **Document in CHANGELOG**

---

## FAQ

### Why MANIFEST.json?
Single source of truth for project inventory, enables automated validation, supports tooling, provides clear project snapshot.

### When to update?
Whenever files are added/removed/moved, when versions change, when ADRs are created, when themes are added.

### What if paths change?
Update MANIFEST.json in the same commit as the path change. CI will catch mismatches.

### How to handle hash mismatches?
Regenerate hash using validation script. If content changed without MANIFEST update, that's the issue to fix.

### Can MANIFEST be auto-generated?
Partially - paths, hashes, timestamps can be automated. Descriptions, justifications need manual input.

---

**Last Updated**: 2025-10-03
**Maintained By**: REVIEWER Agent
**Schema Version**: 1.0.0
