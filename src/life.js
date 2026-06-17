/* Conway's Game of Life - the living background for "apps and games never die".
 * A game that is alive, and (because it re-seeds whenever it thins out) one that
 * never dies. Dim gold cells on the dark canvas, crossfading between generations
 * for a breathing feel. Idles while offscreen; a single static seed under
 * prefers-reduced-motion. Toroidal grid so patterns wrap rather than hit walls.
 */

export function initLife(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const CELL = 22, GAP = 4, STEP_MS = 560, ALPHA = 0.16, DENSITY = 0.3
  let cols = 0, rows = 0, cur, prev, W = 0, H = 0

  const idx = (x, y) => y * cols + x
  const seed = (d) => {
    const a = new Uint8Array(cols * rows)
    for (let i = 0; i < a.length; i++) a[i] = Math.random() < d ? 1 : 0
    return a
  }
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    W = canvas.clientWidth; H = canvas.clientHeight
    if (!W || !H) return
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    cols = Math.ceil(W / CELL) + 1; rows = Math.ceil(H / CELL) + 1
    cur = seed(DENSITY); prev = cur.slice()
  }
  function step() {
    const next = new Uint8Array(cols * rows)
    let pop = 0
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let n = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue
            n += cur[idx((x + dx + cols) % cols, (y + dy + rows) % rows)]
          }
        }
        const a = cur[idx(x, y)]
        const v = (a ? n === 2 || n === 3 : n === 3) ? 1 : 0
        next[idx(x, y)] = v; pop += v
      }
    }
    if (pop < cols * rows * 0.05) {              // never die: re-seed a thinning board
      const add = (cols * rows * 0.14) | 0
      for (let k = 0; k < add; k++) next[(Math.random() * next.length) | 0] = 1
    }
    prev = cur; cur = next
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H)
    const s = CELL - GAP
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y)
        if (!prev[i] && !cur[i]) continue
        const a = (prev[i] + (cur[i] - prev[i]) * t) * ALPHA
        if (a < 0.012) continue
        ctx.fillStyle = `rgba(212,175,55,${a.toFixed(3)})`
        ctx.fillRect(x * CELL, y * CELL, s, s)
      }
    }
  }

  resize()
  if (reduce) { draw(1); return }

  let raf = 0, last = 0, acc = 0
  const frame = (ts) => {
    if (!last) last = ts
    acc += ts - last; last = ts
    let t = acc / STEP_MS
    if (t >= 1) { step(); acc = 0; t = 0 }
    draw(t)
    raf = requestAnimationFrame(frame)
  }
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (e.isIntersecting && !raf) { last = 0; raf = requestAnimationFrame(frame) }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0 }
    }),
    { threshold: 0 }
  )
  io.observe(canvas)

  let rt
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200) }, { passive: true })
}
