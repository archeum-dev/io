/* Post-build: the brand assets live in a git submodule at public/brand, and Vite
 * copies the ENTIRE public/ tree into dist/ verbatim - so the whole ~80MB
 * submodule (multi-MB logo variants, orbs, an 11MB app icon, README/NOTICE/.git)
 * ships on every deploy even though the site references only a couple of files.
 *
 * This scans the built output for the brand assets it actually references and
 * deletes every other file under dist/brand, then prunes empty dirs. Only
 * dist/brand is touched; everything else Vite emits is left alone.
 *
 * Runs automatically after `vite build` (see package.json "build").
 */
import { readdirSync, readFileSync, statSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, relative } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const brand = resolve(dist, 'brand')

const SCAN_EXT = /\.(?:html?|css|m?js|json|xml|txt|webmanifest)$/i
const ASSET_RE = /brand\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|svg|webp|avif|gif|ico|woff2?)/gi

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}
const rel = (p) => relative(dist, p).split('\\').join('/')
const sizeOf = (dir) => walk(dir).reduce((n, f) => n + statSync(f).size, 0)
const mb = (b) => (b / 1024 / 1024).toFixed(2) + ' MB'

try {
  statSync(brand)
} catch {
  console.log('prune-dist: no dist/brand - nothing to do')
  process.exit(0)
}

// Build the allowlist of referenced brand assets from the built files.
const referenced = new Set()
for (const f of walk(dist)) {
  if (!SCAN_EXT.test(f)) continue
  const text = readFileSync(f, 'utf8')
  for (const m of text.matchAll(ASSET_RE)) referenced.add(m[0].toLowerCase())
}

const before = sizeOf(brand)
let removed = 0
const kept = []
for (const f of walk(brand)) {
  if (referenced.has(rel(f).toLowerCase())) { kept.push(rel(f)); continue }
  rmSync(f)
  removed++
}

// Drop now-empty directories (deepest first).
function pruneEmptyDirs(dir) {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name)
    if (statSync(p).isDirectory()) pruneEmptyDirs(p)
  }
  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true, force: true })
}
pruneEmptyDirs(brand)

const after = (() => { try { return sizeOf(brand) } catch { return 0 } })()
console.log(`prune-dist: removed ${removed} brand file(s), ${mb(before)} -> ${mb(after)}`)
console.log(`prune-dist: kept ${kept.length} referenced asset(s): ${kept.join(', ') || '(none)'}`)
