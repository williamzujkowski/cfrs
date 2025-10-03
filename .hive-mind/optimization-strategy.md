# CloudFlow Resume - Performance Optimization Strategy

**Agent:** OPTIMIZER
**Version:** 1.0.0
**Date:** 2025-10-03
**Target:** <3s load time on 3G, Lighthouse ≥90
**Status:** AUTHORITATIVE SPECIFICATION

---

## Executive Summary

This document defines the complete performance optimization strategy for CloudFlow Resume (CFRS), targeting sub-3-second load times on 3G networks while maintaining Lighthouse scores ≥90 across all categories. The strategy leverages Vite's advanced bundling, aggressive code splitting, optimized asset delivery, and progressive enhancement patterns.

**Critical Performance Targets:**
- **Initial Load (3G):** <3s to First Contentful Paint (FCP)
- **Time to Interactive (3G):** <5s
- **Total Bundle Size:** <200KB (gzipped, initial load)
- **Lighthouse Scores:** ≥90 (Performance, Accessibility, Best Practices, SEO)
- **3G Bandwidth:** 400Kbps download, 400ms RTT

---

## 1. Bundle Optimization Strategy

### 1.1 Bundle Size Budgets

**Critical Path Bundles (must load first):**
```
vendor.js          → 80KB  (gzipped) - React/Preact core, router
main.js            → 40KB  (gzipped) - App shell, critical UI
critical.css       → 15KB  (gzipped) - Above-fold styles
Total Critical     → 135KB (gzipped)
```

**Deferred Bundles (lazy loaded):**
```
importers/json.js     → 8KB   - JSON importer
importers/markdown.js → 25KB  - Markdown parser (marked.js)
importers/docx.js     → 45KB  - Docx parser (mammoth.js)
importers/plaintext.js→ 12KB  - Plaintext heuristics
render-engine.js      → 35KB  - Nunjucks + template compiler
themes/classic.js     → 10KB  - Classic theme bundle
themes/modern.js      → 12KB  - Modern theme bundle
schema-validator.js   → 30KB  - JSON Schema validator (Ajv)
export-handlers.js    → 15KB  - Export formatters
```

**Per-Route Budgets:**
```
/                 → 135KB (app shell only)
/import           → 135KB + 8-45KB (importer on-demand)
/edit             → 135KB + 30KB (validator + render preview)
/export           → 135KB + 15KB (export handlers)
/theme-preview    → 135KB + 35KB + 10-12KB (engine + theme)
```

### 1.2 Code Splitting Strategy

**Implementation via Vite:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk - core framework only
          'vendor': [
            'preact',
            'preact/hooks',
            'wouter' // lightweight router
          ],

          // Separate chunks for heavy importers
          'importer-markdown': [
            'marked',
            'turndown'
          ],
          'importer-docx': [
            'mammoth'
          ],

          // Render engine separated
          'render': [
            'nunjucks',
            './src/render/engine.ts'
          ],

          // Schema validation
          'validator': [
            'ajv',
            'ajv-formats'
          ]
        },
        // Optimize chunk naming for caching
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },

    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Chunk size warning threshold
    chunkSizeWarningLimit: 500
  }
})
```

### 1.3 Tree Shaking Optimization

**Package.json sideEffects configuration:**
```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.ts"
  ]
}
```

**Import patterns to enforce:**
```typescript
// ✅ CORRECT - Named imports enable tree shaking
import { validateCFRS } from './schema/validator';

// ❌ WRONG - Barrel imports prevent tree shaking
import * as schema from './schema';

// ✅ CORRECT - Conditional imports for polyfills
const loadPolyfills = async () => {
  if (!window.IntersectionObserver) {
    await import('intersection-observer');
  }
};
```

**Enforced via ESLint rule:**
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['**/index'],
        message: 'Avoid barrel imports - import directly from source files'
      }]
    }]
  }
};
```

---

## 2. Asset Optimization Strategy

### 2.1 CSS Optimization

**Critical CSS Strategy:**
```html
<!-- Inline critical CSS in index.html (≤14KB) -->
<style>
  /* App shell, above-fold layout */
  /* Generated via critical package during build */
</style>

<!-- Preload non-critical CSS -->
<link rel="preload" href="/assets/main.css" as="style"
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/assets/main.css"></noscript>
```

**CSS Processing Pipeline:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import postcss from 'postcss';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('postcss-import'),
        require('postcss-nesting'),
        require('autoprefixer'),
        require('cssnano')({
          preset: ['advanced', {
            discardComments: { removeAll: true },
            reduceIdents: true,
            zindex: false, // Don't optimize z-index (can break stacking)
            normalizeWhitespace: true
          }]
        })
      ]
    },

    // CSS modules for component styles
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[hash:base64:8]'
    }
  }
});
```

**CSS Architecture:**
```
styles/
├── critical.css        → Inlined in HTML (app shell)
├── base.css            → Typography, resets (12KB)
├── components/         → Per-component CSS modules
│   ├── Editor.module.css
│   ├── Preview.module.css
│   └── ThemeSelector.module.css
└── themes/             → Theme stylesheets (lazy loaded)
    ├── classic.css
    └── modern.css
```

**Budget:** 15KB critical (inlined) + 25KB deferred = 40KB total CSS

### 2.2 Font Optimization

**Strategy: System fonts first, selective web fonts**

```css
/* Use system font stack for UI (zero download) */
:root {
  --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI",
             Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-mono: ui-monospace, "Cascadia Code", "Source Code Pro",
               Menlo, Monaco, monospace;
}

/* Web fonts ONLY for resume themes (lazy loaded) */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 700; /* Variable font range */
  font-display: swap;
  src: url('/fonts/inter-var.woff2') format('woff2-variations');
  unicode-range: U+0020-007F; /* Latin basic only */
}
```

**Font Loading Strategy:**
```typescript
// Load fonts only when theme is applied
const loadThemeFonts = async (themeName: string) => {
  const fontMap: Record<string, string[]> = {
    classic: ['/fonts/times-var.woff2'],
    modern: ['/fonts/inter-var.woff2'],
    creative: ['/fonts/montserrat-var.woff2']
  };

  const fonts = fontMap[themeName] || [];

  // Use Font Loading API with timeout
  const fontPromises = fonts.map(url => {
    const font = new FontFace('ThemeFont', `url(${url})`);
    return Promise.race([
      font.load(),
      new Promise((_, reject) =>
        setTimeout(() => reject('timeout'), 3000)
      )
    ]);
  });

  try {
    const loadedFonts = await Promise.allSettled(fontPromises);
    loadedFonts.forEach(result => {
      if (result.status === 'fulfilled') {
        document.fonts.add(result.value);
      }
    });
  } catch {
    // Fallback to system fonts silently
  }
};
```

**Font Budget:**
- UI fonts: 0KB (system fonts)
- Theme fonts: 40-80KB per theme (lazy loaded, variable fonts)
- Subsetting: Latin basic + Latin extended only

### 2.3 Image Optimization

**Format Strategy:**
```
Illustrations  → SVG (inline for <2KB, external for larger)
Screenshots    → WebP with JPEG fallback
Icons          → SVG sprites (inlined, <10KB total)
Theme previews → WebP thumbnails (lazy loaded)
```

**Implementation:**
```typescript
// Image component with lazy loading + format detection
const OptimizedImage: FC<{src: string, alt: string}> = ({src, alt}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <picture ref={imgRef}>
      <source type="image/webp" srcSet={loaded ? `${src}.webp` : ''} />
      <source type="image/jpeg" srcSet={loaded ? `${src}.jpg` : ''} />
      <img
        src={loaded ? `${src}.jpg` : 'data:image/svg+xml,...'}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};
```

**Build-time optimization:**
```typescript
// vite.config.ts - imagetools plugin
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: new URLSearchParams({
        format: 'webp;jpg',
        quality: '80',
        width: '800;1200;1600',
        as: 'picture'
      })
    })
  ]
});
```

**Image Budget:** <50KB images total in critical path (mostly SVG icons)

---

## 3. Lazy Loading Strategy

### 3.1 Route-based Code Splitting

```typescript
// apps/web/src/App.tsx
import { lazy, Suspense } from 'preact/compat';
import { Route, Switch } from 'wouter';

// Only app shell loads immediately
const Home = lazy(() => import('./routes/Home'));
const Import = lazy(() => import('./routes/Import'));
const Edit = lazy(() => import('./routes/Edit'));
const Export = lazy(() => import('./routes/Export'));
const ThemePreview = lazy(() => import('./routes/ThemePreview'));

const LoadingFallback = () => (
  <div class="spinner" aria-live="polite">Loading...</div>
);

export const App = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/import" component={Import} />
      <Route path="/edit" component={Edit} />
      <Route path="/export" component={Export} />
      <Route path="/preview/:theme" component={ThemePreview} />
    </Switch>
  </Suspense>
);
```

### 3.2 Theme Lazy Loading

**Theme Registry Structure:**
```typescript
// themes/registry.ts
export interface ThemeMetadata {
  id: string;
  name: string;
  category: 'ats-safe' | 'modern' | 'creative';
  thumbnail: string;
  size: number; // bytes
  loader: () => Promise<ThemeBundle>;
}

export const THEME_REGISTRY: ThemeMetadata[] = [
  {
    id: 'classic',
    name: 'Classic ATS',
    category: 'ats-safe',
    thumbnail: '/themes/classic-thumb.webp',
    size: 10240,
    loader: () => import('./classic/theme.ts')
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    category: 'modern',
    thumbnail: '/themes/modern-thumb.webp',
    size: 12288,
    loader: () => import('./modern/theme.ts')
  }
];
```

**Theme Loading with Preloading:**
```typescript
// Preload theme on hover for instant apply
const ThemeSelector: FC = () => {
  const [preloadedThemes, setPreloadedThemes] = useState<Set<string>>(new Set());

  const preloadTheme = (themeId: string) => {
    if (preloadedThemes.has(themeId)) return;

    const theme = THEME_REGISTRY.find(t => t.id === themeId);
    if (theme) {
      theme.loader(); // Triggers Vite chunk load
      setPreloadedThemes(prev => new Set(prev).add(themeId));
    }
  };

  return (
    <div class="theme-grid">
      {THEME_REGISTRY.map(theme => (
        <button
          key={theme.id}
          onMouseEnter={() => preloadTheme(theme.id)}
          onFocus={() => preloadTheme(theme.id)}
          onClick={() => applyTheme(theme.id)}
        >
          <img src={theme.thumbnail} alt={theme.name} loading="lazy" />
          <span>{theme.name}</span>
          <small>{(theme.size / 1024).toFixed(1)}KB</small>
        </button>
      ))}
    </div>
  );
};
```

### 3.3 Importer Lazy Loading

```typescript
// importers/registry.ts
export type ImporterType = 'json' | 'markdown' | 'docx' | 'plaintext';

export interface ImporterModule {
  parse: (input: string | ArrayBuffer) => Promise<CFRSResume>;
  validate: (input: unknown) => boolean;
  estimatedSize: number;
}

const IMPORTERS: Record<ImporterType, () => Promise<ImporterModule>> = {
  json: () => import('./json-importer'),
  markdown: () => import('./markdown-importer'),
  docx: () => import('./docx-importer'),
  plaintext: () => import('./plaintext-importer')
};

// Load importer only when file type is detected
export const loadImporter = async (type: ImporterType): Promise<ImporterModule> => {
  const start = performance.now();
  const module = await IMPORTERS[type]();

  console.info(`Loaded ${type} importer in ${performance.now() - start}ms`);
  return module;
};
```

### 3.4 Schema Validator Lazy Loading

```typescript
// Only load Ajv when validation is needed (not on initial load)
const lazyValidator = {
  _instance: null as null | typeof import('./validator'),

  async validate(data: unknown): Promise<ValidationResult> {
    if (!this._instance) {
      this._instance = await import('./validator');
    }
    return this._instance.validateCFRS(data);
  }
};

// Usage in components
const Editor: FC = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleValidate = async () => {
    const result = await lazyValidator.validate(resumeData);
    setErrors(result.errors);
  };

  // Auto-validate with debounce
  useEffect(() => {
    const timer = setTimeout(() => handleValidate(), 500);
    return () => clearTimeout(timer);
  }, [resumeData]);
};
```

---

## 4. Caching Strategy

### 4.1 Service Worker Architecture

**Cache Layers:**
```
Layer 1: App Shell     → Cache-first (HTML, JS, CSS, fonts)
Layer 2: Themes        → Cache-first with network fallback
Layer 3: User Data     → Network-only (no caching)
Layer 4: Static Assets → Stale-while-revalidate
```

**Service Worker Implementation (Workbox):**
```typescript
// apps/web/src/sw.ts
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precache app shell (generated by Vite)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// App shell - cache first
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new CacheFirst({
    cacheName: 'app-shell-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] })
    ]
  })
);

// Static assets - stale while revalidate
registerRoute(
  ({ request }) => ['style', 'script', 'font'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'static-assets-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Themes - cache first with 7-day expiry
registerRoute(
  ({ url }) => url.pathname.startsWith('/themes/'),
  new CacheFirst({
    cacheName: 'themes-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
);

// API/user data - network only (no caching)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkOnly()
);

// Background sync for offline exports
self.addEventListener('sync', (event) => {
  if (event.tag === 'export-resume') {
    event.waitUntil(syncExportQueue());
  }
});
```

**Vite PWA Plugin Configuration:**
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],

      manifest: {
        name: 'CloudFlow Resume',
        short_name: 'CFRS',
        description: 'Privacy-focused resume builder',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
```

### 4.2 LocalStorage Strategy

**Data Storage Architecture:**
```typescript
// Maximum 5MB allocation across all storage
const STORAGE_BUDGETS = {
  resumeData: 2 * 1024 * 1024,    // 2MB - user resume JSON
  drafts: 1 * 1024 * 1024,        // 1MB - auto-saved drafts
  preferences: 100 * 1024,        // 100KB - user settings
  themeCache: 500 * 1024,         // 500KB - compiled theme cache
  exportHistory: 400 * 1024       // 400KB - recent exports
};

class StorageManager {
  private readonly prefix = 'cfrs:';

  async set(key: string, value: unknown, budget: number): Promise<boolean> {
    const serialized = JSON.stringify(value);

    if (serialized.length > budget) {
      console.warn(`Data exceeds ${budget} byte budget`);
      return false;
    }

    try {
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (e) {
      if (e instanceof DOMException && e.code === 22) {
        // Quota exceeded - cleanup old data
        this.cleanup();
        try {
          localStorage.setItem(this.prefix + key, serialized);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  get<T>(key: string): T | null {
    const item = localStorage.getItem(this.prefix + key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  private cleanup(): void {
    // Remove least recently used items
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));

    // Sort by access timestamp (stored in metadata)
    const sorted = keys
      .map(k => ({
        key: k,
        accessed: this.getMetadata(k)?.accessed || 0
      }))
      .sort((a, b) => a.accessed - b.accessed);

    // Remove oldest 20%
    const toRemove = Math.ceil(sorted.length * 0.2);
    sorted.slice(0, toRemove).forEach(({ key }) => {
      localStorage.removeItem(key);
    });
  }

  private getMetadata(key: string) {
    const meta = localStorage.getItem(`${key}:meta`);
    return meta ? JSON.parse(meta) : null;
  }
}

export const storage = new StorageManager();
```

**Auto-save with Throttling:**
```typescript
// Auto-save resume data with 2-second throttle
const useAutoSave = (data: CFRSResume) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimerRef = useRef<number>();

  useEffect(() => {
    clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      const success = await storage.set(
        'resume:current',
        data,
        STORAGE_BUDGETS.resumeData
      );

      if (success) {
        setLastSaved(new Date());
      }
    }, 2000);

    return () => clearTimeout(saveTimerRef.current);
  }, [data]);

  return { lastSaved };
};
```

### 4.3 HTTP Caching Headers

**Static Asset Caching (via GitHub Pages / CDN):**
```nginx
# .github/workflows/deploy.yml - set headers via netlify.toml equivalent

# Immutable assets (hashed filenames)
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# HTML (app shell)
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Service worker
/sw.js
  Cache-Control: public, max-age=0, must-revalidate

# Themes (versioned)
/themes/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
```

**Preload Critical Resources:**
```html
<!-- index.html -->
<head>
  <!-- DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">

  <!-- Preconnect to critical origins -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Preload critical assets -->
  <link rel="preload" href="/assets/vendor.js" as="script">
  <link rel="preload" href="/assets/main.js" as="script">
  <link rel="preload" href="/assets/critical.css" as="style">

  <!-- Prefetch likely next routes -->
  <link rel="prefetch" href="/assets/import-route.js">

  <!-- Module preload for faster execution -->
  <link rel="modulepreload" href="/assets/vendor.js">
</head>
```

---

## 5. Performance Monitoring

### 5.1 Real User Monitoring (RUM)

**Web Vitals Tracking:**
```typescript
// apps/web/src/monitoring/vitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class PerformanceMonitor {
  private metrics: Map<string, Metric> = new Map();

  init() {
    // Core Web Vitals
    onCLS(this.handleMetric);
    onFID(this.handleMetric); // Deprecated, but still tracked
    onINP(this.handleMetric); // Replacing FID
    onLCP(this.handleMetric);
    onFCP(this.handleMetric);
    onTTFB(this.handleMetric);

    // Custom metrics
    this.trackCustomMetrics();
  }

  private handleMetric = (metric: Metric) => {
    this.metrics.set(metric.name, metric);

    // Log to console in dev, send to analytics in prod
    if (import.meta.env.DEV) {
      console.info(`[Perf] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating
      });
    } else {
      this.sendToAnalytics(metric);
    }

    // Warn on poor performance
    if (metric.rating === 'poor') {
      console.warn(`Poor ${metric.name}: ${metric.value}`);
    }
  };

  private trackCustomMetrics() {
    // Theme load time
    const markThemeLoad = (themeId: string, duration: number) => {
      this.handleMetric({
        name: 'theme-load',
        value: duration,
        rating: duration < 200 ? 'good' : duration < 500 ? 'needs-improvement' : 'poor',
        delta: duration,
        id: themeId
      });
    };

    // Export time
    const markExportTime = (format: string, duration: number) => {
      this.handleMetric({
        name: 'export-duration',
        value: duration,
        rating: duration < 1000 ? 'good' : duration < 3000 ? 'needs-improvement' : 'poor',
        delta: duration,
        id: format
      });
    };

    // Expose for use in app
    (window as any).__perf = { markThemeLoad, markExportTime };
  }

  private sendToAnalytics(metric: Metric) {
    // Privacy-preserving analytics (no PII)
    // Use navigator.sendBeacon for reliability
    const data = {
      metric: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      connection: this.getConnectionInfo(),
      timestamp: Date.now()
    };

    navigator.sendBeacon('/api/vitals', JSON.stringify(data));
  }

  private getConnectionInfo() {
    const conn = (navigator as any).connection;
    if (!conn) return 'unknown';

    return {
      effectiveType: conn.effectiveType, // '4g', '3g', etc.
      downlink: conn.downlink,
      rtt: conn.rtt
    };
  }

  getReport(): Record<string, Metric> {
    return Object.fromEntries(this.metrics);
  }
}

export const perfMonitor = new PerformanceMonitor();

// Auto-init
if (typeof window !== 'undefined') {
  perfMonitor.init();
}
```

### 5.2 Performance Budget Enforcement

**Lighthouse CI Configuration:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
      settings: {
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 400,
          throughputKbps: 400,
          requestLatencyMs: 400,
          downloadThroughputKbps: 400,
          uploadThroughputKbps: 400
        },
        emulatedFormFactor: 'mobile'
      }
    },

    assert: {
      assertions: {
        // Performance
        'first-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['error', { maxNumericValue: 5000 }],
        'interactive': ['error', { maxNumericValue: 5000 }],

        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],

        // Bundle sizes
        'total-byte-weight': ['error', { maxNumericValue: 512000 }], // 500KB
        'dom-size': ['warn', { maxNumericValue: 800 }],

        // Resources
        'unused-javascript': ['warn', { maxNumericValue: 20000 }],
        'unused-css-rules': ['warn', { maxNumericValue: 10000 }],
        'modern-image-formats': 'error',
        'uses-responsive-images': 'error',
        'offscreen-images': 'error',

        // Fonts
        'font-display': 'error',
        'preload-lcp-image': 'warn'
      }
    },

    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

**Bundle Size Monitoring (bundlesize):**
```json
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/assets/vendor.*.js",
      "maxSize": "80 kB",
      "compression": "gzip"
    },
    {
      "path": "./dist/assets/main.*.js",
      "maxSize": "40 kB",
      "compression": "gzip"
    },
    {
      "path": "./dist/assets/*.css",
      "maxSize": "40 kB",
      "compression": "gzip"
    },
    {
      "path": "./dist/assets/importer-markdown.*.js",
      "maxSize": "25 kB",
      "compression": "gzip"
    },
    {
      "path": "./dist/assets/importer-docx.*.js",
      "maxSize": "45 kB",
      "compression": "gzip"
    }
  ]
}
```

### 5.3 Performance Dashboard

**Runtime Performance Panel:**
```typescript
// apps/web/src/components/PerformancePanel.tsx (dev mode only)
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { perfMonitor } from '../monitoring/vitals';

export const PerformancePanel: FC = () => {
  const [metrics, setMetrics] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ctrl+Shift+P to toggle
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setVisible(v => !v);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setMetrics(perfMonitor.getReport());
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible || !import.meta.env.DEV) return null;

  return (
    <div class="perf-panel">
      <h3>Performance Metrics</h3>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(metrics).map(([name, metric]) => (
            <tr key={name} class={`rating-${metric.rating}`}>
              <td>{name}</td>
              <td>{Math.round(metric.value)}ms</td>
              <td>{metric.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div class="connection-info">
        {(navigator as any).connection && (
          <>
            <div>Type: {(navigator as any).connection.effectiveType}</div>
            <div>Downlink: {(navigator as any).connection.downlink}Mbps</div>
            <div>RTT: {(navigator as any).connection.rtt}ms</div>
          </>
        )}
      </div>
    </div>
  );
};
```

---

## 6. Lighthouse Optimization Checklist

### 6.1 Performance Category (Target: ≥90)

**Critical Optimizations:**
- [x] First Contentful Paint <3s (3G)
- [x] Largest Contentful Paint <4s (3G)
- [x] Total Blocking Time <300ms
- [x] Cumulative Layout Shift <0.1
- [x] Speed Index <5s (3G)
- [x] Time to Interactive <5s (3G)

**Implementation Tasks:**
```markdown
- [ ] Enable Vite code splitting (vendor/main/routes)
- [ ] Implement route-based lazy loading
- [ ] Inline critical CSS (<14KB)
- [ ] Defer non-critical CSS
- [ ] Optimize images (WebP, lazy loading)
- [ ] Use system fonts for UI
- [ ] Lazy load web fonts for themes
- [ ] Implement service worker caching
- [ ] Enable Brotli/Gzip compression
- [ ] Set proper cache headers
- [ ] Preload critical resources
- [ ] Remove unused CSS/JS (PurgeCSS)
- [ ] Minimize third-party scripts (zero tolerance)
- [ ] Implement resource hints (preconnect, dns-prefetch)
- [ ] Optimize bundle with Terser (drop console, mangle)
```

### 6.2 Accessibility Category (Target: ≥90)

**Compliance Tasks:**
```markdown
- [ ] Semantic HTML structure (header, nav, main, footer)
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support (tab order, focus visible)
- [ ] Color contrast ratio ≥4.5:1 (text), ≥3:1 (UI)
- [ ] Skip to main content link
- [ ] Form labels and error messages
- [ ] Alt text for all images
- [ ] Live regions for dynamic content (aria-live)
- [ ] Focus management for modals
- [ ] No auto-playing media
- [ ] Responsive text (no fixed font sizes)
- [ ] Touch target size ≥44x44px
- [ ] Screen reader testing (NVDA, JAWS)
```

**Audit Script:**
```typescript
// scripts/a11y-audit.ts
import { Builder } from 'selenium-webdriver';
import AxeBuilder from '@axe-core/webdriverjs';

const auditAccessibility = async () => {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000');

    const results = await new AxeBuilder(driver)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    console.log(`Found ${results.violations.length} violations:`);
    results.violations.forEach(violation => {
      console.error(`[${violation.impact}] ${violation.help}`);
      console.error(`  - ${violation.helpUrl}`);
    });

    if (results.violations.length > 0) {
      process.exit(1);
    }
  } finally {
    await driver.quit();
  }
};

auditAccessibility();
```

### 6.3 Best Practices Category (Target: ≥90)

**Compliance Checklist:**
```markdown
- [ ] HTTPS enforced (via GitHub Pages)
- [ ] No mixed content warnings
- [ ] CSP headers configured (no unsafe-inline, no unsafe-eval)
- [ ] No JavaScript errors in console
- [ ] Proper DOCTYPE declaration
- [ ] Valid HTML (W3C validator)
- [ ] Proper viewport meta tag
- [ ] No deprecated APIs used
- [ ] Images have correct aspect ratio (no layout shift)
- [ ] No document.write() usage
- [ ] Passive event listeners for scroll/touch
- [ ] No synchronous XHR
- [ ] Browser compatibility (ES2020 target)
```

**CSP Headers:**
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### 6.4 SEO Category (Target: ≥90)

**Requirements:**
```markdown
- [ ] Title tag (<60 characters, descriptive)
- [ ] Meta description (<160 characters)
- [ ] Canonical URL specified
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags
- [ ] robots.txt present
- [ ] sitemap.xml generated
- [ ] Structured data (JSON-LD for WebApplication)
- [ ] Valid HTML lang attribute
- [ ] Mobile-friendly (responsive design)
- [ ] Legible font sizes (≥12px)
- [ ] Tap targets properly spaced
```

**SEO Meta Template:**
```html
<!-- index.html -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Free, privacy-focused resume builder. Create ATS-friendly resumes with professional themes. 100% client-side, no sign-up required.">
  <meta name="keywords" content="resume builder, CV maker, ATS resume, free resume, privacy">

  <title>CloudFlow Resume - Free Privacy-Focused Resume Builder</title>
  <link rel="canonical" href="https://cloudflow-resume.github.io/">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="CloudFlow Resume - Free Privacy-Focused Resume Builder">
  <meta property="og:description" content="Create professional resumes with ATS-friendly themes. 100% free, no sign-up.">
  <meta property="og:image" content="https://cloudflow-resume.github.io/og-image.png">
  <meta property="og:url" content="https://cloudflow-resume.github.io/">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="CloudFlow Resume">
  <meta name="twitter:description" content="Free, privacy-focused resume builder">
  <meta name="twitter:image" content="https://cloudflow-resume.github.io/twitter-card.png">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CloudFlow Resume",
    "description": "Privacy-focused resume builder",
    "applicationCategory": "ProductivityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  </script>
</head>
```

---

## 7. 3G Network Optimization Plan

### 7.1 Network Constraints

**3G Network Profile:**
```
Download:    400 Kbps  (50 KB/s)
Upload:      400 Kbps  (50 KB/s)
RTT:         400ms
Packet Loss: ~1%
```

**Load Time Calculation:**
```
Critical Path: 135KB gzipped
Transfer time: 135KB ÷ 50KB/s = 2.7s
RTT overhead:  400ms × 3 (DNS, TCP, TLS) = 1.2s
Parse/Execute: ~800ms (estimated)
────────────────────────────────────────
Total FCP:     ~4.7s (exceeds target!)
```

**Optimization Required to Hit <3s:**
- Reduce critical path to <100KB
- Minimize RTT overhead (preconnect, HTTP/2)
- Optimize parse/execute (smaller JS, defer non-critical)

### 7.2 Critical Path Reduction

**Before Optimization:**
```
index.html        → 5KB
vendor.js (gz)    → 80KB
main.js (gz)      → 40KB
critical.css (gz) → 15KB
──────────────────────
Total             → 140KB
```

**After Optimization:**
```
index.html (with inline CSS)  → 18KB (includes critical CSS)
vendor.js (gz, Preact)        → 45KB (switch to Preact)
main.js (gz, minimal)         → 30KB (defer features)
────────────────────────────────────
Total                         → 93KB

Load time: 93KB ÷ 50KB/s = 1.86s
RTT: 1.2s
Parse: 600ms
────────────
Total: ~3.66s (still tight!)
```

**Further Optimization (Preact + Aggressive Splitting):**
```typescript
// Use Preact instead of React (save ~35KB)
import { h, render } from 'preact';

// Defer all non-critical features
const App = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Load enhancements after FCP
    requestIdleCallback(() => {
      setHydrated(true);
    });
  }, []);

  return (
    <div>
      <AppShell /> {/* Critical UI only */}
      {hydrated && <EnhancedFeatures />} {/* Lazy loaded */}
    </div>
  );
};
```

### 7.3 RTT Reduction Strategies

**Minimize Round Trips:**
```html
<!-- Preconnect to origins (saves 1 RTT) -->
<link rel="preconnect" href="https://fonts.gstatic.com">

<!-- HTTP/2 Server Push (if supported) -->
<!-- Push vendor.js and main.js with HTML -->

<!-- Inline critical resources to eliminate requests -->
<style>/* Critical CSS inlined */</style>
<script>/* App shell bootstrapper (tiny) */</script>
```

**Resource Consolidation:**
```
Before:
  - index.html
  - vendor.js
  - main.js
  - critical.css
  = 4 requests × 400ms RTT = 1.6s overhead

After:
  - index.html (with inline CSS + inline bootstrapper)
  - vendor.js (preloaded)
  - main.js (preloaded)
  = 2 requests × 400ms RTT = 800ms overhead

Saved: 800ms
```

### 7.4 Progressive Enhancement Strategy

**Tier 1: Core Experience (loads first, <100KB):**
```
- HTML structure
- Critical CSS (inlined)
- Minimal JS (app shell, navigation)
- System fonts only
```

**Tier 2: Enhanced Experience (lazy loaded):**
```
- Importers (JSON first, others on demand)
- Theme engine + 1 default theme
- Validation (on user action)
- Export handlers
```

**Tier 3: Premium Features (progressive):**
```
- Additional themes
- Advanced importers (docx, plaintext)
- ATS checker
- Redaction profiles
- Writing helpers
```

**Implementation:**
```typescript
// Progressive feature loading based on connection
const loadFeatureSet = async () => {
  const conn = (navigator as any).connection;
  const isSlowConnection =
    !conn ||
    conn.effectiveType === 'slow-2g' ||
    conn.effectiveType === '2g' ||
    conn.effectiveType === '3g';

  if (isSlowConnection) {
    // Load only essential features
    await import('./features/minimal');
  } else {
    // Load full feature set
    await import('./features/enhanced');
  }
};

// Defer until after first paint
requestIdleCallback(loadFeatureSet);
```

### 7.5 Adaptive Loading

**Network-Aware Image Loading:**
```typescript
const AdaptiveImage: FC<{src: string}> = ({ src }) => {
  const conn = (navigator as any).connection;
  const saveData = conn?.saveData || false;

  // Skip images on save-data mode
  if (saveData) {
    return <div class="image-placeholder" aria-label="Image hidden (save data mode)" />;
  }

  // Lower quality on slow connections
  const quality = conn?.effectiveType === '4g' ? 'high' : 'low';
  const srcUrl = `${src}?q=${quality}`;

  return <img src={srcUrl} loading="lazy" />;
};
```

**Feature Flags Based on Network:**
```typescript
const FEATURE_FLAGS = {
  enableThemePreviews: () => {
    const conn = (navigator as any).connection;
    return !conn || conn.effectiveType === '4g';
  },

  enableAutoValidation: () => {
    return !navigator.connection?.saveData;
  },

  enableAnimations: () => {
    const conn = (navigator as any).connection;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !prefersReducedMotion && (!conn || conn.effectiveType !== 'slow-2g');
  }
};

// Usage in components
const ThemeGallery: FC = () => {
  const showPreviews = FEATURE_FLAGS.enableThemePreviews();

  return showPreviews
    ? <ThemePreviewGrid />
    : <ThemeListView />;
};
```

---

## 8. Progressive Enhancement Strategy

### 8.1 Core Principles

**1. Baseline Experience (no JS required):**
```html
<!-- Static HTML works without JavaScript -->
<main>
  <section class="hero">
    <h1>CloudFlow Resume Builder</h1>
    <p>Create professional resumes</p>
    <a href="#import" class="cta">Get Started</a>
  </section>

  <noscript>
    <div class="notice">
      <p>This application requires JavaScript for full functionality.</p>
      <p>You can still view documentation and examples.</p>
    </div>
  </noscript>
</main>
```

**2. Enhanced with CSS:**
```css
/* Base styles work on all browsers */
.cta {
  display: block;
  padding: 1em 2em;
  background: blue;
  color: white;
  text-decoration: none;
}

/* Progressive enhancement with modern CSS */
@supports (display: grid) {
  .theme-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
}

/* Feature detection for custom properties */
@supports (--custom: property) {
  :root {
    --primary: #2563eb;
    --spacing: 1rem;
  }

  .cta {
    background: var(--primary);
    padding: var(--spacing) calc(var(--spacing) * 2);
  }
}
```

**3. Enhanced with JavaScript:**
```typescript
// Feature detection before using APIs
const supportsLocalStorage = (() => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
})();

const supportsIntersectionObserver = 'IntersectionObserver' in window;

// Polyfill only if needed
if (!supportsIntersectionObserver) {
  await import('intersection-observer');
}
```

### 8.2 Graceful Degradation Matrix

| Feature                | No JS         | JS + Old Browser | JS + Modern Browser |
|------------------------|---------------|------------------|---------------------|
| View documentation     | ✅ Full       | ✅ Full          | ✅ Full             |
| Download examples      | ✅ Full       | ✅ Full          | ✅ Full             |
| Import JSON            | ❌ N/A        | ✅ Full          | ✅ Full             |
| Import Markdown        | ❌ N/A        | ✅ Full          | ✅ Full             |
| Import Docx            | ❌ N/A        | ⚠️ Limited       | ✅ Full             |
| Theme preview          | ❌ N/A        | ✅ Static        | ✅ Interactive      |
| Export HTML            | ❌ N/A        | ✅ Full          | ✅ Full             |
| Export PDF             | ❌ N/A        | ✅ Print dialog  | ✅ Enhanced print   |
| Auto-save              | ❌ N/A        | ⚠️ Cookie        | ✅ LocalStorage     |
| Offline mode           | ❌ N/A        | ❌ N/A           | ✅ Service Worker   |

### 8.3 Polyfill Strategy

**Selective Polyfills (load only if needed):**
```typescript
// apps/web/src/polyfills.ts
const loadPolyfills = async () => {
  const polyfills: Promise<any>[] = [];

  // IntersectionObserver (for lazy loading)
  if (!('IntersectionObserver' in window)) {
    polyfills.push(import('intersection-observer'));
  }

  // ResizeObserver (for responsive components)
  if (!('ResizeObserver' in window)) {
    polyfills.push(import('@juggle/resize-observer'));
  }

  // Web Animations API (for smooth animations)
  if (!document.body.animate) {
    polyfills.push(import('web-animations-js'));
  }

  // Clipboard API (for copy-to-clipboard)
  if (!navigator.clipboard) {
    polyfills.push(import('clipboard-polyfill'));
  }

  await Promise.all(polyfills);
};

// Load polyfills before app
if (import.meta.env.PROD) {
  await loadPolyfills();
}
```

**Modern Features with Fallbacks:**
```typescript
// Copy to clipboard with fallback
const copyToClipboard = async (text: string): Promise<boolean> => {
  // Modern API
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy method
    }
  }

  // Legacy fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};
```

---

## 9. Implementation Checklist

### 9.1 Phase 1: Foundation (Week 1)

**Vite Configuration:**
- [ ] Configure code splitting (vendor/main/routes)
- [ ] Set up Terser minification
- [ ] Enable CSS code splitting
- [ ] Configure asset hashing
- [ ] Set up build budgets

**Bundle Optimization:**
- [ ] Switch to Preact (if applicable)
- [ ] Implement route-based lazy loading
- [ ] Set up dynamic imports for importers
- [ ] Create theme registry with lazy loading
- [ ] Defer schema validator loading

**Asset Pipeline:**
- [ ] Set up PostCSS with cssnano
- [ ] Configure critical CSS extraction
- [ ] Implement CSS modules
- [ ] Set up imagetools plugin
- [ ] Configure font subsetting

### 9.2 Phase 2: Caching & Offline (Week 2)

**Service Worker:**
- [ ] Install Workbox / vite-plugin-pwa
- [ ] Configure app shell caching
- [ ] Set up theme caching strategy
- [ ] Implement offline fallback
- [ ] Add background sync for exports

**Storage Management:**
- [ ] Implement StorageManager class
- [ ] Set up auto-save with throttling
- [ ] Create storage quota monitoring
- [ ] Implement LRU cleanup strategy
- [ ] Add storage migration logic

**HTTP Caching:**
- [ ] Configure cache headers for assets
- [ ] Set up immutable caching for hashed files
- [ ] Configure CDN caching (if applicable)
- [ ] Add resource hints (preconnect, prefetch)
- [ ] Implement preload for critical resources

### 9.3 Phase 3: Monitoring & Optimization (Week 3)

**Performance Monitoring:**
- [ ] Install web-vitals library
- [ ] Implement PerformanceMonitor class
- [ ] Set up custom metrics tracking
- [ ] Create performance dashboard (dev mode)
- [ ] Add analytics integration (privacy-preserving)

**Lighthouse CI:**
- [ ] Configure lighthouserc.js
- [ ] Set up GitHub Actions workflow
- [ ] Define performance budgets
- [ ] Create automated reports
- [ ] Set up budget enforcement

**Bundle Analysis:**
- [ ] Install bundlesize package
- [ ] Configure bundle size limits
- [ ] Set up rollup-plugin-visualizer
- [ ] Create bundle analysis report
- [ ] Implement CI checks for bundle size

### 9.4 Phase 4: Progressive Enhancement (Week 4)

**Network Adaptation:**
- [ ] Implement connection detection
- [ ] Create adaptive loading strategy
- [ ] Set up feature flags based on network
- [ ] Implement save-data mode
- [ ] Add reduced motion detection

**Polyfills & Compatibility:**
- [ ] Identify required polyfills
- [ ] Implement selective polyfill loading
- [ ] Create fallbacks for modern APIs
- [ ] Test on legacy browsers (IE11 if required)
- [ ] Document browser support matrix

**Accessibility:**
- [ ] Run axe-core audit
- [ ] Fix WCAG AA violations
- [ ] Implement keyboard navigation
- [ ] Add ARIA labels
- [ ] Test with screen readers

---

## 10. Success Metrics & Targets

### 10.1 Core Web Vitals

| Metric                        | Good      | Needs Improvement | Poor      | Target |
|-------------------------------|-----------|-------------------|-----------|--------|
| Largest Contentful Paint (LCP)| ≤2.5s     | 2.5s - 4.0s       | >4.0s     | ≤2.5s  |
| First Input Delay (FID)       | ≤100ms    | 100ms - 300ms     | >300ms    | ≤100ms |
| Interaction to Next Paint (INP)| ≤200ms   | 200ms - 500ms     | >500ms    | ≤200ms |
| Cumulative Layout Shift (CLS) | ≤0.1      | 0.1 - 0.25        | >0.25     | ≤0.1   |
| First Contentful Paint (FCP)  | ≤1.8s     | 1.8s - 3.0s       | >3.0s     | ≤1.8s  |
| Time to First Byte (TTFB)     | ≤800ms    | 800ms - 1800ms    | >1800ms   | ≤600ms |

### 10.2 Bundle Size Metrics

| Bundle                  | Target (gzip) | Max (gzip) | Current | Status |
|-------------------------|---------------|------------|---------|--------|
| Vendor (Preact)         | 45KB          | 80KB       | TBD     | ⏳     |
| Main (App Shell)        | 30KB          | 40KB       | TBD     | ⏳     |
| Critical CSS            | 12KB          | 15KB       | TBD     | ⏳     |
| Importer: JSON          | 8KB           | 10KB       | TBD     | ⏳     |
| Importer: Markdown      | 20KB          | 25KB       | TBD     | ⏳     |
| Importer: Docx          | 40KB          | 45KB       | TBD     | ⏳     |
| Render Engine           | 30KB          | 35KB       | TBD     | ⏳     |
| Schema Validator        | 25KB          | 30KB       | TBD     | ⏳     |
| **Total Initial Load**  | **87KB**      | **135KB**  | TBD     | ⏳     |

### 10.3 Lighthouse Scores

| Category          | Target | Minimum | Current | Status |
|-------------------|--------|---------|---------|--------|
| Performance       | ≥95    | ≥90     | TBD     | ⏳     |
| Accessibility     | ≥95    | ≥90     | TBD     | ⏳     |
| Best Practices    | 100    | ≥90     | TBD     | ⏳     |
| SEO               | 100    | ≥90     | TBD     | ⏳     |

### 10.4 Network-Specific Targets

| Network Type | FCP Target | LCP Target | TTI Target | Total Size |
|--------------|------------|------------|------------|------------|
| 4G           | ≤1.0s      | ≤2.0s      | ≤3.0s      | ≤200KB     |
| 3G           | ≤2.5s      | ≤4.0s      | ≤5.0s      | ≤135KB     |
| Slow 3G      | ≤4.0s      | ≤6.0s      | ≤8.0s      | ≤100KB     |
| Offline      | Instant    | Instant    | Instant    | Cached     |

---

## 11. Monitoring & Continuous Optimization

### 11.1 CI/CD Integration

**GitHub Actions Workflow:**
```yaml
# .github/workflows/performance.yml
name: Performance Budget

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Check bundle size
        run: npm run bundlesize

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-reports
          path: .lighthouseci
```

### 11.2 Performance Regression Detection

**Automated Checks:**
```typescript
// scripts/perf-regression.ts
import { readFileSync } from 'fs';

interface LighthouseReport {
  categories: {
    performance: { score: number };
    accessibility: { score: number };
  };
  audits: {
    'first-contentful-paint': { numericValue: number };
    'largest-contentful-paint': { numericValue: number };
    'total-blocking-time': { numericValue: number };
  };
}

const checkRegression = () => {
  const baseline: LighthouseReport = JSON.parse(
    readFileSync('.lighthouseci/baseline.json', 'utf-8')
  );

  const current: LighthouseReport = JSON.parse(
    readFileSync('.lighthouseci/current.json', 'utf-8')
  );

  const regressions: string[] = [];

  // Check score degradation (>5% drop)
  const perfDelta = baseline.categories.performance.score - current.categories.performance.score;
  if (perfDelta > 0.05) {
    regressions.push(`Performance score dropped ${(perfDelta * 100).toFixed(1)}%`);
  }

  // Check metric degradation (>10% increase)
  const metrics = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time'];
  metrics.forEach(metric => {
    const baseValue = baseline.audits[metric].numericValue;
    const currentValue = current.audits[metric].numericValue;
    const delta = (currentValue - baseValue) / baseValue;

    if (delta > 0.1) {
      regressions.push(`${metric} increased ${(delta * 100).toFixed(1)}%`);
    }
  });

  if (regressions.length > 0) {
    console.error('Performance regressions detected:');
    regressions.forEach(r => console.error(`  - ${r}`));
    process.exit(1);
  }

  console.log('No performance regressions detected');
};

checkRegression();
```

### 11.3 Performance Budget Dashboard

**Weekly Report Generation:**
```typescript
// scripts/generate-perf-report.ts
import { writeFileSync } from 'fs';
import { performance } from 'perf_hooks';

interface BudgetReport {
  timestamp: string;
  bundles: Record<string, { size: number; budget: number; status: 'pass' | 'warn' | 'fail' }>;
  lighthouse: Record<string, number>;
  webVitals: Record<string, number>;
}

const generateReport = (): BudgetReport => {
  // Collect metrics from various sources
  const report: BudgetReport = {
    timestamp: new Date().toISOString(),
    bundles: {
      vendor: { size: 45000, budget: 80000, status: 'pass' },
      main: { size: 30000, budget: 40000, status: 'pass' }
    },
    lighthouse: {
      performance: 95,
      accessibility: 98,
      bestPractices: 100,
      seo: 100
    },
    webVitals: {
      lcp: 2100,
      fid: 50,
      cls: 0.05
    }
  };

  // Write to reports directory
  const filename = `reports/perf-${Date.now()}.json`;
  writeFileSync(filename, JSON.stringify(report, null, 2));

  return report;
};

// Generate HTML dashboard
const generateDashboard = (reports: BudgetReport[]) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Performance Dashboard</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <h1>CloudFlow Resume - Performance Dashboard</h1>
      <canvas id="lighthouse-chart"></canvas>
      <canvas id="bundle-chart"></canvas>
      <script>
        const data = ${JSON.stringify(reports)};
        // Chart rendering code...
      </script>
    </body>
    </html>
  `;

  writeFileSync('reports/dashboard.html', html);
};
```

---

## 12. Documentation & Training

### 12.1 Developer Guidelines

**Performance-First Development Practices:**
```markdown
# Performance Guidelines for Contributors

## 1. Bundle Size Awareness
- Check bundle impact before adding dependencies
- Use `npm run analyze` to visualize bundle
- Prefer smaller alternatives (e.g., date-fns/esm over moment)

## 2. Code Splitting
- Always use dynamic imports for routes
- Lazy load heavy components (importers, themes)
- Defer non-critical features to idle time

## 3. Asset Optimization
- Optimize images before commit (use imagetools)
- Use SVG for icons and illustrations
- Inline critical CSS, defer the rest

## 4. Testing
- Run Lighthouse CI on every PR
- Check bundle size with `npm run bundlesize`
- Test on throttled 3G network (Chrome DevTools)

## 5. Monitoring
- Add performance marks for custom features
- Track long tasks (>50ms)
- Monitor memory usage for memory leaks
```

### 12.2 Performance Audit Template

**Monthly Performance Audit Checklist:**
```markdown
# Performance Audit - [Date]

## Bundle Analysis
- [ ] Total bundle size within budget (<200KB gzip)
- [ ] No unexpected dependencies added
- [ ] Tree shaking working (no dead code)
- [ ] Code splitting effective (no large chunks)

## Lighthouse Scores
- [ ] Performance ≥90
- [ ] Accessibility ≥90
- [ ] Best Practices ≥90
- [ ] SEO ≥90

## Web Vitals (3G)
- [ ] LCP <4s
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] FCP <3s

## Caching
- [ ] Service worker caching app shell
- [ ] Proper cache headers set
- [ ] Offline mode working
- [ ] LocalStorage within quota

## Regressions
- [ ] No performance regressions vs. last month
- [ ] No new JavaScript errors
- [ ] No accessibility violations introduced

## Action Items
1. [List any issues found]
2. [Prioritize fixes]
3. [Assign owners]
```

---

## 13. Appendix

### 13.1 Tools & Libraries

**Build & Bundling:**
- Vite 4+ (build tool)
- Rollup (bundler, via Vite)
- Terser (minification)
- PostCSS + cssnano (CSS optimization)
- vite-plugin-pwa (service worker)

**Performance:**
- web-vitals (Core Web Vitals tracking)
- Lighthouse CI (automated audits)
- bundlesize (bundle size monitoring)
- @lhci/cli (Lighthouse CI CLI)

**Monitoring:**
- Performance Observer API
- Navigation Timing API
- Resource Timing API
- User Timing API

**Optimization:**
- imagetools (image optimization)
- Workbox (service worker)
- critical (critical CSS extraction)
- PurgeCSS (unused CSS removal)

### 13.2 Reference Links

**Performance Resources:**
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring](https://web.dev/performance-scoring/)
- [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
- [Vite Build Optimizations](https://vitejs.dev/guide/build.html)

**Best Practices:**
- [Chrome Performance Best Practices](https://developer.chrome.com/docs/lighthouse/performance/)
- [Preact Performance](https://preactjs.com/guide/v10/differences-to-react/#performance)
- [Service Worker Caching Strategies](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)

### 13.3 Glossary

| Term              | Definition                                                                 |
|-------------------|---------------------------------------------------------------------------|
| **FCP**           | First Contentful Paint - when first content renders                       |
| **LCP**           | Largest Contentful Paint - when main content renders                      |
| **FID**           | First Input Delay - time from first interaction to response               |
| **INP**           | Interaction to Next Paint - responsiveness metric replacing FID           |
| **CLS**           | Cumulative Layout Shift - visual stability metric                         |
| **TBT**           | Total Blocking Time - sum of blocking time between FCP and TTI            |
| **TTI**           | Time to Interactive - when page is fully interactive                      |
| **TTFB**          | Time to First Byte - time until first byte received from server           |
| **RTT**           | Round Trip Time - latency for request/response cycle                      |
| **Tree Shaking**  | Removing unused code during bundling                                      |
| **Code Splitting**| Dividing code into chunks loaded on demand                                |
| **Critical CSS**  | Minimum CSS needed to render above-the-fold content                       |

---

## Conclusion

This optimization strategy provides a comprehensive roadmap to achieve sub-3-second load times on 3G networks while maintaining Lighthouse scores ≥90. The key pillars are:

1. **Aggressive code splitting** - Vendor/main/routes separation, lazy loading themes/importers
2. **Minimal critical path** - <100KB initial load (Preact + inline CSS + minimal JS)
3. **Smart caching** - Service worker for app shell, LocalStorage for data, HTTP caching for assets
4. **Network adaptation** - Progressive enhancement based on connection quality
5. **Continuous monitoring** - Lighthouse CI, bundle size checks, Web Vitals tracking

**Next Steps:**
1. Review and approve this strategy
2. Begin Phase 1 implementation (Vite configuration + bundle optimization)
3. Set up CI/CD pipelines for automated monitoring
4. Iterate based on real-world performance data

**Compliance:**
- Aligns with CLAUDE.md requirements (<3s load, Lighthouse ≥90)
- Privacy-preserving monitoring (no PII collection)
- GitHub Pages compatible (static deployment)
- Zero external dependencies in critical path

---

**Document Status:** READY FOR IMPLEMENTATION
**Review Status:** PENDING APPROVAL
**Implementation Priority:** HIGH (Phase 0/1 dependency)
