/* Generates the static brand assets that need rendering rather than hand-authoring:
 *   - public/brand/banners/og-card.png   1200x630 social/share card
 *   - public/icons/favicon-32.png         32x32 browser favicon
 *   - public/icons/favicon-180.png        180x180 apple-touch-icon
 *
 * Run with:  npm run assets   (node scripts/gen-assets.mjs)
 * Re-run whenever the brand seal, wordmark, or tagline changes.
 *
 * Design language matches src/styles.css: near-black canvas, the app's molten
 * gold gradient (ArcheumGradients --grad-title) as the single accent, system
 * font (Segoe UI is the Windows member of the site's stack), and a callback to
 * the top scroll vein. Build-time only - not shipped, not imported by the site.
 */
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const SEAL = resolve(root, 'public/brand/apps/archeum/logo.png')

// Register the Windows member of the site's font stack so text renders the same
// way a Windows visitor sees the site (the site uses -apple-system -> SF Pro on
// Apple, Segoe UI on Windows). Skip gracefully if a weight is missing.
const FONTS = [
  ['C:/Windows/Fonts/seguisb.ttf', 'Archeum Semibold'],
  ['C:/Windows/Fonts/segoeui.ttf', 'Archeum Regular'],
]
for (const [path, family] of FONTS) {
  if (existsSync(path)) GlobalFonts.registerFromPath(path, family)
  else console.warn(`! font missing, falling back: ${path}`)
}
const SEMIBOLD = GlobalFonts.has('Archeum Semibold') ? 'Archeum Semibold' : 'sans-serif'
const REGULAR = GlobalFonts.has('Archeum Regular') ? 'Archeum Regular' : 'sans-serif'

// Vertical molten-gold gradient over a text's cap box, matching --grad-title.
function goldFill(ctx, baseline, fontPx) {
  const top = baseline - fontPx * 0.80
  const bot = baseline + fontPx * 0.10
  const g = ctx.createLinearGradient(0, top, 0, bot)
  g.addColorStop(0.0, '#ffecc0')
  g.addColorStop(0.35, '#d4af37')
  g.addColorStop(0.70, '#b47a1a')
  g.addColorStop(1.0, '#7a4d0a')
  return g
}

// Draw letterspaced text truly centered on cx. measureText includes the
// trailing letter-spacing, which would pull a centered string left, so subtract
// one spacing unit before centering.
function drawTracked(ctx, text, cx, y, spacing) {
  ctx.letterSpacing = `${spacing}px`
  const w = ctx.measureText(text).width
  ctx.textAlign = 'left'
  ctx.fillText(text, Math.round(cx - (w - spacing) / 2), y)
  ctx.letterSpacing = '0px'
  ctx.textAlign = 'center'
}

async function buildCard() {
  const W = 1200, H = 630
  const cx = W / 2
  const c = createCanvas(W, H)
  const ctx = c.getContext('2d')

  // Canvas (matching the site --bg / app background)
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, W, H)

  // Warm glow centered on the content's optical middle (depth without breaking the black).
  const glow = ctx.createRadialGradient(cx, 290, 0, cx, 290, 600)
  glow.addColorStop(0, 'rgba(212,175,55,0.12)')
  glow.addColorStop(1, 'rgba(212,175,55,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // Top vein - the site's scroll signature, here drawn full (3px reads at OG scale).
  const vein = ctx.createLinearGradient(0, 0, W, 0)
  vein.addColorStop(0.0, '#7a4d0a')
  vein.addColorStop(0.24, '#b47a1a')
  vein.addColorStop(0.58, '#d4af37')
  vein.addColorStop(1.0, '#ffecc0')
  ctx.fillStyle = vein
  ctx.fillRect(0, 0, W, 3)

  // Lockup - seal and wordmark side by side, matched in visual height (the
  // wordmark's cap height equals the seal height), centered as one unit. The
  // seal is trimmed first so the *visible* mark sets the height. If the pair
  // would crowd the edges, the whole lockup scales down together.
  const seal = await loadImage(await sharp(SEAL).trim().png().toBuffer())
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `100px "${SEMIBOLD}"`
  const capRatio = ctx.measureText('ARCHEUM').actualBoundingBoxAscent / 100
  let sealH = 138
  let wordPx = sealH / capRatio
  let track = wordPx * 0.06
  const wordWidth = () => {
    ctx.font = `${Math.round(wordPx)}px "${SEMIBOLD}"`
    ctx.letterSpacing = `${track}px`
    const w = ctx.measureText('ARCHEUM').width - track // drop trailing spacing
    ctx.letterSpacing = '0px'
    return w
  }
  let sealW = (seal.width / seal.height) * sealH
  let gap = sealH * 0.30
  let textW = wordWidth()
  const fit = 1060 / (sealW + gap + textW)
  if (fit < 1) {
    sealH *= fit; sealW *= fit; gap *= fit; wordPx *= fit; track *= fit
    textW = wordWidth()
  }
  const lockCy = 170 // vertical middle of the lockup band
  const lx = cx - (sealW + gap + textW) / 2
  ctx.drawImage(seal, Math.round(lx), Math.round(lockCy - sealH / 2), Math.round(sealW), Math.round(sealH))
  const wordBase = Math.round(lockCy + (wordPx * capRatio) / 2)
  ctx.fillStyle = goldFill(ctx, wordBase, Math.round(wordPx))
  ctx.letterSpacing = `${track}px`
  ctx.fillText('ARCHEUM', Math.round(lx + sealW + gap), wordBase)
  ctx.letterSpacing = '0px'

  ctx.textAlign = 'center'

  // Headline (the catchphrase) - auto-fit so a longer line never crowds the edges.
  const HEAD = "Your pocket server."
  let hs = 80
  ctx.font = `${hs}px "${SEMIBOLD}"`
  while (ctx.measureText(HEAD).width > 1060 && hs > 44) { hs -= 2; ctx.font = `${hs}px "${SEMIBOLD}"` }
  ctx.fillStyle = '#f5f5f7'
  ctx.fillText(HEAD, cx, 392)

  // Subhead - the paired subtext, dim.
  ctx.font = `31px "${REGULAR}"`
  ctx.fillStyle = '#a1a1a6'
  ctx.fillText('Claim your part of the internet.', cx, 452)

  // Domain tag at the foot, quiet gold.
  ctx.font = `25px "${SEMIBOLD}"`
  ctx.fillStyle = goldFill(ctx, 566, 25)
  drawTracked(ctx, 'archeum.io', cx, 566, 1)

  const out = resolve(root, 'public/brand/banners/og-card.png')
  writeFileSync(out, c.toBuffer('image/png'))
  console.log(`wrote ${out} (${W}x${H}) headline ${hs}px`)
}

async function buildIcons() {
  const dir = resolve(root, 'public/icons')
  mkdirSync(dir, { recursive: true })

  // 32px favicon: seal on transparent, high-quality downscale.
  await sharp(SEAL)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(resolve(dir, 'favicon-32.png'))
  console.log('wrote public/icons/favicon-32.png (32x32)')

  // 180px apple-touch-icon: iOS dislikes transparency, so the seal sits on a
  // solid near-black tile with breathing room.
  const sealOnTile = await sharp(SEAL)
    .resize(132, 132, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  await sharp({ create: { width: 180, height: 180, channels: 4, background: '#0d0d0d' } })
    .composite([{ input: sealOnTile, gravity: 'center' }])
    .png()
    .toFile(resolve(dir, 'favicon-180.png'))
  console.log('wrote public/icons/favicon-180.png (180x180)')
}

await buildCard()
await buildIcons()
console.log('done.')
