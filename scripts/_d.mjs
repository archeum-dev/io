import { chromium } from 'playwright';
const b = await chromium.launch();
async function check(w, h) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true });
  const p = await ctx.newPage();
  await p.goto('http://localhost:4325/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.getElementById('developers').scrollIntoView());
  await p.waitForTimeout(600);
  const o = await p.evaluate(() => {
    const d = document.getElementById('developers');
    const t = (s) => Math.round(d.querySelector(s).getBoundingClientRect().top);
    return { label: t('.dev-label'), cost: t('.aside-cost'), head: t('.b-head'), sub: t('.b-sub'), div: t('.aside-divider'), code: t('.code-card'), docs: t('.actions'), beatH: Math.round(d.offsetHeight), vh: window.innerHeight };
  });
  const order = [o.label, o.cost, o.head, o.sub, o.div, o.code, o.docs];
  const sorted = order.every((v, i) => i === 0 || order[i-1] < v);
  console.log(`${w}x${h}: order ${sorted ? 'OK' : 'WRONG'} [${order.join(',')}] | beat ${o.beatH} vs vh ${o.vh} ${o.beatH > o.vh ? 'OVERFLOW+' + (o.beatH - o.vh) : 'fits'}`);
  if (w === 390) await p.screenshot({ path: 'scripts/_d.png' });
  await ctx.close();
}
await check(390, 780);
await check(360, 640);
await b.close();
