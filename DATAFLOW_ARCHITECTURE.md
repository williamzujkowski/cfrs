# CloudFlow Resume System (CFRS) - Data Flow Architecture

**VERSION:** 1.0.0
**STATUS:** AUTHORITATIVE
**DATE:** 2025-10-03
**ROLE:** System Architecture Blueprint

---

## 1. EXECUTIVE SUMMARY

This document defines the complete data flow architecture for the CloudFlow Resume System, a client-side SPA that transforms various resume input formats into structured CFRS JSON, applies themes, and exports to multiple formats.

**Core Principles:**

- 100% client-side processing (zero server storage)
- Schema-first validation (CFRS v1.0.0)
- Immutable data transformations
- Fail-fast validation with detailed error reporting
- Performance target: <3s load time on 3G

---

## 2. HIGH-LEVEL DATA FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INPUT LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│  JSON  │  Markdown  │  Docx  │  Plain Text  │  Paste  │  GitHub Gist│
└────┬────────┬─────────┬───────────┬───────────┬──────────┬──────────┘
     │        │         │           │           │          │
     ▼        ▼         ▼           ▼           ▼          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      IMPORT ORCHESTRATOR                             │
│  - Format detection                                                  │
│  - Route to appropriate importer                                     │
│  - Input sanitization                                                │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     IMPORTER PIPELINE                                │
├─────────────────────────────────────────────────────────────────────┤
│  JSONImporter  │  MarkdownImporter  │  DocxImporter  │  TextImporter│
│  - Parse       │  - Parse frontmatter│  - Extract text│  - Heuristic │
│  - Detect JRS  │  - Parse sections   │  - Structure   │  - Wizard    │
│  - Map to CFRS │  - Map to CFRS      │  - Map to CFRS │  - Map       │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   TRANSFORMATION LAYER                               │
│  - CFRS normalization                                                │
│  - Schema alignment                                                  │
│  - Data enrichment (defaults, computed fields)                       │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    VALIDATION PIPELINE                               │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ 1. Schema Validation (JSON Schema)                       │      │
│  │ 2. Business Rule Validation                              │      │
│  │ 3. Cross-field Validation                                │      │
│  │ 4. ATS Compatibility Check (optional)                    │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                       │
│  ERROR ────► Error Aggregator ────► User Feedback                   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                                │
│  - Valid CFRS JSON stored in app state                              │
│  - Revision history (undo/redo)                                      │
│  - User preferences (theme, locale, redaction)                      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│     RENDER PIPELINE          │  │    EXPORT PIPELINE           │
│  - Theme selection           │  │  - Format selection          │
│  - Nunjucks template engine  │  │  - Transformation            │
│  - Data injection            │  │  - Serialization             │
│  - Live preview              │  │  - Download trigger          │
└──────────────┬───────────────┘  └──────────────┬───────────────┘
               │                                  │
               ▼                                  ▼
    ┌──────────────────────┐          ┌──────────────────────────┐
    │  PREVIEW DISPLAY     │          │  EXPORT FORMATS          │
    │  - HTML render       │          │  - CFRS JSON             │
    │  - Theme applied     │          │  - JSON Resume (JRS)     │
    │  - Print preview     │          │  - FRESH JSON            │
    │  - Accessibility     │          │  - Markdown              │
    └──────────────────────┘          │  - HTML (standalone)     │
                                       │  - Print/PDF             │
                                       └──────────────────────────┘
```

---

## 3. MODULE ARCHITECTURE

### 3.1 Import Orchestrator

**Location:** `/apps/web/src/orchestrator/import-orchestrator.ts`

**Responsibilities:**

- Detect input format (MIME type, file extension, content analysis)
- Route to appropriate importer
- Handle errors and fallbacks
- Coordinate multi-file imports

**Interface:**

```typescript
interface ImportOrchestrator {
  import(input: ImportInput): Promise<ImportResult>;
  detectFormat(input: ImportInput): InputFormat;
  getSupportedFormats(): InputFormat[];
}

type ImportInput =
  | { type: 'file'; file: File }
  | { type: 'text'; content: string }
  | { type: 'url'; url: string };

type ImportResult = {
  success: boolean;
  data?: CFRSResume;
  errors?: ValidationError[];
  warnings?: Warning[];
  metadata: ImportMetadata;
};
```

**Data Flow:**

```
Input → Format Detection → Sanitization → Importer Selection → Parse → Result
```

---

### 3.2 Importer Pipeline

**Location:** `/apps/web/src/importers/`

#### 3.2.1 JSON Importer (`json-importer.ts`)

**Purpose:** Parse JSON Resume or CFRS JSON

**Algorithm:**

```
1. Parse JSON (validate well-formed)
2. Detect schema version:
   - Check for $schema field
   - Detect CFRS markers (x_cfrs_* fields)
   - Detect JRS markers (basics, work, education)
3. Route to appropriate mapper:
   - CFRS → Validate and pass through
   - JRS → Map using cfrs-to-jrs.json mapping
   - Unknown → Heuristic best-effort mapping
4. Return normalized CFRS
```

**Mapping Strategy:**

```typescript
interface Mapper {
  detect(data: unknown): SchemaType;
  map(data: unknown, sourceSchema: SchemaType): CFRSResume;
}

// Example JRS → CFRS mapping
{
  "basics.name": "header.name",
  "basics.email": "contact.email",
  "basics.phone": "contact.phone",
  "basics.summary": "summary.content",
  "work": "experience",
  "education": "education",
  // ... see schemas/cfrs-to-jrs.json for complete mapping
}
```

#### 3.2.2 Markdown Importer (`markdown-importer.ts`)

**Purpose:** Parse structured Markdown resumes

**Algorithm:**

```
1. Extract frontmatter (YAML/TOML) if present
   - Contains metadata and structured data
2. Parse body using marked.js with custom renderer
3. Section detection:
   - H1/H2 → Section headers (Experience, Education, Skills)
   - Lists → Bullet points
   - Bold/Italic → Emphasis markers
4. Heuristic mapping:
   - First H1 → Name
   - First paragraph → Summary
   - "Experience" section → Work history
   - Date patterns → Start/end dates
5. Construct CFRS object
```

**Section Patterns:**

```regex
Experience/Work History: /^#+\s*(experience|work|employment)/i
Education: /^#+\s*education/i
Skills: /^#+\s*skills/i
Projects: /^#+\s*projects/i
Dates: /(\d{4})\s*[-–]\s*(\d{4}|present)/i
```

#### 3.2.3 Docx Importer (`docx-importer.ts`)

**Purpose:** Extract text from Word documents

**Dependencies:** `mammoth.js`

**Algorithm:**

```
1. Use mammoth.js to extract HTML
2. Parse HTML to text with structure preservation
3. Apply same heuristics as Markdown importer
4. Extract formatting hints:
   - Bold → Job titles, section headers
   - Italic → Dates, locations
5. Map to CFRS with lower confidence scores
```

**Limitations:**

- No complex table support
- Limited formatting preservation
- Fallback UI messaging for complex docs

#### 3.2.4 Plain Text Importer (`text-importer.ts`)

**Purpose:** Interactive wizard for unstructured text

**Algorithm:**

```
1. Analyze text for patterns:
   - Email addresses → Contact
   - Phone numbers → Contact
   - URLs → Links
   - Date ranges → Experience/Education
2. Present wizard UI:
   - Step 1: Confirm personal info
   - Step 2: Select experience blocks
   - Step 3: Select education blocks
   - Step 4: Extract skills
3. User confirms/corrects each extraction
4. Build CFRS incrementally
```

**Pattern Library:**

```typescript
const PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g,
  url: /https?:\/\/[^\s]+/g,
  dateRange: /(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|present)/gi,
};
```

---

### 3.3 Transformation Layer

**Location:** `/apps/web/src/transform/`

**Purpose:** Normalize and enrich CFRS data

**Modules:**

#### 3.3.1 Normalizer (`normalizer.ts`)

```typescript
interface Normalizer {
  normalize(data: Partial<CFRSResume>): CFRSResume;
  applyDefaults(): void;
  computeDerivedFields(): void;
  sanitize(): void;
}

// Operations:
// 1. Apply schema defaults
// 2. Compute derived fields (e.g., years of experience)
// 3. Normalize dates (ISO 8601)
// 4. Trim whitespace
// 5. Remove empty arrays/objects
// 6. Sort chronologically where appropriate
```

#### 3.3.2 Schema Mapper (`schema-mapper.ts`)

**Purpose:** Bidirectional schema conversion

```typescript
interface SchemaMapper {
  toJRS(cfrs: CFRSResume): JSONResume;
  fromJRS(jrs: JSONResume): CFRSResume;
  toFRESH(cfrs: CFRSResume): FRESHResume;
  fromFRESH(fresh: FRESHResume): CFRSResume;
}

// Mapping files:
// - /schemas/cfrs-to-jrs.json
// - /schemas/cfrs-to-fresh.json
// - Loaded at build time, available as constants
```

---

### 3.4 Validation Pipeline

**Location:** `/apps/web/src/validation/`

**Multi-Stage Validation:**

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: JSON Schema Validation                            │
│ - Validate against cfrs.schema.json                        │
│ - Check required fields                                     │
│ - Validate types and formats                               │
│ - Check enums and patterns                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: Business Rules Validation                         │
│ - Date logic (start < end)                                 │
│ - Email/phone format validation                            │
│ - URL accessibility checks                                 │
│ - Character limits (ATS compatibility)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: Cross-Field Validation                            │
│ - Duplicate detection                                       │
│ - Consistency checks                                        │
│ - Reference integrity                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: ATS Compatibility (Optional)                      │
│ - Section completeness score                               │
│ - Keyword density                                          │
│ - Format recommendations                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  Error Aggregation
                         │
                         ▼
                  User Feedback UI
```

**Validator Interface:**

```typescript
interface Validator {
  validate(data: CFRSResume): ValidationResult;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: Warning[];
  score?: ATSScore;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  suggestion?: string;
}

// Example validation rules:
const BUSINESS_RULES = {
  maxExperience: 50, // years
  maxEducation: 10, // entries
  maxSkills: 100,
  maxTitleLength: 200,
  maxSummaryLength: 2000,
  requiredFields: ['header.name', 'contact.email'],
};
```

**Error Reporting Strategy:**

```typescript
class ValidationErrorAggregator {
  private errors: ValidationError[] = [];

  add(error: ValidationError): void;
  addMultiple(errors: ValidationError[]): void;
  groupByField(): Map<string, ValidationError[]>;
  getSeverity(): 'error' | 'warning' | 'info';
  toUserMessage(): string;
}

// Error display priority:
// 1. Schema errors (blocking)
// 2. Business rule errors (blocking)
// 3. ATS warnings (non-blocking)
// 4. Suggestions (info only)
```

---

### 3.5 State Management

**Location:** `/apps/web/src/store/`

**Architecture:** Zustand (lightweight, TypeScript-first)

**State Slices:**

```typescript
// Resume State
interface ResumeState {
  current: CFRSResume | null;
  history: CFRSResume[];
  historyIndex: number;
  validationResult: ValidationResult | null;

  // Actions
  setResume(resume: CFRSResume): void;
  updateField(path: string, value: unknown): void;
  undo(): void;
  redo(): void;
  clear(): void;
}

// UI State
interface UIState {
  selectedTheme: string;
  locale: string;
  redactionProfile: RedactionProfile;
  previewMode: 'desktop' | 'mobile' | 'print';
  sidebarOpen: boolean;

  // Actions
  setTheme(themeId: string): void;
  setLocale(locale: string): void;
  toggleSidebar(): void;
}

// Import State
interface ImportState {
  isImporting: boolean;
  progress: number;
  currentStep: ImportStep;
  errors: ImportError[];

  // Actions
  startImport(): void;
  updateProgress(step: ImportStep, progress: number): void;
  completeImport(): void;
  cancelImport(): void;
}

// Export State
interface ExportState {
  isExporting: boolean;
  format: ExportFormat;
  options: ExportOptions;

  // Actions
  exportAs(format: ExportFormat, options: ExportOptions): Promise<void>;
}

// Combined Store
const useStore = create<ResumeState & UIState & ImportState & ExportState>()(
  devtools(
    persist(
      (set, get) => ({
        // ... state and actions
      }),
      {
        name: 'cfrs-storage',
        partialize: (state) => ({
          // Only persist specific fields
          locale: state.locale,
          selectedTheme: state.selectedTheme,
        }),
      }
    )
  )
);
```

**State Flow:**

```
User Action → Dispatch → Middleware → Reducer → New State → UI Update

Middleware:
1. Validation Middleware (auto-validate on change)
2. History Middleware (track undo/redo)
3. Persistence Middleware (localStorage sync)
4. Analytics Middleware (track usage)
```

**Undo/Redo Strategy:**

```typescript
// Command Pattern for reversible operations
interface Command {
  execute(): void;
  undo(): void;
}

class UpdateFieldCommand implements Command {
  constructor(
    private path: string,
    private newValue: unknown,
    private oldValue: unknown
  ) {}

  execute() {
    // Update field in state
  }

  undo() {
    // Restore old value
  }
}

// History managed as command stack
const history: Command[] = [];
let historyIndex = -1;
```

---

### 3.6 Render Pipeline

**Location:** `/apps/web/src/render/`

**Architecture:**

```
CFRS Data → Theme Selection → Template Engine → HTML → Preview Display
                                     ↓
                              Live Data Binding
```

**Components:**

#### 3.6.1 Template Engine (`template-engine.ts`)

```typescript
import nunjucks from 'nunjucks';

class TemplateEngine {
  private env: nunjucks.Environment;

  constructor() {
    this.env = new nunjucks.Environment();
    this.registerFilters();
    this.registerGlobals();
  }

  render(template: string, data: CFRSResume, options: RenderOptions): string {
    return this.env.renderString(template, {
      resume: data,
      theme: options.theme,
      locale: options.locale,
      redaction: options.redaction,
    });
  }

  private registerFilters() {
    // Date formatting
    this.env.addFilter('date', (str, format) => {
      // Format date using locale
    });

    // Markdown to HTML
    this.env.addFilter('markdown', (str) => {
      // Convert markdown to HTML
    });

    // Redact PII
    this.env.addFilter('redact', (str, profile) => {
      // Apply redaction rules
    });
  }
}
```

#### 3.6.2 Theme Manager (`theme-manager.ts`)

```typescript
interface Theme {
  id: string;
  name: string;
  version: string;
  template: string;
  styles: string;
  metadata: ThemeMetadata;
}

class ThemeManager {
  private themes: Map<string, Theme> = new Map();

  async loadTheme(themeId: string): Promise<Theme> {
    // Load from /themes/{themeId}/
    // Validate CSP compliance (no inline JS)
    // Cache in memory
  }

  getAvailableThemes(): ThemeMetadata[] {
    // Return theme registry
  }

  renderWithTheme(themeId: string, data: CFRSResume): string {
    const theme = this.themes.get(themeId);
    const html = this.templateEngine.render(theme.template, data);
    return this.wrapWithStyles(html, theme.styles);
  }
}
```

#### 3.6.3 Preview Component (`preview.tsx`)

```typescript
function Preview() {
  const resume = useStore((s) => s.current);
  const theme = useStore((s) => s.selectedTheme);
  const mode = useStore((s) => s.previewMode);

  const html = useMemo(() => {
    if (!resume) return '';
    return themeManager.renderWithTheme(theme, resume);
  }, [resume, theme]);

  return (
    <div className={`preview preview--${mode}`}>
      <iframe
        srcDoc={html}
        sandbox="allow-same-origin"
        title="Resume Preview"
      />
    </div>
  );
}
```

**Rendering Performance:**

```typescript
// Optimization strategies:
// 1. Debounced rendering (300ms after last change)
// 2. Virtual DOM diffing (only update changed sections)
// 3. Lazy load themes (on-demand)
// 4. Web Worker for heavy templates
// 5. Progressive rendering for long resumes

const useDebouncedRender = (resume: CFRSResume, delay = 300) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHtml(render(resume));
    }, delay);

    return () => clearTimeout(timer);
  }, [resume, delay]);

  return html;
};
```

---

### 3.7 Export Pipeline

**Location:** `/apps/web/src/export/`

**Supported Formats:**

```typescript
type ExportFormat =
  | 'cfrs-json' // CFRS native format
  | 'json-resume' // JSON Resume v1.2.1
  | 'fresh-json' // FRESH format
  | 'markdown' // Markdown with frontmatter
  | 'html' // Standalone HTML (theme embedded)
  | 'pdf'; // Print to PDF (browser native)

interface Exporter {
  export(resume: CFRSResume, format: ExportFormat, options: ExportOptions): Blob;
}
```

#### 3.7.1 Export Workflow

```
User clicks "Export" → Format selection → Options dialog → Transform → Download
                                                                ↓
                                                         Validation check
                                                                ↓
                                                    Privacy check (redaction)
```

#### 3.7.2 Format Exporters

**JSON Exporters:**

```typescript
class JSONExporter implements Exporter {
  export(resume: CFRSResume, format: ExportFormat): Blob {
    let data: unknown;

    switch (format) {
      case 'cfrs-json':
        data = resume;
        break;
      case 'json-resume':
        data = schemaMapper.toJRS(resume);
        break;
      case 'fresh-json':
        data = schemaMapper.toFRESH(resume);
        break;
    }

    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }
}
```

**Markdown Exporter:**

```typescript
class MarkdownExporter implements Exporter {
  export(resume: CFRSResume, options: ExportOptions): Blob {
    const frontmatter = this.generateFrontmatter(resume);
    const body = this.generateBody(resume);

    const markdown = `---
${frontmatter}
---

${body}`;

    return new Blob([markdown], { type: 'text/markdown' });
  }

  private generateBody(resume: CFRSResume): string {
    return `# ${resume.header.name}

${resume.summary.content}

## Experience

${resume.experience
  .map(
    (exp) => `
### ${exp.title} at ${exp.company}
${exp.startDate} - ${exp.endDate || 'Present'}

${exp.highlights.map((h) => `- ${h}`).join('\n')}
`
  )
  .join('\n')}

// ... etc
`;
  }
}
```

**HTML Exporter:**

```typescript
class HTMLExporter implements Exporter {
  export(resume: CFRSResume, options: ExportOptions): Blob {
    const theme = themeManager.getTheme(options.theme);
    const html = this.generateStandaloneHTML(resume, theme);

    return new Blob([html], { type: 'text/html' });
  }

  private generateStandaloneHTML(resume: CFRSResume, theme: Theme): string {
    const body = templateEngine.render(theme.template, resume);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.header.name} - Resume</title>
  <style>${theme.styles}</style>
</head>
<body>
  ${body}
</body>
</html>`;
  }
}
```

**PDF Export (Print Dialog):**

```typescript
class PDFExporter implements Exporter {
  export(resume: CFRSResume, options: ExportOptions): void {
    // Generate print-optimized HTML
    const html = htmlExporter.export(resume, {
      ...options,
      printOptimized: true,
    });

    // Open in new window with print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html.text());
    printWindow.document.close();

    // Trigger print after load
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  }
}
```

---

## 4. PERFORMANCE ARCHITECTURE

### 4.1 Performance Budget

```
Target: <3s load time on 3G (1.5 Mbps)

Budget allocation:
- Core bundle: 150 KB (gzip)
- Theme assets: 50 KB per theme
- Fonts: 100 KB (subset, woff2)
- Total first load: <300 KB

Time budget:
- Initial HTML: 500ms
- JS parse/execute: 1000ms
- First render: 1500ms
- Interactive: 2500ms
- Full load: 3000ms
```

### 4.2 Optimization Strategies

**Code Splitting:**

```typescript
// Route-based splitting
const Import = lazy(() => import('./pages/Import'));
const Edit = lazy(() => import('./pages/Edit'));
const Preview = lazy(() => import('./pages/Preview'));
const Export = lazy(() => import('./pages/Export'));

// Feature-based splitting
const DocxImporter = lazy(() => import('./importers/docx-importer'));
const JRSAdapter = lazy(() => import('./render/jrs-adapter'));

// Theme lazy loading
const loadTheme = (themeId: string) => {
  return import(`./themes/${themeId}/index.js`);
};
```

**Caching Strategy:**

```typescript
// Service Worker caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cfrs-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/app.css',
        '/themes/classic/index.js',
        '/schemas/cfrs.schema.json',
      ]);
    })
  );
});

// Cache-first for schemas, network-first for themes
const cacheStrategy = {
  schemas: 'cache-first', // Immutable
  themes: 'network-first', // May update
  app: 'stale-while-revalidate',
};
```

**Rendering Optimization:**

```typescript
// Virtual scrolling for long resumes
import { VirtualList } from 'react-virtual';

function ExperienceList({ items }: { items: Experience[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated item height
  });

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div key={item.key} style={{ height: item.size }}>
            <ExperienceItem data={items[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Memoization for expensive computations
const useComputedFields = (resume: CFRSResume) => {
  return useMemo(() => ({
    totalYearsExperience: calculateYears(resume.experience),
    skillCategories: categorizeSkills(resume.skills),
    completionScore: calculateScore(resume),
  }), [resume]);
};
```

**Bundle Analysis:**

```bash
# Run bundle analyzer
npm run build -- --analyze

# Output reports:
# - bundle-stats.html
# - chunk-graph.html
# - duplicate-deps.json

# CI check for bundle size
if [ $(stat -f%z dist/app.js) -gt 153600 ]; then
  echo "Bundle size exceeded 150KB limit"
  exit 1
fi
```

---

### 4.3 Performance Monitoring

```typescript
// Web Vitals tracking
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function reportWebVitals(metric: Metric) {
  // Log to analytics (client-side only)
  console.log(metric);

  // Store in localStorage for debugging
  const vitals = JSON.parse(localStorage.getItem('web-vitals') || '[]');
  vitals.push({
    name: metric.name,
    value: metric.value,
    timestamp: Date.now(),
  });
  localStorage.setItem('web-vitals', JSON.stringify(vitals.slice(-10)));
}

onCLS(reportWebVitals);
onFID(reportWebVitals);
onLCP(reportWebVitals);
onFCP(reportWebVitals);
onTTFB(reportWebVitals);

// Custom performance marks
performance.mark('import-start');
await importResume(file);
performance.mark('import-end');
performance.measure('import-duration', 'import-start', 'import-end');
```

---

## 5. ERROR HANDLING STRATEGY

### 5.1 Error Taxonomy

```typescript
// Error hierarchy
abstract class CFRSError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'fatal' | 'error' | 'warning' | 'info'
  ) {
    super(message);
  }
}

class ImportError extends CFRSError {
  constructor(
    message: string,
    public format: string,
    public originalError?: Error
  ) {
    super(message, 'IMPORT_ERROR', 'error');
  }
}

class ValidationError extends CFRSError {
  constructor(
    message: string,
    public field: string,
    public value?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', 'error');
  }
}

class RenderError extends CFRSError {
  constructor(
    message: string,
    public theme: string
  ) {
    super(message, 'RENDER_ERROR', 'error');
  }
}

class ExportError extends CFRSError {
  constructor(
    message: string,
    public format: string
  ) {
    super(message, 'EXPORT_ERROR', 'error');
  }
}
```

### 5.2 Error Recovery

```typescript
// Error boundary for React components
class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service (client-side)
    console.error('Component error:', error, errorInfo);

    // Attempt recovery
    if (error instanceof ValidationError) {
      // Show validation UI
      this.props.onValidationError(error);
    } else {
      // Show generic error UI
      this.setState({ hasError: true, error });
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Async error handling
async function safeImport(file: File): Promise<ImportResult> {
  try {
    return await importOrchestrator.import({ type: 'file', file });
  } catch (error) {
    if (error instanceof ImportError) {
      // Show user-friendly message
      return {
        success: false,
        errors: [error],
        metadata: { format: error.format },
      };
    }

    // Unknown error - show generic message
    return {
      success: false,
      errors: [new ImportError('Unknown error occurred', 'unknown', error)],
      metadata: {},
    };
  }
}
```

### 5.3 User Feedback

```typescript
// Error display component
function ValidationErrorDisplay({ errors }: { errors: ValidationError[] }) {
  const grouped = groupBy(errors, (e) => e.field);

  return (
    <div className="validation-errors">
      {Object.entries(grouped).map(([field, fieldErrors]) => (
        <div key={field} className="error-group">
          <h4>{field}</h4>
          <ul>
            {fieldErrors.map((error, i) => (
              <li key={i} className={`error-${error.severity}`}>
                {error.message}
                {error.suggestion && (
                  <button onClick={() => applySuggestion(error.suggestion)}>
                    Apply suggestion
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Toast notifications for non-blocking errors
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Toast) => {
    setToasts((prev) => [...prev, { ...toast, id: Date.now() }]);

    // Auto-dismiss after 5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 5000);
  };

  return { toasts, addToast };
}
```

---

## 6. DATA FLOW DIAGRAMS

### 6.1 Import Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER UPLOADS FILE                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Read File API  │
                    │ - FileReader   │
                    │ - Blob parsing │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │ Format Detection   │
                    │ - MIME type        │
                    │ - Extension        │
                    │ - Content analysis │
                    └────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
         ┌─────────────┐          ┌─────────────┐
         │ JSON?       │          │ Text-based? │
         └──────┬──────┘          └──────┬──────┘
                │                        │
                ▼                        ▼
         ┌─────────────┐          ┌─────────────┐
         │ JSON Parser │          │ Text Parser │
         └──────┬──────┘          └──────┬──────┘
                │                        │
                ▼                        ▼
         ┌─────────────┐          ┌─────────────┐
         │ Schema      │          │ Heuristic   │
         │ Detection   │          │ Analysis    │
         │ - CFRS?     │          │ - Markdown? │
         │ - JRS?      │          │ - Plain?    │
         └──────┬──────┘          └──────┬──────┘
                │                        │
                └────────────┬───────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Importer       │
                    │ Selection      │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Parse & Map    │
                    │ to CFRS        │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Normalize      │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Validate       │
                    └────────┬───────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              ┌──────────┐      ┌──────────┐
              │ Valid    │      │ Errors   │
              └────┬─────┘      └────┬─────┘
                   │                 │
                   ▼                 ▼
            ┌─────────────┐    ┌──────────────┐
            │ Store in    │    │ Show Error   │
            │ State       │    │ UI           │
            └─────────────┘    └──────────────┘
```

### 6.2 Render Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────────┐
│                   RESUME DATA IN STATE                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ User Selects   │
                    │ Theme          │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Load Theme     │
                    │ - Template     │
                    │ - Styles       │
                    │ - Metadata     │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Validate Theme │
                    │ - CSP check    │
                    │ - Schema check │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │ Apply Transformations  │
                    │ - Redaction            │
                    │ - Localization         │
                    │ - Date formatting      │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Nunjucks       │
                    │ Template       │
                    │ Rendering      │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Apply Styles   │
                    │ (CSS injection)│
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Sanitize HTML  │
                    │ (DOMPurify)    │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Inject into    │
                    │ Preview iframe │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Display to     │
                    │ User           │
                    └────────────────┘
```

### 6.3 Export Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────────┐
│                USER CLICKS "EXPORT AS..."                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Show Format    │
                    │ Selection UI   │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │ Show Options Dialog│
                    │ - Redaction        │
                    │ - Locale           │
                    │ - Theme (HTML/PDF) │
                    └────────┬───────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Validate Data  │
                    └────────┬───────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
           ┌──────────────┐      ┌──────────────┐
           │ Valid        │      │ Invalid      │
           └──────┬───────┘      └──────┬───────┘
                  │                     │
                  ▼                     ▼
        ┌──────────────────┐    ┌──────────────┐
        │ Apply            │    │ Show Errors  │
        │ Transformations  │    │ Block Export │
        │ - Redaction      │    └──────────────┘
        │ - Schema mapping │
        └────────┬─────────┘
                 │
        ┌────────┴─────────────────────┐
        │                              │
        ▼                              ▼
  ┌──────────┐                  ┌──────────────┐
  │ JSON?    │                  │ HTML/PDF?    │
  └────┬─────┘                  └──────┬───────┘
       │                               │
       ▼                               ▼
  ┌──────────────┐              ┌──────────────┐
  │ Schema Map   │              │ Render with  │
  │ - CFRS       │              │ Theme        │
  │ - JRS        │              └──────┬───────┘
  │ - FRESH      │                     │
  └──────┬───────┘                     ▼
         │                       ┌──────────────┐
         ▼                       │ Generate     │
  ┌──────────────┐              │ Standalone   │
  │ JSON.        │              │ HTML         │
  │ stringify    │              └──────┬───────┘
  └──────┬───────┘                     │
         │                             ▼
         │                       ┌──────────────┐
         │                       │ PDF?         │
         │                       └──────┬───────┘
         │                              │
         │                              ▼
         │                       ┌──────────────┐
         │                       │ Open Print   │
         │                       │ Dialog       │
         │                       └──────┬───────┘
         │                              │
         └──────────┬───────────────────┘
                    │
                    ▼
           ┌────────────────┐
           │ Create Blob    │
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │ Trigger        │
           │ Download       │
           └────────────────┘
```

---

## 7. CRITICAL OPTIMIZATION POINTS

### 7.1 Import Bottlenecks

**Problem:** Large Docx files (>5MB) slow parsing

**Solution:**

```typescript
// Web Worker for heavy parsing
// /workers/docx-parser.worker.ts
import mammoth from 'mammoth';

self.addEventListener('message', async (e) => {
  const { file } = e.data;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    self.postMessage({ success: true, text: result.value });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
});

// Main thread usage
const worker = new Worker('./docx-parser.worker.js');
worker.postMessage({ file });
worker.addEventListener('message', (e) => {
  if (e.data.success) {
    processText(e.data.text);
  }
});
```

### 7.2 Validation Bottlenecks

**Problem:** Real-time validation on every keystroke causes lag

**Solution:**

```typescript
// Debounced validation with partial updates
const useValidation = (resume: CFRSResume) => {
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Run validation in Web Worker
      validationWorker.postMessage({ resume });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [resume]);

  useEffect(() => {
    validationWorker.addEventListener('message', (e) => {
      setResult(e.data.result);
    });
  }, []);

  return result;
};

// Incremental validation (only changed fields)
class IncrementalValidator {
  private cache = new Map<string, ValidationResult>();

  validate(resume: CFRSResume, changedPath: string): ValidationResult {
    // Only re-validate affected fields
    const affectedPaths = this.getAffectedPaths(changedPath);

    affectedPaths.forEach((path) => {
      this.cache.delete(path);
    });

    // Merge cached and new results
    return this.mergeResults();
  }
}
```

### 7.3 Render Bottlenecks

**Problem:** Re-rendering entire resume on small changes

**Solution:**

```typescript
// Granular memoization per section
function ResumeSection({ type, data }: { type: string; data: unknown }) {
  const rendered = useMemo(() => {
    return renderSection(type, data);
  }, [type, data]);

  return <div dangerouslySetInnerHTML={{ __html: rendered }} />;
}

// Only re-render changed sections
function ResumePreview({ resume }: { resume: CFRSResume }) {
  return (
    <>
      <ResumeSection type="header" data={resume.header} />
      <ResumeSection type="summary" data={resume.summary} />
      <ResumeSection type="experience" data={resume.experience} />
      <ResumeSection type="education" data={resume.education} />
      <ResumeSection type="skills" data={resume.skills} />
    </>
  );
}
```

### 7.4 Export Bottlenecks

**Problem:** Large HTML export causes memory issues

**Solution:**

```typescript
// Streaming export for large documents
async function* generateHTMLChunks(resume: CFRSResume, theme: Theme): AsyncGenerator<string> {
  yield '<!DOCTYPE html><html><head>';
  yield `<style>${theme.styles}</style>`;
  yield '</head><body>';

  for (const section of ['header', 'summary', 'experience', 'education', 'skills']) {
    yield renderSection(section, resume[section]);
  }

  yield '</body></html>';
}

// Consume stream
async function exportHTML(resume: CFRSResume, theme: Theme) {
  const chunks: string[] = [];

  for await (const chunk of generateHTMLChunks(resume, theme)) {
    chunks.push(chunk);
  }

  const blob = new Blob(chunks, { type: 'text/html' });
  downloadBlob(blob, 'resume.html');
}
```

---

## 8. STATE MANAGEMENT DETAILED

### 8.1 State Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GLOBAL STATE (Zustand)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │ Resume Slice                                          │    │
│  │ - current: CFRSResume | null                         │    │
│  │ - history: CFRSResume[]                              │    │
│  │ - validationResult: ValidationResult | null          │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │ UI Slice                                              │    │
│  │ - theme: string                                       │    │
│  │ - locale: string                                      │    │
│  │ - redactionProfile: RedactionProfile                 │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │ Import Slice                                          │    │
│  │ - isImporting: boolean                               │    │
│  │ - progress: ImportProgress                           │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │ Export Slice                                          │    │
│  │ - isExporting: boolean                               │    │
│  │ - format: ExportFormat                               │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   COMPONENT STATE (React)                       │
├─────────────────────────────────────────────────────────────────┤
│  - Form inputs (temporary, not persisted)                      │
│  - UI toggles (modals, dropdowns)                             │
│  - Derived data (computed from global state)                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   URL STATE (React Router)                      │
├─────────────────────────────────────────────────────────────────┤
│  - Current route                                               │
│  - Query params (theme preview, share links)                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               LOCAL STORAGE (Persistence)                       │
├─────────────────────────────────────────────────────────────────┤
│  - User preferences (theme, locale)                            │
│  - Recent imports (metadata only, not full data)              │
│  - Performance metrics                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 State Flow Patterns

**Unidirectional Data Flow:**

```
User Action → Dispatch Action → Middleware → Reducer → New State → UI Update
                                    ↓
                              Side Effects
                                    ↓
                              - Validation
                              - Analytics
                              - Persistence
```

**Example Flow: Import Resume**

```typescript
// 1. User uploads file
function ImportPage() {
  const importResume = useStore((s) => s.importResume);

  const handleUpload = async (file: File) => {
    await importResume(file);
  };

  return <FileUpload onUpload={handleUpload} />;
}

// 2. Action dispatched
const useStore = create<State>((set, get) => ({
  importResume: async (file: File) => {
    // Update import state
    set({ isImporting: true, progress: { step: 'parsing', percent: 0 } });

    try {
      // Parse file
      const result = await importOrchestrator.import({ type: 'file', file });

      if (result.success) {
        // Update resume state
        set({
          current: result.data,
          isImporting: false,
          progress: { step: 'complete', percent: 100 },
        });

        // Trigger validation
        get().validate();
      } else {
        // Show errors
        set({
          isImporting: false,
          importErrors: result.errors,
        });
      }
    } catch (error) {
      set({ isImporting: false, importErrors: [error] });
    }
  },

  validate: async () => {
    const resume = get().current;
    if (!resume) return;

    const result = await validator.validate(resume);
    set({ validationResult: result });
  },
}));
```

### 8.3 Persistence Strategy

```typescript
// Selective persistence
const persistConfig = {
  name: 'cfrs-storage',
  version: 1,

  // Only persist these fields
  partialize: (state: State) => ({
    theme: state.theme,
    locale: state.locale,
    redactionProfile: state.redactionProfile,
    recentImports: state.recentImports,
  }),

  // Migrations for schema changes
  migrate: (persistedState: unknown, version: number) => {
    if (version === 0) {
      // Migrate from v0 to v1
      return {
        ...persistedState,
        redactionProfile: DEFAULT_REDACTION_PROFILE,
      };
    }
    return persistedState;
  },
};

const useStore = create<State>()(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    persistConfig
  )
);
```

---

## 9. DEPLOYMENT ARCHITECTURE

### 9.1 Build Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                     SOURCE CODE                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ TypeScript     │
                    │ Compilation    │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Vite Build     │
                    │ - Bundle       │
                    │ - Minify       │
                    │ - Tree shake   │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Asset          │
                    │ Optimization   │
                    │ - Images       │
                    │ - Fonts        │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Generate       │
                    │ Service Worker │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ dist/          │
                    │ - index.html   │
                    │ - app.js       │
                    │ - app.css      │
                    │ - assets/      │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Deploy to      │
                    │ GitHub Pages   │
                    └────────────────┘
```

### 9.2 GitHub Pages Configuration

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci

      - run: npm run build

      - run: npm test

      - run: npm run validate-schemas

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: resume.cloudflow.app # optional custom domain
```

### 9.3 SPA Routing on GitHub Pages

```html
<!-- dist/404.html - Fallback for client-side routing -->
<!DOCTYPE html>
<html>
  <head>
    <script>
      // Redirect 404s to index.html with path preserved
      sessionStorage.redirect = location.href;
      location.replace(location.origin);
    </script>
  </head>
  <body></body>
</html>
```

```typescript
// Restore route after redirect
// apps/web/src/main.tsx
if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  history.replaceState(null, '', redirect);
}
```

---

## 10. TESTING STRATEGY

### 10.1 Test Pyramid

```
                    ┌─────────────┐
                    │   E2E (5%)  │
                    │  Playwright │
                    └─────────────┘
                  ┌───────────────────┐
                  │ Integration (15%) │
                  │ Component tests   │
                  └───────────────────┘
              ┌─────────────────────────────┐
              │    Unit Tests (80%)         │
              │  - Importers                │
              │  - Validators               │
              │  - Transformers             │
              │  - Exporters                │
              └─────────────────────────────┘
```

### 10.2 Test Coverage by Module

```typescript
// Import tests
describe('JSONImporter', () => {
  it('should parse valid CFRS JSON', async () => {
    const input = {
      /* CFRS data */
    };
    const result = await jsonImporter.import(input);
    expect(result.success).toBe(true);
    expect(result.data).toMatchSchema(cfrsSchema);
  });

  it('should convert JSON Resume to CFRS', async () => {
    const jrs = {
      /* JSON Resume data */
    };
    const result = await jsonImporter.import(jrs);
    expect(result.data).toMatchObject({
      header: { name: jrs.basics.name },
      contact: { email: jrs.basics.email },
    });
  });

  it('should handle malformed JSON gracefully', async () => {
    const invalid = '{ invalid json';
    const result = await jsonImporter.import(invalid);
    expect(result.success).toBe(false);
    expect(result.errors[0].code).toBe('PARSE_ERROR');
  });
});

// Validation tests
describe('Validator', () => {
  it('should validate required fields', () => {
    const incomplete = { header: {} }; // Missing name
    const result = validator.validate(incomplete);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ field: 'header.name' }));
  });

  it('should validate date logic', () => {
    const invalid = {
      experience: [
        {
          startDate: '2023-01-01',
          endDate: '2022-01-01', // End before start
        },
      ],
    };
    const result = validator.validate(invalid);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: 'INVALID_DATE_RANGE' }));
  });
});

// Render tests
describe('TemplateEngine', () => {
  it('should render with theme', () => {
    const resume = {
      /* CFRS data */
    };
    const theme = { template: '<h1>{{ resume.header.name }}</h1>' };
    const html = engine.render(theme.template, resume);
    expect(html).toContain('<h1>John Doe</h1>');
  });

  it('should apply filters', () => {
    const template = '{{ "2023-01-01" | date("MM/DD/YYYY") }}';
    const html = engine.render(template, {});
    expect(html).toBe('01/01/2023');
  });
});

// Export tests
describe('Exporters', () => {
  it('should export to JSON Resume format', () => {
    const cfrs = {
      /* CFRS data */
    };
    const blob = jsonResumeExporter.export(cfrs);
    const json = JSON.parse(await blob.text());
    expect(json).toHaveProperty('basics');
    expect(json).toHaveProperty('work');
  });
});
```

### 10.3 E2E Test Scenarios

```typescript
// e2e/import-export.spec.ts
import { test, expect } from '@playwright/test';

test('complete import-edit-export flow', async ({ page }) => {
  await page.goto('/');

  // Import JSON file
  await page.setInputFiles('input[type="file"]', 'fixtures/resume.json');
  await expect(page.locator('.preview')).toBeVisible();

  // Validate imported data
  await expect(page.locator('.validation-status')).toHaveText('Valid');

  // Edit a field
  await page.locator('input[name="header.name"]').fill('Jane Doe');

  // Preview updates
  await expect(page.locator('.preview')).toContainText('Jane Doe');

  // Export as JSON Resume
  await page.selectOption('select[name="export-format"]', 'json-resume');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:text("Export")'),
  ]);

  // Verify downloaded file
  const content = await download.path();
  const json = JSON.parse(await fs.readFile(content, 'utf-8'));
  expect(json.basics.name).toBe('Jane Doe');
});
```

---

## 11. SECURITY CONSIDERATIONS

### 11.1 Content Security Policy

```html
<!-- Strict CSP for GitHub Pages -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
"
/>
```

### 11.2 Theme Sandboxing

```typescript
// Validate theme has no JavaScript
function validateTheme(theme: Theme): ValidationResult {
  const errors: ValidationError[] = [];

  // Check for script tags
  if (/<script/i.test(theme.template)) {
    errors.push({
      field: 'template',
      message: 'Script tags are not allowed in themes',
      code: 'UNSAFE_SCRIPT',
    });
  }

  // Check for event handlers
  if (/on\w+\s*=/i.test(theme.template)) {
    errors.push({
      field: 'template',
      message: 'Event handlers are not allowed in themes',
      code: 'UNSAFE_EVENT_HANDLER',
    });
  }

  // Check for javascript: URLs
  if (/javascript:/i.test(theme.template)) {
    errors.push({
      field: 'template',
      message: 'JavaScript URLs are not allowed',
      code: 'UNSAFE_URL',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Sanitize rendered HTML
import DOMPurify from 'dompurify';

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'ul', 'li', 'strong', 'em', 'a', 'div', 'span'],
    ALLOWED_ATTR: ['class', 'href', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}
```

### 11.3 Input Sanitization

```typescript
// Sanitize user input before processing
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/javascript:/gi, '') // Remove JS protocols
    .trim()
    .slice(0, 10000); // Limit length
}

// Validate file uploads
function validateFile(file: File): ValidationResult {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/json',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (file.size > MAX_SIZE) {
    return { valid: false, errors: [{ message: 'File too large' }] };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, errors: [{ message: 'Invalid file type' }] };
  }

  return { valid: true, errors: [] };
}
```

---

## 12. ACCESSIBILITY ARCHITECTURE

### 12.1 WCAG AA Compliance

```typescript
// Keyboard navigation support
function useKeyboardNav() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: Save/Export
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportResume();
      }

      // Ctrl+Z: Undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }

      // Ctrl+Shift+Z: Redo
      if (e.ctrlKey && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// ARIA labels
function ImportButton() {
  return (
    <button
      aria-label="Import resume from file"
      aria-describedby="import-help"
    >
      Import
      <span id="import-help" className="sr-only">
        Upload a JSON, Markdown, or Word document
      </span>
    </button>
  );
}

// Focus management
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Trap focus inside modal
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  return isOpen ? (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      {children}
    </div>
  ) : null;
}
```

### 12.2 Screen Reader Support

```typescript
// Live region for status updates
function ImportStatus({ status }: { status: ImportProgress }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {status.step}: {status.percent}%
    </div>
  );
}

// Descriptive error messages
function ValidationErrors({ errors }: { errors: ValidationError[] }) {
  return (
    <div role="alert" aria-live="assertive">
      <h3>Validation Errors ({errors.length})</h3>
      <ul>
        {errors.map((error, i) => (
          <li key={i}>
            <strong>{error.field}:</strong> {error.message}
            {error.suggestion && (
              <button
                aria-label={`Apply suggestion: ${error.suggestion}`}
                onClick={() => applySuggestion(error.suggestion)}
              >
                Apply
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 13. MONITORING & ANALYTICS

### 13.1 Performance Monitoring

```typescript
// Client-side performance tracking
class PerformanceMonitor {
  private metrics: Metric[] = [];

  track(name: string, duration: number, metadata?: Record<string, unknown>) {
    const metric: Metric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);

    // Log to console in dev
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] ${name}: ${duration}ms`, metadata);
    }

    // Store in localStorage for debugging
    this.persist();
  }

  private persist() {
    const recent = this.metrics.slice(-100); // Keep last 100
    localStorage.setItem('perf-metrics', JSON.stringify(recent));
  }

  getReport(): PerformanceReport {
    return {
      avgImportTime: this.avg('import'),
      avgRenderTime: this.avg('render'),
      avgExportTime: this.avg('export'),
      p95ImportTime: this.percentile('import', 95),
    };
  }

  private avg(name: string): number {
    const values = this.metrics.filter((m) => m.name === name).map((m) => m.duration);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}

// Usage
const perfMonitor = new PerformanceMonitor();

async function importResume(file: File) {
  const start = performance.now();

  const result = await importOrchestrator.import({ type: 'file', file });

  const duration = performance.now() - start;
  perfMonitor.track('import', duration, {
    format: result.metadata.format,
    size: file.size,
  });

  return result;
}
```

### 13.2 Usage Analytics (Privacy-Preserving)

```typescript
// Client-side only, no external tracking
class UsageAnalytics {
  private events: AnalyticsEvent[] = [];

  track(event: string, properties?: Record<string, unknown>) {
    this.events.push({
      event,
      properties,
      timestamp: Date.now(),
    });

    this.persist();
  }

  private persist() {
    const recent = this.events.slice(-1000);
    localStorage.setItem('analytics', JSON.stringify(recent));
  }

  getInsights(): Insights {
    return {
      mostUsedFormat: this.getMostFrequent('import', 'format'),
      mostUsedTheme: this.getMostFrequent('theme-select', 'theme'),
      avgSessionDuration: this.getAvgSessionDuration(),
    };
  }
}

// Usage
const analytics = new UsageAnalytics();

// Track feature usage
analytics.track('import', { format: 'json' });
analytics.track('theme-select', { theme: 'classic' });
analytics.track('export', { format: 'pdf' });
```

---

## 14. IMPLEMENTATION ROADMAP

### Phase 0: Foundation (Week 1-2)

```
Tasks:
1. Set up project structure
2. Create CFRS schema v1
3. Create mapping tables (CFRS↔JRS, CFRS↔FRESH)
4. Implement basic Zustand store
5. Set up Vite + TypeScript + React

Deliverables:
- /schemas/cfrs.schema.json
- /schemas/cfrs-to-jrs.json
- /schemas/cfrs-to-fresh.json
- /apps/web/src/store/index.ts
- Build pipeline
```

### Phase 1: Import Pipeline (Week 3-4)

```
Tasks:
1. Implement ImportOrchestrator
2. Implement JSONImporter (CFRS + JRS detection)
3. Implement MarkdownImporter
4. Implement basic validation
5. Create import UI

Deliverables:
- /apps/web/src/orchestrator/import-orchestrator.ts
- /apps/web/src/importers/json-importer.ts
- /apps/web/src/importers/markdown-importer.ts
- /apps/web/src/validation/validator.ts
- Import page UI
```

### Phase 2: Render Pipeline (Week 5-6)

```
Tasks:
1. Implement Nunjucks template engine
2. Create 2 base themes (Classic, Modern)
3. Implement ThemeManager
4. Create preview component
5. Add live editing

Deliverables:
- /apps/web/src/render/template-engine.ts
- /apps/web/src/render/theme-manager.ts
- /themes/classic/
- /themes/modern/
- Preview page UI
```

### Phase 3: Export Pipeline (Week 7)

```
Tasks:
1. Implement JSON exporters (CFRS, JRS, FRESH)
2. Implement Markdown exporter
3. Implement HTML exporter
4. Implement PDF export (print dialog)
5. Create export UI

Deliverables:
- /apps/web/src/export/json-exporter.ts
- /apps/web/src/export/markdown-exporter.ts
- /apps/web/src/export/html-exporter.ts
- Export dialog UI
```

### Phase 4: Extended Importers (Week 8-9)

```
Tasks:
1. Implement DocxImporter (mammoth.js)
2. Implement PlainTextImporter (wizard)
3. Add import progress UI
4. Improve error handling

Deliverables:
- /apps/web/src/importers/docx-importer.ts
- /apps/web/src/importers/text-importer.ts
- Wizard UI for text import
```

### Phase 5: Polish & Deploy (Week 10)

```
Tasks:
1. Performance optimization
2. A11y audit and fixes
3. E2E tests
4. GitHub Pages deployment
5. Documentation

Deliverables:
- Performance report
- A11y audit report
- E2E test suite
- Deployed app
- User documentation
```

---

## 15. SUCCESS METRICS

### 15.1 Performance Metrics

```
✅ Load time <3s on 3G
✅ First Contentful Paint <1.5s
✅ Time to Interactive <2.5s
✅ Largest Contentful Paint <2.5s
✅ Cumulative Layout Shift <0.1
✅ First Input Delay <100ms
```

### 15.2 Quality Metrics

```
✅ Test coverage >80%
✅ Zero critical security issues
✅ WCAG AA compliance (axe-core 0 violations)
✅ Lighthouse score >90 (all categories)
✅ Bundle size <300KB (initial load)
✅ Schema validation 100% pass rate
```

### 15.3 Functional Metrics

```
✅ Import success rate >95%
✅ Validation accuracy >99%
✅ Export format compatibility 100%
✅ Theme rendering success 100%
✅ Zero data loss
```

---

## APPENDIX A: DATA STRUCTURES

### CFRS Resume Structure

```typescript
interface CFRSResume {
  $schema: string; // Schema version

  header: {
    name: string;
    title?: string;
    image?: string;
  };

  contact: {
    email: string;
    phone?: string;
    location?: {
      city?: string;
      region?: string;
      country?: string;
    };
    links?: Array<{
      type: 'linkedin' | 'github' | 'website' | 'other';
      url: string;
      label?: string;
    }>;
  };

  summary: {
    content: string;
    highlights?: string[];
  };

  experience: Array<{
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string; // ISO 8601
    endDate?: string; // ISO 8601 or null for current
    highlights: string[];
    technologies?: string[];
  }>;

  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    achievements?: string[];
  }>;

  skills: Array<{
    category: string;
    items: Array<{
      name: string;
      level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      years?: number;
    }>;
  }>;

  projects?: Array<{
    id: string;
    name: string;
    description: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    highlights?: string[];
    technologies?: string[];
  }>;

  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date?: string;
    url?: string;
  }>;

  languages?: Array<{
    language: string;
    fluency: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;

  x_cfrs_metadata?: {
    version: string;
    created: string;
    modified: string;
    [key: string]: unknown; // Additional extensions
  };
}
```

---

## APPENDIX B: MAPPING TABLES

### CFRS → JSON Resume Mapping

```json
{
  "header.name": "basics.name",
  "header.title": "basics.label",
  "header.image": "basics.image",
  "contact.email": "basics.email",
  "contact.phone": "basics.phone",
  "contact.location": "basics.location",
  "contact.links": "basics.profiles",
  "summary.content": "basics.summary",
  "experience": "work",
  "experience[].title": "work[].position",
  "experience[].company": "work[].name",
  "experience[].startDate": "work[].startDate",
  "experience[].endDate": "work[].endDate",
  "experience[].highlights": "work[].highlights",
  "education": "education",
  "skills": "skills",
  "projects": "projects",
  "certifications": "certificates",
  "languages": "languages"
}
```

---

## CONCLUSION

This data flow architecture provides a comprehensive blueprint for implementing the CloudFlow Resume System. Key highlights:

1. **Modular Pipeline Design**: Each stage (import, validate, transform, render, export) is isolated and testable
2. **Performance-First**: Optimization strategies built in from the start
3. **Privacy-Preserving**: 100% client-side processing with no server dependencies
4. **Extensible**: Plugin architecture for importers, themes, and exporters
5. **Resilient**: Comprehensive error handling and recovery strategies
6. **Accessible**: WCAG AA compliance and keyboard navigation support

The architecture supports the project's core principles while providing a solid foundation for future enhancements and community contributions.

---

**Next Steps:**

1. Review and approve architecture
2. Create GitHub issues for each implementation phase
3. Begin Phase 0 implementation
4. Set up CI/CD pipeline
5. Create development guidelines

**Questions or Feedback:**
This architecture is designed to be iterated upon. Please provide feedback on:

- Performance targets
- Technology choices
- Module boundaries
- Testing strategy
- Deployment approach
