/* Flow diagrams for the renting / pocket beats.
 *
 * A central phone with a ring of peers, joined by thick solid connectors. A wave
 * of light travels through each connector - a gradient that ramps up to the pulse
 * colour and back down, so it reads as light moving rather than a sliding slug.
 * Renting: app servers -> your (plain) phone, gray lines / white wave, inward.
 * Pocket: your (gold) phone -> peers AND the peers to each other, metallic-gold
 * lines / pale-gold wave, outward; the peer-to-peer ring is dimmed so the spokes
 * stay primary. Drawn in SVG; waves idle offscreen and vanish under reduced motion.
 */

const SVGNS = 'http://www.w3.org/2000/svg'
let GID = 0
const el = (n, a) => {
  const e = document.createElementNS(SVGNS, n)
  for (const k in (a || {})) e.setAttribute(k, a[k])
  return e
}

function serverShape(x, y) {
  const w = 54, h = 42
  const g = el('g', { transform: `translate(${(x - w / 2).toFixed(1)} ${(y - h / 2).toFixed(1)})` })
  g.appendChild(el('rect', { x: 0, y: 0, width: w, height: h, rx: 6, class: 'flow-server-body' }))
  g.appendChild(el('line', { x1: 9, y1: 16, x2: w - 9, y2: 16, class: 'flow-rack' }))
  g.appendChild(el('line', { x1: 9, y1: 28, x2: w - 9, y2: 28, class: 'flow-rack' }))
  g.appendChild(el('circle', { cx: w - 11, cy: 10, r: 1.8, class: 'flow-led' }))
  return g
}

function phoneShape(x, y, w, h, gold) {
  const g = el('g', { class: 'flow-phone' + (gold ? ' gold-phone' : ''), transform: `translate(${(x - w / 2).toFixed(1)} ${(y - h / 2).toFixed(1)})` })
  g.appendChild(el('rect', { x: 0, y: 0, width: w, height: h, rx: Math.max(4, w * 0.17), class: 'flow-phone-body' }))
  const pad = Math.max(2, w * 0.045), foreh = w > 44 ? 2 : 1
  g.appendChild(el('rect', { x: pad, y: pad + foreh, width: w - pad * 2, height: h - pad * 2 - foreh, rx: Math.max(2.5, w * 0.1), class: 'flow-screen' }))
  if (gold) {
    const s = w * 0.5
    g.appendChild(el('image', { href: '/brand/apps/archeum/logo.png', x: (w - s) / 2, y: (h - s) / 2, width: s, height: s, class: 'flow-seal' }))
  }
  return g
}

export function initFlow(container, opts) {
  if (!container) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const W = 480, H = 480, cx = W / 2, cy = H / 2
  const {
    peers = 5, peerType = 'server', dir = 'in', ring = false, centerGold = false, layout = 'ring',
    lineColor = 'rgba(255,255,255,0.16)', ringLineColor, burstColor = '#ffffff',
  } = opts

  const svg = el('svg', { class: 'flow', viewBox: `0 0 ${W} ${H}` })
  svg.setAttribute('aria-hidden', 'true')
  const defs = el('defs'), gLines = el('g'), gBursts = el('g'), gPeers = el('g'), gCenter = el('g')
  svg.append(defs, gLines, gBursts, gPeers, gCenter)

  // Peer placement + the centre phone's position depend on the layout.
  const center = layout === 'topRow' ? { x: cx, y: cy + 64 } : { x: cx, y: cy }
  let pos
  if (layout === 'topRow') {
    const y0 = 80, x0 = 60, x1 = W - 60
    pos = Array.from({ length: peers }, (_, i) => ({ x: peers === 1 ? cx : x0 + (x1 - x0) * (i / (peers - 1)), y: y0 }))
  } else {
    const R = 184, rot = -Math.PI / 2 + (peerType === 'phone' ? Math.PI / peers : 0)
    pos = Array.from({ length: peers }, (_, i) => {
      const a = rot + (i / peers) * Math.PI * 2
      return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }
    })
  }

  // Edges carry the wave's travel direction (x1,y1 -> x2,y2) and whether dimmed.
  const mk = (x1, y1, x2, y2, dim) => ({ x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1), dim })
  const edges = []
  pos.forEach((p) => edges.push(dir === 'out' ? mk(center.x, center.y, p.x, p.y, false) : mk(p.x, p.y, center.x, center.y, false)))
  if (ring) for (let i = 0; i < peers; i++) { const a = pos[i], b = pos[(i + 1) % peers]; edges.push(mk(a.x, a.y, b.x, b.y, true)) }

  edges.forEach((e) => {
    const l = el('line', { x1: e.x1.toFixed(1), y1: e.y1.toFixed(1), x2: e.x2.toFixed(1), y2: e.y2.toFixed(1), class: 'flow-line' })
    l.style.stroke = e.dim ? (ringLineColor || lineColor) : lineColor
    l.style.strokeWidth = e.dim ? '1.5' : '2.2'
    gLines.appendChild(l)
  })
  pos.forEach((p) => gPeers.appendChild(peerType === 'server' ? serverShape(p.x, p.y) : phoneShape(p.x, p.y, 30, 56, false)))
  gCenter.appendChild(phoneShape(center.x, center.y, 86, 168, centerGold))

  container.appendChild(svg)
  if (reduce) return

  const WAVE = 48
  const bursts = edges.map((e, i) => {
    const peak = e.dim ? 0.4 : 1
    const id = 'fb' + (++GID)
    const grad = el('linearGradient', { id, gradientUnits: 'userSpaceOnUse' })
    grad.appendChild(el('stop', { offset: '0', 'stop-color': burstColor, 'stop-opacity': '0' }))
    grad.appendChild(el('stop', { offset: '0.5', 'stop-color': burstColor, 'stop-opacity': String(peak) }))
    grad.appendChild(el('stop', { offset: '1', 'stop-color': burstColor, 'stop-opacity': '0' }))
    defs.appendChild(grad)
    const seg = el('line', { class: 'flow-burst', stroke: `url(#${id})` })
    seg.style.strokeWidth = e.dim ? '2' : '3'
    if (!e.dim) seg.style.filter = `drop-shadow(0 0 4px ${burstColor})`
    gBursts.appendChild(seg)
    return { e, seg, grad, phase: (i * 0.37) % 1 }
  })

  let raf = 0, last = 0
  const frame = (ts) => {
    if (!last) last = ts
    const dt = Math.min(0.05, (ts - last) / 1000); last = ts
    bursts.forEach((b) => {
      b.phase = (b.phase + dt * 0.34) % 1
      const t = b.phase, e = b.e, hf = (WAVE / 2) / e.len
      const s0 = Math.max(0, t - hf), s1 = Math.min(1, t + hf)
      const ax = (e.x1 + (e.x2 - e.x1) * s0).toFixed(1), ay = (e.y1 + (e.y2 - e.y1) * s0).toFixed(1)
      const bx = (e.x1 + (e.x2 - e.x1) * s1).toFixed(1), by = (e.y1 + (e.y2 - e.y1) * s1).toFixed(1)
      b.seg.setAttribute('x1', ax); b.seg.setAttribute('y1', ay); b.seg.setAttribute('x2', bx); b.seg.setAttribute('y2', by)
      b.grad.setAttribute('x1', ax); b.grad.setAttribute('y1', ay); b.grad.setAttribute('x2', bx); b.grad.setAttribute('y2', by)
      b.seg.style.opacity = Math.min(t / 0.1, (1 - t) / 0.1, 1).toFixed(2)
    })
    raf = requestAnimationFrame(frame)
  }
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (e.isIntersecting && !raf) { last = 0; raf = requestAnimationFrame(frame) }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0 }
    }),
    { threshold: 0.12 }
  )
  io.observe(container)
}
