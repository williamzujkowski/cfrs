# Performance Optimization Implementation Checklist

**Agent:** OPTIMIZER
**Date:** 2025-10-03
**Purpose:** Developer quick-reference for implementation tasks

---

## Phase 1: Foundation (Week 1)

### Vite Configuration
- [ ] Create `vite.config.ts` with manual chunk splitting
- [ ] Configure vendor chunk (Preact, router only)
- [ ] Set up separate chunks for importers (json, markdown, docx)
- [ ] Configure render engine chunk (Nunjucks)
- [ ] Set up validator chunk (Ajv)
- [ ] Enable CSS code splitting
- [ ] Configure Terser minification (drop_console, mangle)
- [ ] Set target to ES2020
- [ ] Configure asset hashing for cache busting
- [ ] Set chunk size warning limit to 500KB

### Bundle Optimization
- [ ] Install Preact (`npm install preact`)
- [ ] Set up Preact aliases in Vite config
- [ ] Convert React imports to Preact
- [ ] Implement route-based lazy loading with `lazy()`
- [ ] Add Suspense boundaries with loading fallbacks
- [ ] Create dynamic imports for all importers
- [ ] Set up theme registry with lazy loaders
- [ ] Defer schema validator loading (load on demand)
- [ ] Configure ESLint rule against barrel imports
- [ ] Add `sideEffects` to package.json

### CSS Optimization
- [ ] Install PostCSS plugins (cssnano, autoprefixer)
- [ ] Configure PostCSS in Vite config
- [ ] Set up CSS modules for components
- [ ] Extract critical CSS (install `critical` package)
- [ ] Create critical.css for app shell
- [ ] Inline critical CSS in index.html
- [ ] Set up deferred CSS loading
- [ ] Configure font-display: swap for web fonts
- [ ] Create system font stack for UI
- [ ] Audit and remove unused CSS

### Image & Font Optimization
- [ ] Install vite-imagetools plugin
- [ ] Configure WebP generation with JPEG fallback
- [ ] Set up lazy loading for images
- [ ] Create SVG sprite for icons
- [ ] Subset web fonts (Latin basic + extended only)
- [ ] Use variable fonts where possible
- [ ] Implement Font Loading API with timeout
- [ ] Add font preload hints for critical fonts
- [ ] Optimize SVG files (SVGO)
- [ ] Set up responsive image srcsets

---

## Phase 2: Caching & Offline (Week 2)

### Service Worker Setup
- [ ] Install vite-plugin-pwa (`npm install -D vite-plugin-pwa`)
- [ ] Configure VitePWA plugin in vite.config.ts
- [ ] Set up PWA manifest (name, icons, theme)
- [ ] Configure precaching for app shell
- [ ] Set up cache-first strategy for static assets
- [ ] Configure stale-while-revalidate for images
- [ ] Set up network-only for user data (privacy)
- [ ] Add cache expiration policies
- [ ] Implement offline fallback page
- [ ] Test service worker in production build

### Workbox Configuration
- [ ] Configure runtime caching strategies
- [ ] Set up cache name versioning
- [ ] Add expiration plugins (max age, max entries)
- [ ] Configure cacheable response plugin
- [ ] Set up background sync for exports
- [ ] Add navigation preload
- [ ] Implement cache cleanup on update
- [ ] Test offline functionality
- [ ] Add service worker update notification
- [ ] Monitor cache storage usage

### LocalStorage Strategy
- [ ] Create StorageManager class
- [ ] Define storage budgets (resume: 2MB, drafts: 1MB, etc.)
- [ ] Implement quota checking before save
- [ ] Set up LRU cleanup strategy
- [ ] Add metadata tracking (access timestamps)
- [ ] Implement auto-save with throttling (2s)
- [ ] Add storage quota monitoring
- [ ] Create graceful degradation for quota exceeded
- [ ] Test storage limits across browsers
- [ ] Add storage migration logic for version updates

### HTTP Caching
- [ ] Configure cache headers for assets (max-age=31536000)
- [ ] Set no-cache for HTML (must-revalidate)
- [ ] Configure cache headers for service worker (max-age=0)
- [ ] Add immutable directive for hashed assets
- [ ] Set up stale-while-revalidate headers
- [ ] Add preconnect hints for external origins
- [ ] Configure dns-prefetch for fonts/CDN
- [ ] Add preload hints for critical resources
- [ ] Set up modulepreload for ES modules
- [ ] Configure prefetch for likely next routes

---

## Phase 3: Monitoring & Testing (Week 3)

### Web Vitals Tracking
- [ ] Install web-vitals (`npm install web-vitals`)
- [ ] Create PerformanceMonitor class
- [ ] Implement onCLS, onFID/onINP, onLCP handlers
- [ ] Add onFCP and onTTFB tracking
- [ ] Set up custom metrics (theme load, export time)
- [ ] Implement metric reporting (console.info in dev)
- [ ] Add analytics integration for production
- [ ] Create performance panel component (dev mode)
- [ ] Add connection info tracking (effectiveType, rtt)
- [ ] Set up sendBeacon for reliable metric reporting

### Lighthouse CI
- [ ] Install @lhci/cli (`npm install -D @lhci/cli`)
- [ ] Create lighthouserc.js configuration
- [ ] Set performance budgets (FCP <3s, LCP <4s, etc.)
- [ ] Configure 3G throttling simulation
- [ ] Set up assertions for categories (≥90)
- [ ] Add budget checks (total bytes, unused JS/CSS)
- [ ] Create GitHub Actions workflow
- [ ] Configure artifact upload
- [ ] Set up automated reporting
- [ ] Add PR status checks

### Bundle Size Monitoring
- [ ] Install bundlesize (`npm install -D bundlesize`)
- [ ] Configure bundlesize in package.json
- [ ] Set size limits for vendor.js (80KB gzip)
- [ ] Set size limits for main.js (40KB gzip)
- [ ] Set size limits for CSS (40KB gzip)
- [ ] Set size limits for importers
- [ ] Add bundlesize to CI workflow
- [ ] Install rollup-plugin-visualizer for analysis
- [ ] Generate bundle visualization report
- [ ] Set up size comparison in PRs

### Performance Testing
- [ ] Create performance regression script
- [ ] Set up baseline Lighthouse report
- [ ] Configure automated comparison (±5% tolerance)
- [ ] Add metric regression detection (±10% tolerance)
- [ ] Test on real 3G network (Chrome DevTools throttling)
- [ ] Test on various devices (mobile, tablet, desktop)
- [ ] Create golden fixture tests
- [ ] Add snapshot tests for critical paths
- [ ] Test offline functionality
- [ ] Verify cache invalidation on updates

---

## Phase 4: Progressive Enhancement (Week 4)

### Network Adaptation
- [ ] Implement connection detection (Navigator.connection)
- [ ] Create feature flags based on effectiveType
- [ ] Set up save-data mode detection
- [ ] Implement adaptive image loading
- [ ] Add network-aware theme loading
- [ ] Create reduced feature set for slow connections
- [ ] Implement deferred loading on idle (requestIdleCallback)
- [ ] Add connection change listeners
- [ ] Test on 4G, 3G, slow-3G profiles
- [ ] Verify graceful degradation

### Polyfills & Compatibility
- [ ] Identify required polyfills (IntersectionObserver, etc.)
- [ ] Create polyfill loading script
- [ ] Implement conditional polyfill loading
- [ ] Add fallbacks for Clipboard API
- [ ] Add fallback for Web Animations API
- [ ] Test on legacy browsers (if required)
- [ ] Verify feature detection logic
- [ ] Add browser support matrix to docs
- [ ] Test with polyfills disabled
- [ ] Verify bundle size impact

### Accessibility Compliance
- [ ] Install @axe-core/webdriverjs
- [ ] Create accessibility audit script
- [ ] Run axe-core with WCAG 2.1 AA rules
- [ ] Fix all critical violations
- [ ] Add ARIA labels to interactive elements
- [ ] Implement keyboard navigation (tab order)
- [ ] Add skip-to-main-content link
- [ ] Verify color contrast ratios (≥4.5:1)
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Add focus visible styles

### Progressive Loading
- [ ] Implement 3-tier loading strategy
- [ ] Create core tier (<100KB, essential only)
- [ ] Create enhanced tier (themes, render engine)
- [ ] Create premium tier (advanced features)
- [ ] Add loading state indicators
- [ ] Implement skeleton screens for lazy content
- [ ] Add preloading on hover/focus
- [ ] Test progressive loading flow
- [ ] Verify all tiers load correctly
- [ ] Measure impact on FCP/TTI

---

## Validation & Testing

### Pre-Deployment Checks
- [ ] Run `npm run build` successfully
- [ ] Verify bundle sizes under budget
- [ ] Run Lighthouse CI (all scores ≥90)
- [ ] Test on throttled 3G network
- [ ] Verify offline mode works
- [ ] Check service worker caching
- [ ] Test LocalStorage auto-save
- [ ] Verify all lazy-loaded routes work
- [ ] Check theme loading performance
- [ ] Test importer lazy loading

### Manual Testing
- [ ] Test on Chrome (desktop + mobile)
- [ ] Test on Firefox (desktop + mobile)
- [ ] Test on Safari (desktop + mobile)
- [ ] Test on Edge
- [ ] Verify PWA installation works
- [ ] Test offline functionality
- [ ] Check network throttling behavior
- [ ] Verify save-data mode
- [ ] Test dark/light mode switching
- [ ] Check print-to-PDF functionality

### Performance Validation
- [ ] Measure FCP on 3G (<3s target)
- [ ] Measure LCP on 3G (<4s target)
- [ ] Measure TTI on 3G (<5s target)
- [ ] Verify CLS <0.1
- [ ] Check TBT <300ms
- [ ] Verify initial bundle <135KB gzip
- [ ] Check all Lighthouse categories ≥90
- [ ] Verify no console errors
- [ ] Check memory usage (no leaks)
- [ ] Test on low-end device (if available)

---

## CI/CD Integration

### GitHub Actions Setup
- [ ] Create `.github/workflows/performance.yml`
- [ ] Add Lighthouse CI job
- [ ] Add bundlesize check job
- [ ] Configure artifact upload
- [ ] Set up PR status checks
- [ ] Add performance regression detection
- [ ] Configure automated reports
- [ ] Set up notifications for failures
- [ ] Add manual trigger option
- [ ] Test workflow on sample PR

### Pre-commit Hooks
- [ ] Install husky (`npm install -D husky`)
- [ ] Set up pre-commit hook
- [ ] Add bundle size check
- [ ] Add lint-staged for code quality
- [ ] Configure ESLint with performance rules
- [ ] Add TypeScript type checking
- [ ] Configure prettier for consistent formatting
- [ ] Test hooks locally
- [ ] Document hook setup in README
- [ ] Add hook bypass instructions (emergencies only)

---

## Documentation

### Developer Guides
- [ ] Create PERFORMANCE.md in /docs
- [ ] Document bundle size budgets
- [ ] Explain code splitting strategy
- [ ] Document lazy loading patterns
- [ ] Add caching strategy explanation
- [ ] Document monitoring setup
- [ ] Create contribution guidelines for performance
- [ ] Add troubleshooting section
- [ ] Include performance testing instructions
- [ ] Add FAQ section

### User Documentation
- [ ] Explain offline mode to users
- [ ] Document save-data mode benefits
- [ ] Add browser compatibility matrix
- [ ] Create performance FAQ
- [ ] Document PWA installation
- [ ] Explain auto-save behavior
- [ ] Add privacy policy (no tracking)
- [ ] Document export limitations on slow networks
- [ ] Add tips for best performance
- [ ] Create video walkthrough (optional)

---

## Success Metrics Tracking

### Initial Metrics (Baseline)
- [ ] Record initial bundle sizes
- [ ] Record initial Lighthouse scores
- [ ] Record initial Web Vitals
- [ ] Document initial load time on 3G
- [ ] Measure initial TTI
- [ ] Track initial cache hit rate
- [ ] Record initial build time
- [ ] Measure initial memory usage
- [ ] Document initial error rate
- [ ] Create baseline report

### Target Metrics (Post-Optimization)
- [ ] Verify bundle size reduction (>50%)
- [ ] Confirm Lighthouse ≥90 (all categories)
- [ ] Verify FCP <3s on 3G
- [ ] Confirm LCP <4s on 3G
- [ ] Verify TTI <5s on 3G
- [ ] Check CLS <0.1
- [ ] Verify cache hit rate >90%
- [ ] Confirm no performance regressions
- [ ] Verify no new errors introduced
- [ ] Create final report

---

## Quick Reference

### Critical Commands
```bash
# Build for production
npm run build

# Analyze bundle
npm run build -- --mode analyze

# Run Lighthouse CI
npx lhci autorun

# Check bundle sizes
npm run bundlesize

# Test on throttled 3G
# (Use Chrome DevTools Network tab)

# Run accessibility audit
npm run a11y-audit

# Generate performance report
npm run perf-report
```

### Performance Budget Summary
- Vendor bundle: 45KB (max 80KB) gzipped
- Main bundle: 30KB (max 40KB) gzipped
- Critical CSS: 12KB (max 15KB) gzipped
- Total initial: 87KB (max 135KB) gzipped
- FCP on 3G: <3s
- Lighthouse: ≥90 (all categories)

### Key Files
- `/home/william/git/cfrs/.hive-mind/optimization-strategy.md` - Full spec
- `/home/william/git/cfrs/.hive-mind/optimization-summary.md` - Executive summary
- `/home/william/git/cfrs/vite.config.ts` - Build configuration
- `/home/william/git/cfrs/lighthouserc.js` - Lighthouse CI config
- `/home/william/git/cfrs/package.json` - Bundle size budgets

---

**Status:** READY FOR IMPLEMENTATION ✅
**Start Date:** TBD
**Target Completion:** 4 weeks
**Priority:** HIGH (Phase 0/1 critical path)

---

## Notes
- Check off items as you complete them
- Update metrics as you progress
- Report blockers immediately
- Review strategy weekly
- Update documentation continuously
