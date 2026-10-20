// SEO layer for cafify.app. Leaves the app itself untouched.
// - /caffeine/<drink>: unique title, description, canonical + FAQ data per drink
// - /blog/*: old Caffiend name and caffiend-one.vercel.app links -> Cafify / cafify.app
// - /robots.txt and /sitemap.xml: point search engines at cafify.app
export const config = { matcher: ['/caffeine/:id', '/blog/:path*', '/robots.txt', '/sitemap.xml'] };

const SITE = 'https://cafify.app';
const SKIP = 'x-cafify-mw';
const BLOG = ['caffeine-half-life', 'caffeine-and-sleep', 'caffeine-mg-per-kg', 'caffeine-drinks-comparison', 'best-time-for-coffee', 'caffeine-calculator', 'pre-workout-caffeine-sleep', 'monster-energy-caffeine', 'how-much-caffeine-too-much', 'caffeine-sensitivity'];
const DRINKS = {"espresso":["Espresso",63],"double-espresso":["Double Espresso",126],"drip-coffee-sm":["Filter Coffee (Small)",95],"drip-coffee-md":["Filter Coffee (Medium)",142],"drip-coffee-lg":["Filter Coffee (Large)",189],"americano-sm":["Americano (Small)",77],"americano-md":["Americano (Medium)",154],"americano-lg":["Americano (Large)",231],"latte-sm":["Latte (Small)",63],"latte-md":["Latte (Medium)",126],"latte-lg":["Latte (Large)",189],"cappuccino":["Cappuccino",63],"flat-white":["Flat White",130],"macchiato":["Macchiato",126],"cortado":["Cortado",126],"cold-brew":["Cold Brew",155],"cold-brew-lg":["Cold Brew (Large)",207],"nitro-cold-brew":["Nitro Cold Brew",215],"instant-coffee":["Instant Coffee",57],"decaf":["Decaf Coffee",5],"french-press":["French Press",107],"moka-pot":["Moka Pot",105],"pour-over":["Pour Over",145],"turkish-coffee":["Turkish Coffee",65],"ristretto":["Ristretto",35],"lungo":["Lungo",77],"starbucks-pike":["Starbucks Pike Place (Tall)",235],"starbucks-pike-venti":["Starbucks Pike Place (Venti)",410],"starbucks-espresso":["Starbucks Espresso",75],"starbucks-latte-tall":["Starbucks Latte (Tall)",75],"starbucks-latte-grande":["Starbucks Latte (Grande)",150],"starbucks-cold-brew-sb":["Starbucks Cold Brew (Tall)",155],"starbucks-nitro-sb":["Starbucks Nitro Cold Brew",280],"costa-flat-white":["Costa Flat White",277],"costa-latte-md":["Costa Latte (Medium)",185],"costa-americano-md":["Costa Americano (Medium)",277],"costa-espresso":["Costa Espresso",92],"greggs-latte":["Greggs Latte",96],"mcdonalds-sm":["McDonald's Coffee (Small)",109],"mcdonalds-md":["McDonald's Coffee (Medium)",145],"mcdonalds-lg":["McDonald's Coffee (Large)",178],"pret-latte":["Pret Latte",180],"tim-hortons-md":["Tim Hortons Coffee (Medium)",140],"nespresso-original":["Nespresso Original Pod",60],"nespresso-lungo":["Nespresso Lungo Pod",80],"nespresso-vertuo-espresso":["Nespresso Vertuo Espresso",60],"nespresso-vertuo-mug":["Nespresso Vertuo Mug",130],"dolce-gusto-espresso":["Dolce Gusto Espresso",65],"tassimo-latte-md":["Tassimo Latte",90],"starbucks-via":["Starbucks VIA Instant",130],"nescafe-gold-instant":["Nescafé Gold Instant",57],"kenco-instant":["Kenco Instant",57],"starbucks-frapp-vanilla":["Starbucks Frappuccino Vanilla",90],"starbucks-frapp-mocha":["Starbucks Frappuccino Mocha",110],"starbucks-frapp-caramel":["Starbucks Frappuccino Caramel",90],"starbucks-doubleshot-esp":["Starbucks Doubleshot Espresso",120],"starbucks-tripleshot":["Starbucks Triple Shot",225],"starbucks-cold-brew-rtd":["Starbucks Cold Brew Bottle",155],"starbucks-nitro-can":["Starbucks Nitro Cold Brew Can",215],"starbucks-vanilla-latte":["Starbucks Vanilla Latte (RTD)",75],"starbucks-caramel-mac-rtd":["Starbucks Caramel Macchiato (RTD)",75],"starbucks-refresher-straw":["Starbucks Refreshers Strawberry Açaí",45],"starbucks-refresher-mango":["Starbucks Refreshers Mango Dragonfruit",45],"costa-rtd-latte":["Costa Iced Latte (RTD)",95],"costa-rtd-caramel-latte":["Costa Caramel Latte (RTD)",95],"jimmys-iced-original":["Jimmy's Iced Coffee Original",69],"jimmys-iced-latte":["Jimmy's Iced Coffee Latte",69],"jimmys-iced-mocha":["Jimmy's Iced Coffee Mocha",69],"minor-figures-cold-brew":["Minor Figures Cold Brew",90],"sandows-cold-brew":["Sandow's Cold Brew",120],"emmi-caffe-latte":["Emmi Caffè Latte",65],"nescafe-azera-rtd":["Nescafé Azera Iced Americano",75],"honest-coffee-rtd":["Honest Coffee Cold Brew",85],"old-spike-rtd":["Old Spike Cold Brew",100],"black-tea":["Black Tea",47],"green-tea":["Green Tea",28],"white-tea":["White Tea",15],"oolong-tea":["Oolong Tea",37],"earl-grey":["Earl Grey",55],"english-breakfast":["English Breakfast Tea",50],"chai-latte":["Chai Latte",50],"matcha-latte":["Matcha Latte",70],"matcha-shot":["Matcha Shot",35],"matcha-ceremonial":["Ceremonial Matcha",70],"yerba-mate":["Yerba Maté",85],"guayusa":["Guayusa Tea",90],"peppermint-tea":["Peppermint Tea",0],"rooibos":["Rooibos (Redbush)",0],"kombucha":["Kombucha",15],"lipton-ice-tea":["Lipton Iced Tea (355ml)",18],"arizona-green-tea":["AriZona Green Tea (500ml)",30],"snapple-peach-tea":["Snapple Peach Tea (473ml)",42],"red-bull-250":["Red Bull Original (250ml)",80],"red-bull-355":["Red Bull Original (355ml)",114],"red-bull-473":["Red Bull Original (473ml)",151],"red-bull-sf-250":["Red Bull Sugar Free (250ml)",80],"red-bull-zero-250":["Red Bull Zero (250ml)",80],"red-bull-tropical":["Red Bull Tropical (250ml)",80],"red-bull-blueberry":["Red Bull Blueberry (250ml)",80],"red-bull-coconut":["Red Bull Coconut Berry (250ml)",80],"red-bull-watermelon":["Red Bull Watermelon (250ml)",80],"red-bull-acai":["Red Bull Açaí Berry (250ml)",80],"red-bull-kiwi":["Red Bull Kiwi Apple (250ml)",80],"red-bull-peach":["Red Bull Peach Nectarine (250ml)",80],"red-bull-lime":["Red Bull Lime (250ml)",80],"red-bull-strawberry":["Red Bull Strawberry Apricot (250ml)",80],"red-bull-winter":["Red Bull Winter Edition (250ml)",80],"red-bull-summer":["Red Bull Summer Edition (250ml)",80],"monster-original-500":["Monster Original (500ml)",160],"monster-original-355":["Monster Original (355ml)",115],"monster-ultra-white":["Monster Ultra White (500ml)",150],"monster-ultra-zero":["Monster Ultra Zero (500ml)",150],"monster-ultra-sunrise":["Monster Ultra Sunrise (500ml)",150],"monster-ultra-blue":["Monster Ultra Blue (500ml)",150],"monster-ultra-red":["Monster Ultra Red (500ml)",150],"monster-ultra-gold":["Monster Ultra Gold (500ml)",150],"monster-ultra-fiesta":["Monster Ultra Fiesta (500ml)",150],"monster-ultra-rosa":["Monster Ultra Rosá (500ml)",150],"monster-ultra-paradise":["Monster Ultra Paradise (500ml)",150],"monster-ultra-violet":["Monster Ultra Violet (500ml)",150],"monster-mango-loco":["Monster Mango Loco (500ml)",160],"monster-pipeline":["Monster Pipeline Punch (500ml)",160],"monster-pacific":["Monster Pacific Punch (500ml)",160],"monster-bad-apple":["Monster Bad Apple (500ml)",160],"monster-assault":["Monster Assault (500ml)",160],"monster-ripper":["Monster Ripper (500ml)",160],"monster-nitro":["Monster Nitro Super Dry (500ml)",160],"monster-lo-carb":["Monster Lo-Carb (500ml)",140],"monster-absolutely-zero":["Monster Absolutely Zero (500ml)",140],"monster-import":["Monster Import (460ml)",147],"monster-rehab-lemon":["Monster Rehab Lemonade (500ml)",82],"monster-rehab-peach":["Monster Rehab Peach Tea (500ml)",82],"monster-juiced-khaotic":["Monster Juiced Khaotic (500ml)",160],"monster-lewis-hamilton":["Monster Lewis Hamilton 44 (500ml)",160],"monster-monarch":["Monster Monarch (500ml)",160],"monster-doctor":["Monster Doctor (500ml)",160],"nocco-caribbean":["NOCCO BCAA Caribbean (330ml)",180],"nocco-tropical":["NOCCO BCAA Tropical (330ml)",180],"nocco-limon":["NOCCO BCAA Limon Del Sol (330ml)",180],"nocco-cherry":["NOCCO BCAA Cherry (330ml)",180],"nocco-blood-orange":["NOCCO BCAA Blood Orange (330ml)",180],"nocco-passionfruit":["NOCCO BCAA Passionfruit (330ml)",180],"nocco-apple":["NOCCO BCAA Apple (330ml)",180],"nocco-peach":["NOCCO BCAA Peach (330ml)",180],"nocco-strawberry":["NOCCO BCAA Strawberry (330ml)",180],"nocco-nordic":["NOCCO BCAA Nordic Berries (330ml)",180],"nocco-grape":["NOCCO BCAA Grape (330ml)",180],"nocco-elderflower":["NOCCO BCAA Elderflower (330ml)",180],"nocco-raspberry":["NOCCO BCAA Raspberry (330ml)",180],"nocco-melon":["NOCCO BCAA Melon (330ml)",180],"nocco-grape-passion":["NOCCO BCAA Grape & Passion (330ml)",180],"nocco-focus-mango":["NOCCO Focus Mango (330ml)",200],"nocco-focus-apple":["NOCCO Focus Apple (330ml)",200],"nocco-pump":["NOCCO Pump (500ml)",300],"reign-orange":["Reign Orange Dreamsicle (500ml)",300],"reign-lemon":["Reign Lemon HDZ (500ml)",300],"reign-melon":["Reign Melon Mania (500ml)",300],"reign-strawberry":["Reign Strawberry Sublime (500ml)",300],"reign-raspberry":["Reign Raspberry Hibiscus (500ml)",300],"reign-white-gummy":["Reign White Gummy Bear (500ml)",300],"reign-mango":["Reign Mang-O-Matic (500ml)",300],"reign-blue-razz":["Reign Blue Razz (500ml)",300],"reign-lilikoi":["Reign Lilikoi Lychee (500ml)",300],"reign-carnival":["Reign Carnival Candy (500ml)",300],"bang-cotton-candy":["Bang Cotton Candy (500ml)",300],"bang-peach-mango":["Bang Peach Mango (500ml)",300],"bang-birthday-cake":["Bang Birthday Cake Bash (500ml)",300],"bang-purple-haze":["Bang Purple Haze (500ml)",300],"bang-rainbow":["Bang Rainbow Unicorn (500ml)",300],"bang-star-blast":["Bang Star Blast (500ml)",300],"bang-black-cherry":["Bang Black Cherry Vanilla (500ml)",300],"bang-blue-razz":["Bang Blue Razz (500ml)",300],"bang-lemon-drop":["Bang Lemon Drop (500ml)",300],"celsius-peach":["Celsius Peach Mango Green Tea",200],"celsius-orange":["Celsius Sparkling Orange",200],"celsius-watermelon":["Celsius Watermelon Berry",200],"celsius-berry":["Celsius Wild Berry",200],"celsius-kiwi":["Celsius Kiwi Guava Lime",200],"celsius-grapefruit":["Celsius Grapefruit",200],"celsius-heat":["Celsius HEAT (473ml)",300],"celsius-bcaa":["Celsius BCAA",100],"c4-cotton-candy":["C4 Energy Cotton Candy (473ml)",200],"c4-orange":["C4 Energy Orange Slice (473ml)",200],"c4-tropical":["C4 Energy Tropical Blast (473ml)",200],"c4-pink-lemonade":["C4 Energy Pink Lemonade (473ml)",200],"c4-starburst":["C4 Energy Starburst Strawberry (473ml)",200],"c4-smart-300":["C4 Smart Energy (355ml)",200],"ghost-warheads":["Ghost Energy Warheads Sour (473ml)",200],"ghost-sour-patch":["Ghost Energy Sour Patch Kids (473ml)",200],"ghost-swedish":["Ghost Energy Swedish Fish (473ml)",200],"ghost-tropical":["Ghost Energy Tropical Mango (473ml)",200],"ghost-orange-cream":["Ghost Energy Orange Cream (473ml)",200],"ghost-bubblicious":["Ghost Energy Bubblicious (473ml)",200],"prime-meta-moon":["Prime Energy Meta Moon (355ml)",200],"prime-orange-mango":["Prime Energy Orange Mango (355ml)",200],"prime-tropical":["Prime Energy Tropical Punch (355ml)",200],"prime-blue-razz":["Prime Energy Blue Raspberry (355ml)",200],"prime-lemon-lime":["Prime Energy Lemon Lime (355ml)",200],"prime-strawberry":["Prime Energy Strawberry Watermelon (355ml)",200],"prime-ice-pop":["Prime Energy Ice Pop (355ml)",200],"rockstar-original":["Rockstar Original (500ml)",160],"rockstar-punched":["Rockstar Punched (500ml)",160],"rockstar-xdurance":["Rockstar XDurance (500ml)",160],"rockstar-focus":["Rockstar Focus (500ml)",160],"rockstar-zero-mango":["Rockstar Zero Mango (500ml)",160],"rockstar-juiced-mango":["Rockstar Juiced Mango (500ml)",160],"relentless-original":["Relentless Origin (500ml)",160],"relentless-passion":["Relentless Passion (500ml)",160],"relentless-mango":["Relentless Mango (500ml)",160],"relentless-cherry":["Relentless Cherry (500ml)",160],"boost-original-250":["Boost Original (250ml)",80],"boost-sf-250":["Boost Sugar Free (250ml)",80],"lucozade-energy-380":["Lucozade Energy Original (380ml)",46],"lucozade-orange-380":["Lucozade Orange (380ml)",46],"lucozade-pink-lemon":["Lucozade Pink Lemonade (380ml)",46],"lucozade-raspberry":["Lucozade Raspberry (380ml)",46],"gorilla-original":["Gorilla Energy (500ml)",160],"carabao-green-apple":["Carabao Green Apple (330ml)",30],"carabao-original":["Carabao Original (330ml)",30],"carabao-mango":["Carabao Mango (330ml)",30],"emerge-original":["Emerge Original (250ml)",75],"dark-dog-original":["Dark Dog Original (250ml)",80],"effect-energy":["Effect Energy (250ml)",80],"hell-original":["Hell Energy Original (250ml)",80],"hell-strong":["Hell Strong (500ml)",160],"sting-original":["Sting Energy Original (500ml)",200],"cadence-energy":["Cadence Energy (500ml)",160],"v-energy-250":["V Energy (250ml)",78],"v-energy-500":["V Energy (500ml)",155],"bat-original":["BAT Energy Original (500ml)",160],"5hour-energy":["5-Hour Energy (60ml)",200],"5hour-energy-extra":["5-Hour Energy Extra Strength",230],"nos-energy":["NOS Energy (473ml)",160],"full-throttle":["Full Throttle (473ml)",144],"xyience-cherry-lime":["Xyience Cherry Lime (355ml)",176],"raze-energy":["Raze Energy (473ml)",300],"alani-nu":["Alani Nu (355ml)",200],"3d-energy":["3D Energy (473ml)",200],"zoa-original":["ZOA Energy Original (355ml)",160],"zoa-zero-sugar":["ZOA Energy Zero Sugar (355ml)",160],"bucked-up":["Bucked Up Energy (473ml)",300],"sneak-energy":["Sneak Energy (500ml)",150],"gfuel-can":["G Fuel Energy Can (473ml)",150],"game-fuel":["Mountain Dew Game Fuel (473ml)",90],"guru-original":["Guru Energy Original (250ml)",100],"xs-energy":["XS Energy (250ml)",80],"coca-cola-330":["Coca-Cola (330ml)",32],"coca-cola-355":["Coca-Cola (12oz)",34],"coca-cola-500":["Coca-Cola (500ml)",50],"diet-coke-330":["Diet Coke (330ml)",42],"coke-zero-330":["Coke Zero Sugar (330ml)",32],"pepsi-330":["Pepsi (330ml)",35],"pepsi-max-330":["Pepsi Max (330ml)",43],"pepsi-max-500":["Pepsi Max (500ml)",64],"mountain-dew-355":["Mountain Dew (355ml)",54],"dr-pepper-330":["Dr Pepper (330ml)",39],"irn-bru-330":["Irn-Bru (330ml)",30],"irn-bru-energy-500":["Irn-Bru Energy (500ml)",160],"cherry-coke-330":["Cherry Coke (330ml)",34],"vanilla-coke-330":["Vanilla Coke (330ml)",34],"sprite-330":["Sprite (330ml)",0],"fanta-330":["Fanta (330ml)",0],"preworkout-100":["Pre-Workout (Light, 1 scoop)",100],"preworkout-150":["Pre-Workout (Standard, 1 scoop)",150],"preworkout-200":["Pre-Workout (Strong, 1 scoop)",200],"preworkout-300":["Pre-Workout (Maximum, 1 scoop)",300],"preworkout-2x":["Pre-Workout (2 scoops)",400],"total-war":["Total War Pre-Workout (1 scoop)",320],"legion-pulse":["Legion Pulse Pre-Workout",350],"optimum-gold":["Optimum Gold Pre-Workout",175],"cbum-thavage":["CBUM Thavage Pre-Workout",275],"gfuel-powder":["G Fuel Powder (1 scoop)",150],"sneak-powder":["Sneak Energy Powder (1 scoop)",150],"caffeine-pill-100":["Caffeine Tablet 100mg",100],"caffeine-pill-200":["Caffeine Tablet 200mg",200],"pro-plus":["Pro Plus (UK)",50],"fat-burner":["Fat Burner (avg, 1 cap)",100],"nootropic-stack":["Nootropic Stack (caffeine based)",100]};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtH = (h) => { const a = Math.floor(h), m = Math.round((h - a) * 60); return m ? `${a}h ${m}m` : `${a}h`; };

async function fetchOrigin(url) {
  try {
    const res = await fetch(url, { headers: { [SKIP]: '1' } });
    return res.ok ? res : null;
  } catch { return null; }
}

function html(body, res) {
  const headers = new Headers(res ? res.headers : undefined);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  headers.set('cache-control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
  return new Response(body, { status: 200, headers });
}

function robots() {
  return new Response(
    'User-agent: *\nAllow: /\n\nDisallow: /api/\nDisallow: /_vercel/\nDisallow: /cdn-cgi/\n\nSitemap: ' + SITE + '/sitemap.xml\n',
    { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}

function sitemap() {
  const paths = ['/', '/caffeine', '/privacy', '/terms']
    .concat(BLOG.map((b) => `/blog/${b}.html`))
    .concat(Object.keys(DRINKS).map((id) => `/caffeine/${id}`));
  const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((p) => `<url><loc>${SITE}${p}</loc><lastmod>2026-10-20</lastmod></url>`).join('\n') + '\n</urlset>\n';
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}

async function blog(url) {
  const res = await fetchOrigin(url);
  if (!res) return;
  let h = await res.text();
  h = h.replace(/https?:\/\/caffiend-one\.vercel\.app/g, SITE)
    .replace(/caffiend-one\.vercel\.app/g, 'cafify.app')
    .replace(/Caffiend/g, 'Cafify')
    .replace(/© 2025 Cafify/g, '© 2026 Cafify')
    .replace(/(name="twitter:card"\s+content=")summary(")/, '$1summary_large_image$2');
  if (!/property="og:image"/.test(h)) {
    h = h.replace('</head>', `<meta property="og:image" content="${SITE}/og-image.png">\n<meta name="twitter:image" content="${SITE}/og-image.png">\n</head>`);
  }
  return html(h, res);
}

async function drink(url, id) {
  const d = DRINKS[id];
  if (!d) return;
  const res = await fetchOrigin(new URL('/index.html', url));
  if (!res) return;
  let h = await res.text();
  const [name, mg] = d;
  const pageUrl = `${SITE}/caffeine/${id}`;
  const clear = mg > 30 ? fmtH(5.7 * Math.log2(mg / 30)) : null;
  const title = `How Much Caffeine Is in ${name}? ${mg}mg | Cafify`;
  const desc = `${name} has about ${mg}mg of caffeine.` +
    (clear ? ` It takes roughly ${clear} to drop below sleep-safe levels.` : '') +
    ` See your live caffeine level with Cafify's free tracker.`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `How much caffeine is in ${name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `${name} contains about ${mg}mg of caffeine.` } },
    ].concat(clear ? [{ '@type': 'Question', name: `How long does the caffeine in ${name} last?`,
      acceptedAnswer: { '@type': 'Answer', text: `With an average 5.7-hour half-life, the ${mg}mg in ${name} takes about ${clear} to fall below 30mg, the level sleep researchers suggest for bedtime.` } }] : []),
  };
  const set = (re, tag) => { h = re.test(h) ? h.replace(re, tag) : h.replace('</head>', `${tag}\n</head>`); };
  set(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  set(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${esc(desc)}" />`);
  set(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${pageUrl}" />`);
  set(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${esc(title)}" />`);
  set(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${esc(desc)}" />`);
  set(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${pageUrl}" />`);
  set(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${esc(title)}" />`);
  set(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${esc(desc)}" />`);
  h = h.replace('</head>', `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n</head>`);
  return html(h, res);
}

export default async function middleware(request) {
  if (request.headers.get(SKIP)) return;
  const url = new URL(request.url);
  const p = url.pathname;
  if (p === '/robots.txt') return robots();
  if (p === '/sitemap.xml') return sitemap();
  if (p.startsWith('/blog/')) return blog(url);
  if (p.startsWith('/caffeine/')) return drink(url, p.split('/')[2]);
}
