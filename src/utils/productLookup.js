import { DRINKS } from '../data/drinks';

/**
 * Known barcode → drinkId mappings.
 * Bypasses the Open Food Facts lookup entirely for guaranteed instant results.
 * Barcodes are EAN-13 (EU/UK) unless noted.
 */
const BARCODE_MAP = {
  // ── Red Bull ──────────────────────────────────────────────
  '9002490100070': 'red-bull-250',          // Red Bull Original 250ml
  '9002490101046': 'red-bull-sf-250',       // Red Bull Sugar Free 250ml
  '9002490204938': 'red-bull-355',          // Red Bull Original 355ml
  '9002490204174': 'red-bull-473',          // Red Bull Original 473ml
  '9002490213435': 'red-bull-zero-250',     // Red Bull Zero 250ml
  '9002490215606': 'red-bull-tropical',     // Red Bull Tropical 250ml
  '9002490219505': 'red-bull-blueberry',    // Red Bull Blueberry 250ml
  '9002490217495': 'red-bull-watermelon',   // Red Bull Watermelon 250ml
  '9002490216511': 'red-bull-coconut',      // Red Bull Coconut Berry 250ml
  '9002490218904': 'red-bull-acai',         // Red Bull Açaí 250ml
  '9002490220563': 'red-bull-peach',        // Red Bull Peach 250ml
  // ── Monster ───────────────────────────────────────────────
  '5060639120093': 'monster-original-500',  // Monster Original 500ml UK
  '5060517882309': 'monster-original-500',  // Monster Original 500ml (alt)
  '5060517882408': 'monster-ultra-white',   // Monster Ultra White 500ml
  '5060517882811': 'monster-ultra-zero',    // Monster Ultra Zero 500ml
  '5060517882705': 'monster-ultra-sunrise', // Monster Ultra Sunrise 500ml
  '5060517882552': 'monster-ultra-blue',    // Monster Ultra Blue 500ml
  '5060517882606': 'monster-ultra-red',     // Monster Ultra Red 500ml
  '5060517882903': 'monster-ultra-gold',    // Monster Ultra Gold 500ml
  '5060517883009': 'monster-ultra-fiesta',  // Monster Ultra Fiesta 500ml
  '5060517883207': 'monster-ultra-paradise', // Monster Ultra Paradise 500ml
  '5060517882101': 'monster-mango-loco',    // Monster Mango Loco 500ml
  '5060517882200': 'monster-pipeline',      // Monster Pipeline Punch 500ml
  '5060517882453': 'monster-pacific',       // Monster Pacific Punch 500ml
  '5060517882354': 'monster-bad-apple',     // Monster Bad Apple 500ml
  '5060639120017': 'monster-assault',       // Monster Assault 500ml
  '5060517882002': 'monster-lo-carb',       // Monster Lo-Carb 500ml
  '5060517881951': 'monster-rehab-lemon',   // Monster Rehab Lemonade 500ml
  // ── NOCCO ─────────────────────────────────────────────────
  '7350053129018': 'nocco-caribbean',       // NOCCO Caribbean
  '7350053129025': 'nocco-tropical',        // NOCCO Tropical
  '7350053129100': 'nocco-limon',           // NOCCO Limon Del Sol
  '7350053129049': 'nocco-cherry',          // NOCCO Cherry
  '7350053129032': 'nocco-blood-orange',    // NOCCO Blood Orange
  '7350053129087': 'nocco-passionfruit',    // NOCCO Passionfruit
  '7350053129063': 'nocco-apple',           // NOCCO Apple
  '7350053129094': 'nocco-peach',           // NOCCO Peach
  '7350053129056': 'nocco-strawberry',      // NOCCO Strawberry
  '7350053129131': 'nocco-nordic',          // NOCCO Nordic Berries
  '7350053129117': 'nocco-grape',           // NOCCO Grape
  '7350053129148': 'nocco-elderflower',     // NOCCO Elderflower
  '7350053129124': 'nocco-raspberry',       // NOCCO Raspberry
  '7350053129186': 'nocco-focus-mango',     // NOCCO Focus Mango
  '7350053129193': 'nocco-focus-apple',     // NOCCO Focus Apple
  // ── Relentless ────────────────────────────────────────────
  '5449000054227': 'relentless-original',   // Relentless Origin 500ml
  '5449000054258': 'relentless-passion',    // Relentless Passion 500ml
  '5449000054241': 'relentless-mango',      // Relentless Mango 500ml
  '5449000054234': 'relentless-cherry',     // Relentless Cherry 500ml
  // ── Reign ─────────────────────────────────────────────────
  '611269990308': 'reign-orange',           // Reign Orange Dreamsicle
  '611269990001': 'reign-lemon',            // Reign Lemon HDZ
  '611269990230': 'reign-melon',            // Reign Melon Mania
  // ── Boost ─────────────────────────────────────────────────
  '5000112589205': 'boost-original-250',    // Boost Energy 250ml
  '5000112589311': 'boost-sf-250',          // Boost Sugar Free 250ml
  // ── Lucozade ──────────────────────────────────────────────
  '5000128020770': 'lucozade-energy-380',   // Lucozade Energy Original 380ml
  '5000128547413': 'lucozade-orange-380',   // Lucozade Orange 380ml
  // ── Celsius ───────────────────────────────────────────────
  '889392000058': 'celsius-orange',         // Celsius Sparkling Orange
  '889392000089': 'celsius-watermelon',     // Celsius Watermelon Berry
  '889392000027': 'celsius-peach',          // Celsius Peach Mango
  // ── Prime ─────────────────────────────────────────────────
  '197186400038': 'prime-meta-moon',        // Prime Energy Meta Moon
  '197186400014': 'prime-blue-razz',        // Prime Energy Blue Raspberry
  '197186400021': 'prime-tropical',         // Prime Energy Tropical Punch
  // ── Gorilla ───────────────────────────────────────────────
  '4607067920010': 'gorilla-original',      // Gorilla Energy 500ml
  // ── Carabao ───────────────────────────────────────────────
  '8850228004012': 'carabao-original',      // Carabao Original 330ml
  '8850228004029': 'carabao-green-apple',   // Carabao Green Apple 330ml
  '8850228004036': 'carabao-mango',         // Carabao Mango 330ml
  // ── Starbucks RTD ─────────────────────────────────────────
  '5000168013706': 'starbucks-frapp-vanilla',   // Starbucks Frappuccino Vanilla
  '5000168013720': 'starbucks-frapp-mocha',     // Starbucks Frappuccino Mocha
  '5000168013737': 'starbucks-frapp-caramel',   // Starbucks Frappuccino Caramel
  '5060321150083': 'starbucks-doubleshot-esp',  // Starbucks Doubleshot Espresso
  '5000168019319': 'starbucks-cold-brew-rtd',   // Starbucks Cold Brew
  // ── Costa RTD ─────────────────────────────────────────────
  '5000101408977': 'costa-rtd-latte',           // Costa Iced Latte RTD
  '5000101408984': 'costa-rtd-caramel-latte',   // Costa Caramel Latte RTD
  // ── Jimmy's ───────────────────────────────────────────────
  '5060064660148': 'jimmys-iced-original',      // Jimmy's Iced Coffee Original
  '5060064660162': 'jimmys-iced-mocha',         // Jimmy's Iced Coffee Mocha
};

/**
 * Fuzzy-match a product name/brand against the local DRINKS database.
 * Returns the matching drink or null.
 */
function matchLocalDrink(productName = '', brand = '') {
  const haystack = `${brand} ${productName}`.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');

  // Score each drink by how well it matches
  let best = null;
  let bestScore = 0;

  for (const drink of DRINKS) {
    const drinkNameLower = drink.name.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
    // Split drink name into words (ignore size tokens like "500ml")
    const keywords = drinkNameLower.split(' ').filter(w => w.length > 2 && !/^\d/.test(w));

    let score = 0;
    for (const kw of keywords) {
      if (haystack.includes(kw)) score += kw.length; // longer matches score higher
    }

    if (score > bestScore) {
      bestScore = score;
      best = drink;
    }
  }

  // Require a meaningful match (at least one substantial keyword match)
  return bestScore >= 5 ? best : null;
}

/**
 * Looks up a barcode:
 * 1. Check local BARCODE_MAP first (instant, no network)
 * 2. Query Open Food Facts API
 * 3. If product found but no caffeine data, try name-matching against local DB
 */
export async function lookupBarcode(barcode) {
  // ── 1. Check local barcode map ──────────────────────────────
  const localId = BARCODE_MAP[barcode];
  if (localId) {
    const drink = DRINKS.find(d => d.id === localId);
    if (drink) {
      return {
        found: true,
        barcode,
        name: drink.name,
        brand: '',
        image: null,
        caffeine: drink.caffeine,
        size: drink.size,
        hasCaffeineData: true,
        source: 'local',
      };
    }
  }

  // ── 2. Query Open Food Facts ───────────────────────────────
  const fields = 'product_name,nutriments,image_front_thumb_url,brands,serving_quantity,product_quantity';
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=${fields}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.status !== 1 || !data.product) {
      return { found: false, barcode };
    }

    const p = data.product;
    const n = p.nutriments || {};
    const productName = p.product_name || '';
    const brand = p.brands || '';

    // Parse caffeine from Open Food Facts
    let caffeineMg = null;
    if (n['caffeine_serving'] !== undefined) {
      caffeineMg = n['caffeine_serving'] * 1000;
    } else if (n['caffeine_100g'] !== undefined) {
      const per100g = n['caffeine_100g'] * 1000;
      const servingG = parseFloat(p.serving_quantity) || parseFloat(p.product_quantity) || 100;
      caffeineMg = (per100g / 100) * servingG;
    } else if (n['caffeine'] !== undefined) {
      caffeineMg = n['caffeine'] > 10 ? n['caffeine'] : n['caffeine'] * 1000;
    }

    if (caffeineMg !== null) {
      // Open Food Facts has caffeine data — use it
      return {
        found: true,
        barcode,
        name: productName || 'Unknown Product',
        brand,
        image: p.image_front_thumb_url || null,
        caffeine: Math.round(Math.max(0, caffeineMg)),
        hasCaffeineData: true,
        source: 'openfoodfacts',
      };
    }

    // ── 3. No caffeine in Open Food Facts — try local name match ──
    const localMatch = matchLocalDrink(productName, brand);
    if (localMatch) {
      return {
        found: true,
        barcode,
        name: productName || localMatch.name,
        brand,
        image: p.image_front_thumb_url || null,
        caffeine: localMatch.caffeine,
        size: localMatch.size,
        hasCaffeineData: true,
        source: 'local-match',
        localMatchName: localMatch.name,
      };
    }

    // Product found but no caffeine data anywhere
    return {
      found: true,
      barcode,
      name: productName || 'Unknown Product',
      brand,
      image: p.image_front_thumb_url || null,
      caffeine: null,
      hasCaffeineData: false,
      source: 'openfoodfacts',
    };

  } catch (err) {
    if (err.name === 'TimeoutError') {
      return { found: false, barcode, error: 'Request timed out' };
    }
    return { found: false, barcode, error: err.message };
  }
}
