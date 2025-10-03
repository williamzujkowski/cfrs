# Performance Metrics Quick Reference Card

**Agent:** OPTIMIZER | **Date:** 2025-10-03 | **Status:** AUTHORITATIVE

---

## 🎯 Critical Targets (Must Achieve)

| Metric | Target | Network | Status |
|--------|--------|---------|--------|
| **First Contentful Paint** | **<3s** | 3G | ⏳ |
| **Largest Contentful Paint** | **<4s** | 3G | ⏳ |
| **Time to Interactive** | **<5s** | 3G | ⏳ |
| **Total Bundle Size** | **<135KB** | All | ⏳ |
| **Lighthouse Score** | **≥90** | All | ⏳ |

---

## 📦 Bundle Budget Visual

```
┌────────────────────────────────────────────────────────────┐
│ CRITICAL PATH (Must load first)                            │
├────────────────────────────────────────────────────────────┤
│ vendor.js (Preact)     ████████████████████        45KB    │
│ main.js (App shell)    █████████████              30KB    │
│ critical.css           █████                      12KB    │
├────────────────────────────────────────────────────────────┤
│ TOTAL CRITICAL         ████████████████████████   87KB    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ DEFERRED (Lazy loaded on demand)                           │
├────────────────────────────────────────────────────────────┤
│ Importers              ████████████████          80KB     │
│ Render Engine          █████████████             30KB     │
│ Themes                 ██████                    22KB     │
│ Validator              ████████████              25KB     │
│ Exports                ███████                   15KB     │
├────────────────────────────────────────────────────────────┤
│ TOTAL DEFERRED         ████████████████████████  172KB    │
└────────────────────────────────────────────────────────────┘

TOTAL APPLICATION: 259KB (87KB critical + 172KB deferred)
```

---

## ⚡ Load Time Breakdown (3G Network)

### Before Optimization ❌
```
Critical Payload:  140KB
Transfer Time:     140KB ÷ 50KB/s = 2.8s
RTT Overhead:      400ms × 3 = 1.2s
Parse/Execute:     ~800ms
─────────────────────────────────────
TOTAL FCP:         ~4.8s (FAILS TARGET)
```

### After Optimization ✅
```
Critical Payload:  87KB
Transfer Time:     87KB ÷ 50KB/s = 1.74s
RTT Overhead:      400ms × 2 = 800ms (saved 1 RTT via preconnect)
Parse/Execute:     ~600ms (smaller JS bundle)
─────────────────────────────────────
TOTAL FCP:         ~3.14s (CLOSE TO TARGET)
```

### Aggressive Optimization ✅✅
```
Critical Payload:  75KB (Preact + minimal shell + inline CSS)
Transfer Time:     75KB ÷ 50KB/s = 1.5s
RTT Overhead:      800ms
Parse/Execute:     ~500ms (minimal JS)
─────────────────────────────────────
TOTAL FCP:         ~2.8s (ACHIEVES TARGET!)
```

**Optimization Impact:** 2.0s faster (-42% load time)

---

## 📊 Lighthouse Score Requirements

```
┌──────────────────────┬────────┬─────────┬─────────┐
│ Category             │ Target │ Minimum │ Weight  │
├──────────────────────┼────────┼─────────┼─────────┤
│ Performance          │   95   │   90    │  HIGH   │
│ Accessibility        │   95   │   90    │  HIGH   │
│ Best Practices       │  100   │   90    │  MEDIUM │
│ SEO                  │  100   │   90    │  MEDIUM │
└──────────────────────┴────────┴─────────┴─────────┘
```

### Key Audits (Performance)
- ✅ First Contentful Paint: <3s
- ✅ Largest Contentful Paint: <4s
- ✅ Total Blocking Time: <300ms
- ✅ Cumulative Layout Shift: <0.1
- ✅ Speed Index: <5s
- ✅ Time to Interactive: <5s

---

## 🌐 Network Performance Matrix

| Network | Download | RTT | FCP Target | LCP Target | TTI Target |
|---------|----------|-----|------------|------------|------------|
| **4G**  | 4 Mbps   | 50ms | <1.0s | <2.0s | <3.0s |
| **3G**  | 400 Kbps | 400ms | <2.5s | <4.0s | <5.0s |
| **Slow 3G** | 100 Kbps | 2000ms | <4.0s | <6.0s | <8.0s |
| **Offline** | Cached | 0ms | Instant | Instant | Instant |

---

## 🔧 7 Key Optimizations

### 1. Bundle Splitting
```
BEFORE: 200KB monolithic bundle
AFTER:  87KB critical + 172KB lazy
IMPACT: -56% initial load
```

### 2. Critical CSS
```
BEFORE: 40KB external CSS (render blocking)
AFTER:  12KB inline CSS + 28KB deferred
IMPACT: -1 render-blocking request
```

### 3. Lazy Loading
```
BEFORE: All features loaded upfront
AFTER:  Route-based + feature-based splitting
IMPACT: Load only what's needed
```

### 4. Service Worker
```
BEFORE: Network request on every visit
AFTER:  Cache-first for app shell
IMPACT: Instant repeat visits
```

### 5. Preact Switch
```
BEFORE: React (80KB vendor bundle)
AFTER:  Preact (45KB vendor bundle)
IMPACT: -35KB (-44% framework size)
```

### 6. Image Optimization
```
BEFORE: JPEG/PNG images
AFTER:  WebP with JPEG fallback + lazy loading
IMPACT: -50% image size
```

### 7. Network Adaptation
```
BEFORE: One-size-fits-all experience
AFTER:  Progressive tiers based on connection
IMPACT: Optimal for all networks
```

---

## 📈 Core Web Vitals Targets

```
┌─────────────────────────────────────────────────────┐
│ Largest Contentful Paint (LCP)                      │
│ ████████████████████████░░░░░░ 2.5s GOOD   <4.0s   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Interaction to Next Paint (INP)                     │
│ ███████░░░░░░░░░░░░░░░░░░░░░░░ 100ms GOOD  <200ms  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Cumulative Layout Shift (CLS)                       │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░ 0.05 GOOD   <0.1    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ First Contentful Paint (FCP)                        │
│ ██████████████████░░░░░░░░░░░░ 1.8s GOOD   <3.0s   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Time to First Byte (TTFB)                           │
│ ████████████░░░░░░░░░░░░░░░░░░ 600ms GOOD  <800ms  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Progressive Loading Tiers

### Tier 1: CORE (Loads First)
```
Size: <100KB | Load Time: <3s on 3G
─────────────────────────────────────
✓ HTML + inline CSS
✓ Minimal JS (app shell)
✓ System fonts only
✓ Basic navigation
```

### Tier 2: ENHANCED (Lazy Loaded)
```
Size: +50KB | Load Time: Idle/Interaction
─────────────────────────────────────
✓ JSON importer
✓ Default theme
✓ Render engine
✓ Export handlers
```

### Tier 3: PREMIUM (On Demand)
```
Size: +60KB | Load Time: User Action
─────────────────────────────────────
✓ Advanced importers
✓ Additional themes
✓ ATS checker
✓ Redaction profiles
```

---

## 💾 Caching Strategy

```
┌────────────────────────────────────────────────┐
│ LAYER 1: App Shell (Cache-first)               │
│ ✓ HTML, JS, CSS, fonts                         │
│ ✓ Instant load on repeat visits                │
│ ✓ Update on new version                        │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ LAYER 2: Themes (Cache-first, 7-day expiry)    │
│ ✓ Theme bundles + stylesheets                  │
│ ✓ Lazy loaded, cached permanently              │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ LAYER 3: Static Assets (Stale-while-revalidate)│
│ ✓ Images, icons, fonts                         │
│ ✓ Serve cached, update in background           │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ LAYER 4: User Data (Network-only, no cache)    │
│ ✓ Resume data (privacy-preserving)             │
│ ✓ Never cached by service worker               │
└────────────────────────────────────────────────┘
```

---

## ⚙️ LocalStorage Quotas

```
┌──────────────────────┬──────────┬─────────────┐
│ Storage Type         │ Budget   │ Cleanup     │
├──────────────────────┼──────────┼─────────────┤
│ Resume Data          │ 2MB      │ Manual      │
│ Drafts (Auto-save)   │ 1MB      │ LRU (30d)   │
│ Preferences          │ 100KB    │ Manual      │
│ Theme Cache          │ 500KB    │ LRU (7d)    │
│ Export History       │ 400KB    │ LRU (14d)   │
├──────────────────────┼──────────┼─────────────┤
│ TOTAL                │ 4MB      │ Automatic   │
└──────────────────────┴──────────┴─────────────┘

Auto-save: Every 2s (throttled)
Cleanup: LRU when quota exceeded
```

---

## 📋 Implementation Status

### Week 1: Foundation ⏳
- [ ] Vite configuration
- [ ] Bundle optimization
- [ ] CSS optimization
- [ ] Asset pipeline

### Week 2: Caching ⏳
- [ ] Service worker
- [ ] LocalStorage
- [ ] HTTP caching
- [ ] Offline mode

### Week 3: Monitoring ⏳
- [ ] Web Vitals
- [ ] Lighthouse CI
- [ ] Bundle size checks
- [ ] Performance dashboard

### Week 4: Enhancement ⏳
- [ ] Network adaptation
- [ ] Polyfills
- [ ] Accessibility
- [ ] Progressive loading

---

## 🔍 Quick Commands

```bash
# Build production bundle
npm run build

# Analyze bundle
npm run analyze

# Run Lighthouse
npx lhci autorun

# Check bundle sizes
npm run bundlesize

# Performance audit
npm run perf-audit

# Accessibility test
npm run a11y-audit
```

---

## 📞 Key Resources

**Full Strategy:** `.hive-mind/optimization-strategy.md` (59KB)
**Summary:** `.hive-mind/optimization-summary.md` (11KB)
**Checklist:** `.hive-mind/optimization-checklist.md` (13KB)

**References:**
- Web Vitals: https://web.dev/vitals/
- Lighthouse: https://web.dev/performance-scoring/
- Vite Optimization: https://vitejs.dev/guide/build.html

---

## ✅ Success Criteria

### Must-Have (Release Blockers)
- ✅ FCP <3s on 3G
- ✅ Bundle <135KB gzip
- ✅ Lighthouse ≥90 (all)
- ✅ Offline mode working

### Should-Have (Quality Gates)
- ✅ LCP <4s on 3G
- ✅ TTI <5s on 3G
- ✅ CLS <0.1
- ✅ No regressions

### Nice-to-Have (Enhancements)
- ⚪ Performance dashboard
- ⚪ Network adaptation
- ⚪ Automated reports
- ⚪ Regression detection

---

**Last Updated:** 2025-10-03
**Version:** 1.0.0
**Status:** READY FOR IMPLEMENTATION ✅

---

_Print this card and keep it visible during implementation!_
