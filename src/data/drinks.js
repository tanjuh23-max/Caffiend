export const DRINKS = [

  // ═══════════════════════════════════════════════════════
  // ☕  COFFEE — Generic / Chain
  // ═══════════════════════════════════════════════════════
  { id: 'espresso',              name: 'Espresso',                    caffeine: 63,  size: '1 shot (30ml)',    category: 'coffee',  emoji: '☕' },
  { id: 'double-espresso',       name: 'Double Espresso',             caffeine: 126, size: '2 shots (60ml)',   category: 'coffee',  emoji: '☕' },
  { id: 'drip-coffee-sm',        name: 'Filter Coffee (Small)',       caffeine: 95,  size: '8oz (240ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'drip-coffee-md',        name: 'Filter Coffee (Medium)',      caffeine: 142, size: '12oz (355ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'drip-coffee-lg',        name: 'Filter Coffee (Large)',       caffeine: 189, size: '16oz (473ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'americano-sm',          name: 'Americano (Small)',           caffeine: 77,  size: '8oz (240ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'americano-md',          name: 'Americano (Medium)',          caffeine: 154, size: '12oz (355ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'americano-lg',          name: 'Americano (Large)',           caffeine: 231, size: '16oz (473ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'latte-sm',              name: 'Latte (Small)',               caffeine: 63,  size: '8oz (240ml)',      category: 'coffee',  emoji: '🥛' },
  { id: 'latte-md',              name: 'Latte (Medium)',              caffeine: 126, size: '12oz (355ml)',     category: 'coffee',  emoji: '🥛' },
  { id: 'latte-lg',              name: 'Latte (Large)',               caffeine: 189, size: '16oz (473ml)',     category: 'coffee',  emoji: '🥛' },
  { id: 'cappuccino',            name: 'Cappuccino',                  caffeine: 63,  size: '6oz (180ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'flat-white',            name: 'Flat White',                  caffeine: 130, size: '5oz (150ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'macchiato',             name: 'Macchiato',                   caffeine: 126, size: '2oz (60ml)',       category: 'coffee',  emoji: '☕' },
  { id: 'cortado',               name: 'Cortado',                     caffeine: 126, size: '4oz (120ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'cold-brew',             name: 'Cold Brew',                   caffeine: 155, size: '8oz (240ml)',      category: 'coffee',  emoji: '🧊' },
  { id: 'cold-brew-lg',          name: 'Cold Brew (Large)',           caffeine: 207, size: '12oz (355ml)',     category: 'coffee',  emoji: '🧊' },
  { id: 'nitro-cold-brew',       name: 'Nitro Cold Brew',             caffeine: 215, size: '12oz (355ml)',     category: 'coffee',  emoji: '🧊' },
  { id: 'instant-coffee',        name: 'Instant Coffee',              caffeine: 57,  size: '8oz (240ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'decaf',                 name: 'Decaf Coffee',                caffeine: 5,   size: '8oz (240ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'french-press',          name: 'French Press',                caffeine: 107, size: '8oz (240ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'moka-pot',              name: 'Moka Pot',                    caffeine: 105, size: '4oz (120ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'pour-over',             name: 'Pour Over',                   caffeine: 145, size: '12oz (355ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'turkish-coffee',        name: 'Turkish Coffee',              caffeine: 65,  size: '3oz (90ml)',       category: 'coffee',  emoji: '☕' },
  { id: 'ristretto',             name: 'Ristretto',                   caffeine: 35,  size: '0.75oz (22ml)',    category: 'coffee',  emoji: '☕' },
  { id: 'lungo',                 name: 'Lungo',                       caffeine: 77,  size: '3oz (90ml)',       category: 'coffee',  emoji: '☕' },
  // Branded coffee shops
  { id: 'starbucks-pike',        name: 'Starbucks Pike Place (Tall)', caffeine: 235, size: '12oz (355ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'starbucks-pike-venti',  name: 'Starbucks Pike Place (Venti)',caffeine: 410, size: '20oz (591ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'starbucks-espresso',    name: 'Starbucks Espresso',          caffeine: 75,  size: '1 shot',           category: 'coffee',  emoji: '☕' },
  { id: 'starbucks-latte-tall',  name: 'Starbucks Latte (Tall)',      caffeine: 75,  size: '12oz (355ml)',     category: 'coffee',  emoji: '🥛' },
  { id: 'starbucks-latte-grande',name: 'Starbucks Latte (Grande)',    caffeine: 150, size: '16oz (473ml)',     category: 'coffee',  emoji: '🥛' },
  { id: 'starbucks-cold-brew-sb', name: 'Starbucks Cold Brew (Tall)', caffeine: 155, size: '12oz (355ml)',     category: 'coffee',  emoji: '🧊' },
  { id: 'starbucks-nitro-sb',    name: 'Starbucks Nitro Cold Brew',   caffeine: 280, size: '16oz (473ml)',     category: 'coffee',  emoji: '🧊' },
  { id: 'costa-flat-white',      name: 'Costa Flat White',            caffeine: 277, size: '8oz (240ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'costa-latte-md',        name: 'Costa Latte (Medium)',        caffeine: 185, size: '12oz (355ml)',     category: 'coffee',  emoji: '🥛' },
  { id: 'costa-americano-md',    name: 'Costa Americano (Medium)',    caffeine: 277, size: '12oz (355ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'costa-espresso',        name: 'Costa Espresso',              caffeine: 92,  size: '1 shot',           category: 'coffee',  emoji: '☕' },
  { id: 'greggs-latte',          name: 'Greggs Latte',                caffeine: 96,  size: '12oz (355ml)',     category: 'coffee',  emoji: '🥛' },
  { id: 'mcdonalds-sm',          name: "McDonald's Coffee (Small)",   caffeine: 109, size: '12oz (355ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'mcdonalds-md',          name: "McDonald's Coffee (Medium)",  caffeine: 145, size: '16oz (473ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'mcdonalds-lg',          name: "McDonald's Coffee (Large)",   caffeine: 178, size: '21oz (621ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'pret-latte',            name: 'Pret Latte',                  caffeine: 180, size: '12oz (355ml)',     category: 'coffee',  emoji: '🥛' },
  { id: 'tim-hortons-md',        name: 'Tim Hortons Coffee (Medium)', caffeine: 140, size: '14oz (414ml)',     category: 'coffee',  emoji: '☕' },
  // Pods / capsules
  { id: 'nespresso-original',    name: 'Nespresso Original Pod',      caffeine: 60,  size: '1 pod (40ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'nespresso-lungo',       name: 'Nespresso Lungo Pod',         caffeine: 80,  size: '1 pod (110ml)',    category: 'coffee',  emoji: '☕' },
  { id: 'nespresso-vertuo-espresso', name: 'Nespresso Vertuo Espresso', caffeine: 60, size: '1 pod (40ml)',   category: 'coffee',  emoji: '☕' },
  { id: 'nespresso-vertuo-mug',  name: 'Nespresso Vertuo Mug',        caffeine: 130, size: '1 pod (230ml)',    category: 'coffee',  emoji: '☕' },
  { id: 'dolce-gusto-espresso',  name: 'Dolce Gusto Espresso',        caffeine: 65,  size: '1 pod (60ml)',     category: 'coffee',  emoji: '☕' },
  { id: 'tassimo-latte-md',      name: 'Tassimo Latte',               caffeine: 90,  size: '1 disc',           category: 'coffee',  emoji: '🥛' },
  { id: 'starbucks-via',         name: 'Starbucks VIA Instant',       caffeine: 130, size: '1 sachet',         category: 'coffee',  emoji: '☕' },
  { id: 'nescafe-gold-instant',  name: 'Nescafé Gold Instant',        caffeine: 57,  size: '8oz (240ml)',      category: 'coffee',  emoji: '☕' },
  { id: 'kenco-instant',         name: 'Kenco Instant',               caffeine: 57,  size: '8oz (240ml)',      category: 'coffee',  emoji: '☕' },

  // ═══════════════════════════════════════════════════════
  // 🥤  RTD — Ready-to-Drink Bottled Coffee
  // ═══════════════════════════════════════════════════════
  { id: 'starbucks-frapp-vanilla',  name: 'Starbucks Frappuccino Vanilla',  caffeine: 90,  size: '250ml bottle',   category: 'rtd', emoji: '🥤' },
  { id: 'starbucks-frapp-mocha',    name: 'Starbucks Frappuccino Mocha',    caffeine: 110, size: '250ml bottle',   category: 'rtd', emoji: '🥤' },
  { id: 'starbucks-frapp-caramel',  name: 'Starbucks Frappuccino Caramel', caffeine: 90,  size: '250ml bottle',   category: 'rtd', emoji: '🥤' },
  { id: 'starbucks-doubleshot-esp', name: 'Starbucks Doubleshot Espresso', caffeine: 120, size: '192ml can',       category: 'rtd', emoji: '🥤' },
  { id: 'starbucks-tripleshot',     name: 'Starbucks Triple Shot',          caffeine: 225, size: '200ml can',       category: 'rtd', emoji: '🥤' },
  { id: 'starbucks-cold-brew-rtd',  name: 'Starbucks Cold Brew Bottle',    caffeine: 155, size: '325ml bottle',   category: 'rtd', emoji: '🧊' },
  { id: 'starbucks-nitro-can',      name: 'Starbucks Nitro Cold Brew Can', caffeine: 215, size: '325ml can',       category: 'rtd', emoji: '🧊' },
  { id: 'starbucks-vanilla-latte',  name: 'Starbucks Vanilla Latte (RTD)', caffeine: 75,  size: '220ml bottle',   category: 'rtd', emoji: '🥤' },
  { id: 'starbucks-caramel-mac-rtd',name: 'Starbucks Caramel Macchiato (RTD)', caffeine: 75, size: '220ml bottle', category: 'rtd', emoji: '🥤' },
  { id: 'starbucks-refresher-straw',name: 'Starbucks Refreshers Strawberry Açaí', caffeine: 45, size: '355ml can', category: 'rtd', emoji: '🥤' },
  { id: 'starbucks-refresher-mango',name: 'Starbucks Refreshers Mango Dragonfruit', caffeine: 45, size: '355ml can', category: 'rtd', emoji: '🥤' },
  { id: 'costa-rtd-latte',          name: 'Costa Iced Latte (RTD)',         caffeine: 95,  size: '250ml bottle',   category: 'rtd', emoji: '🥤' },
  { id: 'costa-rtd-caramel-latte',  name: 'Costa Caramel Latte (RTD)',     caffeine: 95,  size: '250ml bottle',   category: 'rtd', emoji: '🥤' },
  { id: 'jimmys-iced-original',     name: "Jimmy's Iced Coffee Original",  caffeine: 69,  size: '330ml carton',   category: 'rtd', emoji: '🥤' },
  { id: 'jimmys-iced-latte',        name: "Jimmy's Iced Coffee Latte",     caffeine: 69,  size: '330ml carton',   category: 'rtd', emoji: '🥤' },
  { id: 'jimmys-iced-mocha',        name: "Jimmy's Iced Coffee Mocha",     caffeine: 69,  size: '330ml carton',   category: 'rtd', emoji: '🥤' },
  { id: 'minor-figures-cold-brew',  name: 'Minor Figures Cold Brew',       caffeine: 90,  size: '200ml can',       category: 'rtd', emoji: '🧊' },
  { id: 'sandows-cold-brew',        name: 'Sandow\'s Cold Brew',           caffeine: 120, size: '250ml bottle',   category: 'rtd', emoji: '🧊' },
  { id: 'emmi-caffe-latte',         name: 'Emmi Caffè Latte',              caffeine: 65,  size: '230ml bottle',   category: 'rtd', emoji: '🥤' },
  { id: 'nescafe-azera-rtd',        name: 'Nescafé Azera Iced Americano',  caffeine: 75,  size: '250ml can',       category: 'rtd', emoji: '🥤' },
  { id: 'honest-coffee-rtd',        name: 'Honest Coffee Cold Brew',       caffeine: 85,  size: '200ml bottle',   category: 'rtd', emoji: '🥤' },
  { id: 'old-spike-rtd',            name: 'Old Spike Cold Brew',           caffeine: 100, size: '250ml bottle',   category: 'rtd', emoji: '🧊' },

  // ═══════════════════════════════════════════════════════
  // 🍵  TEA
  // ═══════════════════════════════════════════════════════
  { id: 'black-tea',             name: 'Black Tea',                   caffeine: 47,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'green-tea',             name: 'Green Tea',                   caffeine: 28,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'white-tea',             name: 'White Tea',                   caffeine: 15,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'oolong-tea',            name: 'Oolong Tea',                  caffeine: 37,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'earl-grey',             name: 'Earl Grey',                   caffeine: 55,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'english-breakfast',     name: 'English Breakfast Tea',       caffeine: 50,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'chai-latte',            name: 'Chai Latte',                  caffeine: 50,  size: '12oz (355ml)',     category: 'tea', emoji: '🍵' },
  { id: 'matcha-latte',          name: 'Matcha Latte',                caffeine: 70,  size: '12oz (355ml)',     category: 'tea', emoji: '🍵' },
  { id: 'matcha-shot',           name: 'Matcha Shot',                 caffeine: 35,  size: '2oz (60ml)',       category: 'tea', emoji: '🍵' },
  { id: 'matcha-ceremonial',     name: 'Ceremonial Matcha',           caffeine: 70,  size: '1 tsp in 6oz',    category: 'tea', emoji: '🍵' },
  { id: 'yerba-mate',            name: 'Yerba Maté',                  caffeine: 85,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'guayusa',               name: 'Guayusa Tea',                 caffeine: 90,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'peppermint-tea',        name: 'Peppermint Tea',              caffeine: 0,   size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'rooibos',               name: 'Rooibos (Redbush)',           caffeine: 0,   size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'kombucha',              name: 'Kombucha',                    caffeine: 15,  size: '8oz (240ml)',      category: 'tea', emoji: '🍵' },
  { id: 'lipton-ice-tea',        name: 'Lipton Iced Tea (355ml)',     caffeine: 18,  size: '12oz (355ml)',     category: 'tea', emoji: '🍵' },
  { id: 'arizona-green-tea',     name: 'AriZona Green Tea (500ml)',   caffeine: 30,  size: '500ml can',        category: 'tea', emoji: '🍵' },
  { id: 'snapple-peach-tea',     name: 'Snapple Peach Tea (473ml)',   caffeine: 42,  size: '16oz (473ml)',     category: 'tea', emoji: '🍵' },

  // ═══════════════════════════════════════════════════════
  // ⚡  ENERGY DRINKS — Red Bull
  // ═══════════════════════════════════════════════════════
  { id: 'red-bull-250',          name: 'Red Bull Original (250ml)',        caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-355',          name: 'Red Bull Original (355ml)',        caffeine: 114, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-473',          name: 'Red Bull Original (473ml)',        caffeine: 151, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-sf-250',       name: 'Red Bull Sugar Free (250ml)',      caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-zero-250',     name: 'Red Bull Zero (250ml)',            caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-tropical',     name: 'Red Bull Tropical (250ml)',        caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-blueberry',    name: 'Red Bull Blueberry (250ml)',       caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-coconut',      name: 'Red Bull Coconut Berry (250ml)',   caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-watermelon',   name: 'Red Bull Watermelon (250ml)',      caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-acai',         name: 'Red Bull Açaí Berry (250ml)',      caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-kiwi',         name: 'Red Bull Kiwi Apple (250ml)',      caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-peach',        name: 'Red Bull Peach Nectarine (250ml)',caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-lime',         name: 'Red Bull Lime (250ml)',            caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-strawberry',   name: 'Red Bull Strawberry Apricot (250ml)', caffeine: 80, size: '250ml can',    category: 'energy', emoji: '⚡' },
  { id: 'red-bull-winter',       name: 'Red Bull Winter Edition (250ml)', caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'red-bull-summer',       name: 'Red Bull Summer Edition (250ml)', caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },

  // ── Monster ──────────────────────────────────────────
  { id: 'monster-original-500',  name: 'Monster Original (500ml)',         caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-original-355',  name: 'Monster Original (355ml)',         caffeine: 115, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-white',   name: 'Monster Ultra White (500ml)',      caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-zero',    name: 'Monster Ultra Zero (500ml)',       caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-sunrise', name: 'Monster Ultra Sunrise (500ml)',    caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-blue',    name: 'Monster Ultra Blue (500ml)',       caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-red',     name: 'Monster Ultra Red (500ml)',        caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-gold',    name: 'Monster Ultra Gold (500ml)',       caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-fiesta',  name: 'Monster Ultra Fiesta (500ml)',     caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-rosa',    name: 'Monster Ultra Rosá (500ml)',       caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-paradise',name: 'Monster Ultra Paradise (500ml)',   caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ultra-violet',  name: 'Monster Ultra Violet (500ml)',     caffeine: 150, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-mango-loco',    name: 'Monster Mango Loco (500ml)',       caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-pipeline',      name: 'Monster Pipeline Punch (500ml)',   caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-pacific',       name: 'Monster Pacific Punch (500ml)',    caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-bad-apple',     name: 'Monster Bad Apple (500ml)',        caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-assault',       name: 'Monster Assault (500ml)',          caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-ripper',        name: 'Monster Ripper (500ml)',           caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-nitro',         name: 'Monster Nitro Super Dry (500ml)', caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-lo-carb',       name: 'Monster Lo-Carb (500ml)',          caffeine: 140, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-absolutely-zero', name: 'Monster Absolutely Zero (500ml)', caffeine: 140, size: '500ml can',     category: 'energy', emoji: '⚡' },
  { id: 'monster-import',        name: 'Monster Import (460ml)',           caffeine: 147, size: '460ml bottle',   category: 'energy', emoji: '⚡' },
  { id: 'monster-rehab-lemon',   name: 'Monster Rehab Lemonade (500ml)',  caffeine: 82,  size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-rehab-peach',   name: 'Monster Rehab Peach Tea (500ml)', caffeine: 82,  size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-juiced-khaotic',name: 'Monster Juiced Khaotic (500ml)',  caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-lewis-hamilton', name: 'Monster Lewis Hamilton 44 (500ml)', caffeine: 160, size: '500ml can',   category: 'energy', emoji: '⚡' },
  { id: 'monster-monarch',       name: 'Monster Monarch (500ml)',          caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'monster-doctor',        name: 'Monster Doctor (500ml)',           caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },

  // ── NOCCO ────────────────────────────────────────────
  { id: 'nocco-caribbean',       name: 'NOCCO BCAA Caribbean (330ml)',     caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-tropical',        name: 'NOCCO BCAA Tropical (330ml)',      caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-limon',           name: 'NOCCO BCAA Limon Del Sol (330ml)', caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-cherry',          name: 'NOCCO BCAA Cherry (330ml)',        caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-blood-orange',    name: 'NOCCO BCAA Blood Orange (330ml)', caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-passionfruit',    name: 'NOCCO BCAA Passionfruit (330ml)', caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-apple',           name: 'NOCCO BCAA Apple (330ml)',         caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-peach',           name: 'NOCCO BCAA Peach (330ml)',         caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-strawberry',      name: 'NOCCO BCAA Strawberry (330ml)',   caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-nordic',          name: 'NOCCO BCAA Nordic Berries (330ml)', caffeine: 180, size: '330ml can',     category: 'energy', emoji: '⚡' },
  { id: 'nocco-grape',           name: 'NOCCO BCAA Grape (330ml)',         caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-elderflower',     name: 'NOCCO BCAA Elderflower (330ml)',   caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-raspberry',       name: 'NOCCO BCAA Raspberry (330ml)',     caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-melon',           name: 'NOCCO BCAA Melon (330ml)',         caffeine: 180, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-grape-passion',   name: 'NOCCO BCAA Grape & Passion (330ml)', caffeine: 180, size: '330ml can',   category: 'energy', emoji: '⚡' },
  { id: 'nocco-focus-mango',     name: 'NOCCO Focus Mango (330ml)',        caffeine: 200, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-focus-apple',     name: 'NOCCO Focus Apple (330ml)',        caffeine: 200, size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'nocco-pump',            name: 'NOCCO Pump (500ml)',               caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },

  // ── Reign ────────────────────────────────────────────
  { id: 'reign-orange',          name: 'Reign Orange Dreamsicle (500ml)', caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'reign-lemon',           name: 'Reign Lemon HDZ (500ml)',          caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'reign-melon',           name: 'Reign Melon Mania (500ml)',        caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'reign-strawberry',      name: 'Reign Strawberry Sublime (500ml)', caffeine: 300, size: '500ml can',      category: 'energy', emoji: '⚡' },
  { id: 'reign-raspberry',       name: 'Reign Raspberry Hibiscus (500ml)', caffeine: 300, size: '500ml can',      category: 'energy', emoji: '⚡' },
  { id: 'reign-white-gummy',     name: 'Reign White Gummy Bear (500ml)',  caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'reign-mango',           name: 'Reign Mang-O-Matic (500ml)',       caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'reign-blue-razz',       name: 'Reign Blue Razz (500ml)',          caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'reign-lilikoi',         name: 'Reign Lilikoi Lychee (500ml)',     caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'reign-carnival',        name: 'Reign Carnival Candy (500ml)',     caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },

  // ── Bang ─────────────────────────────────────────────
  { id: 'bang-cotton-candy',     name: 'Bang Cotton Candy (500ml)',        caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bang-peach-mango',      name: 'Bang Peach Mango (500ml)',         caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bang-birthday-cake',    name: 'Bang Birthday Cake Bash (500ml)', caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bang-purple-haze',      name: 'Bang Purple Haze (500ml)',         caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bang-rainbow',          name: 'Bang Rainbow Unicorn (500ml)',     caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bang-star-blast',       name: 'Bang Star Blast (500ml)',          caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bang-black-cherry',     name: 'Bang Black Cherry Vanilla (500ml)', caffeine: 300, size: '500ml can',     category: 'energy', emoji: '⚡' },
  { id: 'bang-blue-razz',        name: 'Bang Blue Razz (500ml)',           caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bang-lemon-drop',       name: 'Bang Lemon Drop (500ml)',          caffeine: 300, size: '500ml can',       category: 'energy', emoji: '⚡' },

  // ── Celsius ───────────────────────────────────────────
  { id: 'celsius-peach',         name: 'Celsius Peach Mango Green Tea',   caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'celsius-orange',        name: 'Celsius Sparkling Orange',         caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'celsius-watermelon',    name: 'Celsius Watermelon Berry',         caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'celsius-berry',         name: 'Celsius Wild Berry',               caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'celsius-kiwi',          name: 'Celsius Kiwi Guava Lime',          caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'celsius-grapefruit',    name: 'Celsius Grapefruit',               caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'celsius-heat',          name: 'Celsius HEAT (473ml)',             caffeine: 300, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'celsius-bcaa',          name: 'Celsius BCAA',                     caffeine: 100, size: '355ml can',       category: 'energy', emoji: '⚡' },

  // ── C4 Energy ─────────────────────────────────────────
  { id: 'c4-cotton-candy',       name: 'C4 Energy Cotton Candy (473ml)',  caffeine: 200, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'c4-orange',             name: 'C4 Energy Orange Slice (473ml)',  caffeine: 200, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'c4-tropical',           name: 'C4 Energy Tropical Blast (473ml)', caffeine: 200, size: '473ml can',      category: 'energy', emoji: '⚡' },
  { id: 'c4-pink-lemonade',      name: 'C4 Energy Pink Lemonade (473ml)', caffeine: 200, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'c4-starburst',          name: 'C4 Energy Starburst Strawberry (473ml)', caffeine: 200, size: '473ml can', category: 'energy', emoji: '⚡' },
  { id: 'c4-smart-300',          name: 'C4 Smart Energy (355ml)',          caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },

  // ── Ghost Energy ──────────────────────────────────────
  { id: 'ghost-warheads',        name: 'Ghost Energy Warheads Sour (473ml)', caffeine: 200, size: '473ml can',    category: 'energy', emoji: '⚡' },
  { id: 'ghost-sour-patch',      name: 'Ghost Energy Sour Patch Kids (473ml)', caffeine: 200, size: '473ml can', category: 'energy', emoji: '⚡' },
  { id: 'ghost-swedish',         name: 'Ghost Energy Swedish Fish (473ml)', caffeine: 200, size: '473ml can',     category: 'energy', emoji: '⚡' },
  { id: 'ghost-tropical',        name: 'Ghost Energy Tropical Mango (473ml)', caffeine: 200, size: '473ml can',  category: 'energy', emoji: '⚡' },
  { id: 'ghost-orange-cream',    name: 'Ghost Energy Orange Cream (473ml)', caffeine: 200, size: '473ml can',    category: 'energy', emoji: '⚡' },
  { id: 'ghost-bubblicious',     name: 'Ghost Energy Bubblicious (473ml)', caffeine: 200, size: '473ml can',      category: 'energy', emoji: '⚡' },

  // ── Prime Energy ──────────────────────────────────────
  { id: 'prime-meta-moon',       name: 'Prime Energy Meta Moon (355ml)',  caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'prime-orange-mango',    name: 'Prime Energy Orange Mango (355ml)', caffeine: 200, size: '355ml can',    category: 'energy', emoji: '⚡' },
  { id: 'prime-tropical',        name: 'Prime Energy Tropical Punch (355ml)', caffeine: 200, size: '355ml can',  category: 'energy', emoji: '⚡' },
  { id: 'prime-blue-razz',       name: 'Prime Energy Blue Raspberry (355ml)', caffeine: 200, size: '355ml can', category: 'energy', emoji: '⚡' },
  { id: 'prime-lemon-lime',      name: 'Prime Energy Lemon Lime (355ml)', caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'prime-strawberry',      name: 'Prime Energy Strawberry Watermelon (355ml)', caffeine: 200, size: '355ml can', category: 'energy', emoji: '⚡' },
  { id: 'prime-ice-pop',         name: 'Prime Energy Ice Pop (355ml)',    caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },

  // ── Rockstar ──────────────────────────────────────────
  { id: 'rockstar-original',     name: 'Rockstar Original (500ml)',        caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'rockstar-punched',      name: 'Rockstar Punched (500ml)',         caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'rockstar-xdurance',     name: 'Rockstar XDurance (500ml)',        caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'rockstar-focus',        name: 'Rockstar Focus (500ml)',            caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'rockstar-zero-mango',   name: 'Rockstar Zero Mango (500ml)',      caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'rockstar-juiced-mango', name: 'Rockstar Juiced Mango (500ml)',    caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },

  // ── UK / European brands ──────────────────────────────
  { id: 'relentless-original',   name: 'Relentless Origin (500ml)',        caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'relentless-passion',    name: 'Relentless Passion (500ml)',       caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'relentless-mango',      name: 'Relentless Mango (500ml)',         caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'relentless-cherry',     name: 'Relentless Cherry (500ml)',        caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'boost-original-250',    name: 'Boost Original (250ml)',           caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'boost-sf-250',          name: 'Boost Sugar Free (250ml)',         caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'lucozade-energy-380',   name: 'Lucozade Energy Original (380ml)', caffeine: 46,  size: '380ml bottle',   category: 'energy', emoji: '⚡' },
  { id: 'lucozade-orange-380',   name: 'Lucozade Orange (380ml)',          caffeine: 46,  size: '380ml bottle',   category: 'energy', emoji: '⚡' },
  { id: 'lucozade-pink-lemon',   name: 'Lucozade Pink Lemonade (380ml)',  caffeine: 46,  size: '380ml bottle',   category: 'energy', emoji: '⚡' },
  { id: 'lucozade-raspberry',    name: 'Lucozade Raspberry (380ml)',       caffeine: 46,  size: '380ml bottle',   category: 'energy', emoji: '⚡' },
  { id: 'gorilla-original',      name: 'Gorilla Energy (500ml)',           caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'carabao-green-apple',   name: 'Carabao Green Apple (330ml)',      caffeine: 30,  size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'carabao-original',      name: 'Carabao Original (330ml)',         caffeine: 30,  size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'carabao-mango',         name: 'Carabao Mango (330ml)',            caffeine: 30,  size: '330ml can',       category: 'energy', emoji: '⚡' },
  { id: 'emerge-original',       name: 'Emerge Original (250ml)',          caffeine: 75,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'dark-dog-original',     name: 'Dark Dog Original (250ml)',        caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'effect-energy',         name: 'Effect Energy (250ml)',            caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'hell-original',         name: 'Hell Energy Original (250ml)',     caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'hell-strong',           name: 'Hell Strong (500ml)',              caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'sting-original',        name: 'Sting Energy Original (500ml)',   caffeine: 200, size: '500ml bottle',   category: 'energy', emoji: '⚡' },
  { id: 'cadence-energy',        name: 'Cadence Energy (500ml)',           caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'v-energy-250',          name: 'V Energy (250ml)',                 caffeine: 78,  size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'v-energy-500',          name: 'V Energy (500ml)',                 caffeine: 155, size: '500ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bat-original',          name: 'BAT Energy Original (500ml)',      caffeine: 160, size: '500ml can',       category: 'energy', emoji: '⚡' },

  // ── US / Global brands ────────────────────────────────
  { id: '5hour-energy',          name: '5-Hour Energy (60ml)',             caffeine: 200, size: '2oz (60ml)',       category: 'energy', emoji: '⚡' },
  { id: '5hour-energy-extra',    name: '5-Hour Energy Extra Strength',     caffeine: 230, size: '2oz (60ml)',       category: 'energy', emoji: '⚡' },
  { id: 'nos-energy',            name: 'NOS Energy (473ml)',               caffeine: 160, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'full-throttle',         name: 'Full Throttle (473ml)',            caffeine: 144, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'xyience-cherry-lime',   name: 'Xyience Cherry Lime (355ml)',      caffeine: 176, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'raze-energy',           name: 'Raze Energy (473ml)',              caffeine: 300, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'alani-nu',              name: 'Alani Nu (355ml)',                 caffeine: 200, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: '3d-energy',             name: '3D Energy (473ml)',                caffeine: 200, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'zoa-original',          name: 'ZOA Energy Original (355ml)',      caffeine: 160, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'zoa-zero-sugar',        name: 'ZOA Energy Zero Sugar (355ml)',    caffeine: 160, size: '355ml can',       category: 'energy', emoji: '⚡' },
  { id: 'bucked-up',             name: 'Bucked Up Energy (473ml)',         caffeine: 300, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'sneak-energy',          name: 'Sneak Energy (500ml)',             caffeine: 150, size: '500ml shaker',    category: 'energy', emoji: '⚡' },
  { id: 'gfuel-can',             name: 'G Fuel Energy Can (473ml)',        caffeine: 150, size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'game-fuel',             name: 'Mountain Dew Game Fuel (473ml)',  caffeine: 90,  size: '473ml can',       category: 'energy', emoji: '⚡' },
  { id: 'guru-original',         name: 'Guru Energy Original (250ml)',     caffeine: 100, size: '250ml can',       category: 'energy', emoji: '⚡' },
  { id: 'xs-energy',             name: 'XS Energy (250ml)',                caffeine: 80,  size: '250ml can',       category: 'energy', emoji: '⚡' },

  // ═══════════════════════════════════════════════════════
  // 🥤  SODA & SOFT DRINKS
  // ═══════════════════════════════════════════════════════
  { id: 'coca-cola-330',         name: 'Coca-Cola (330ml)',                caffeine: 32,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'coca-cola-355',         name: 'Coca-Cola (12oz)',                 caffeine: 34,  size: '355ml can',       category: 'soda', emoji: '🥤' },
  { id: 'coca-cola-500',         name: 'Coca-Cola (500ml)',                caffeine: 50,  size: '500ml bottle',   category: 'soda', emoji: '🥤' },
  { id: 'diet-coke-330',         name: 'Diet Coke (330ml)',                caffeine: 42,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'coke-zero-330',         name: 'Coke Zero Sugar (330ml)',          caffeine: 32,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'pepsi-330',             name: 'Pepsi (330ml)',                    caffeine: 35,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'pepsi-max-330',         name: 'Pepsi Max (330ml)',                caffeine: 43,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'pepsi-max-500',         name: 'Pepsi Max (500ml)',                caffeine: 64,  size: '500ml bottle',   category: 'soda', emoji: '🥤' },
  { id: 'mountain-dew-355',      name: 'Mountain Dew (355ml)',             caffeine: 54,  size: '355ml can',       category: 'soda', emoji: '🥤' },
  { id: 'dr-pepper-330',         name: 'Dr Pepper (330ml)',                caffeine: 39,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'irn-bru-330',           name: "Irn-Bru (330ml)",                  caffeine: 30,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'irn-bru-energy-500',    name: "Irn-Bru Energy (500ml)",           caffeine: 160, size: '500ml can',       category: 'soda', emoji: '🥤' },
  { id: 'cherry-coke-330',       name: 'Cherry Coke (330ml)',              caffeine: 34,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'vanilla-coke-330',      name: 'Vanilla Coke (330ml)',             caffeine: 34,  size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'sprite-330',            name: 'Sprite (330ml)',                   caffeine: 0,   size: '330ml can',       category: 'soda', emoji: '🥤' },
  { id: 'fanta-330',             name: 'Fanta (330ml)',                    caffeine: 0,   size: '330ml can',       category: 'soda', emoji: '🥤' },

  // ═══════════════════════════════════════════════════════
  // 💊  SUPPLEMENTS & PRE-WORKOUT
  // ═══════════════════════════════════════════════════════
  { id: 'preworkout-100',        name: 'Pre-Workout (Light, 1 scoop)',     caffeine: 100, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'preworkout-150',        name: 'Pre-Workout (Standard, 1 scoop)', caffeine: 150, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'preworkout-200',        name: 'Pre-Workout (Strong, 1 scoop)',   caffeine: 200, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'preworkout-300',        name: 'Pre-Workout (Maximum, 1 scoop)',  caffeine: 300, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'preworkout-2x',         name: 'Pre-Workout (2 scoops)',           caffeine: 400, size: '2 scoops',         category: 'supplement', emoji: '💊' },
  { id: 'total-war',             name: 'Total War Pre-Workout (1 scoop)', caffeine: 320, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'legion-pulse',          name: 'Legion Pulse Pre-Workout',         caffeine: 350, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'optimum-gold',          name: 'Optimum Gold Pre-Workout',         caffeine: 175, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'cbum-thavage',          name: 'CBUM Thavage Pre-Workout',         caffeine: 275, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'gfuel-powder',          name: 'G Fuel Powder (1 scoop)',          caffeine: 150, size: '1 scoop in 16oz',  category: 'supplement', emoji: '💊' },
  { id: 'sneak-powder',          name: 'Sneak Energy Powder (1 scoop)',    caffeine: 150, size: '1 scoop',          category: 'supplement', emoji: '💊' },
  { id: 'caffeine-pill-100',     name: 'Caffeine Tablet 100mg',            caffeine: 100, size: '1 tablet',         category: 'supplement', emoji: '💊' },
  { id: 'caffeine-pill-200',     name: 'Caffeine Tablet 200mg',            caffeine: 200, size: '1 tablet',         category: 'supplement', emoji: '💊' },
  { id: 'pro-plus',              name: 'Pro Plus (UK)',                    caffeine: 50,  size: '1 tablet',         category: 'supplement', emoji: '💊' },
  { id: 'fat-burner',            name: 'Fat Burner (avg, 1 cap)',          caffeine: 100, size: '1 capsule',        category: 'supplement', emoji: '💊' },
  { id: 'nootropic-stack',       name: 'Nootropic Stack (caffeine based)', caffeine: 100, size: '1 serving',        category: 'supplement', emoji: '💊' },

];

// ─────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all',        label: 'All',         emoji: '🔍' },
  { id: 'coffee',     label: 'Coffee',      emoji: '☕' },
  { id: 'rtd',        label: 'RTD Coffee',  emoji: '🥤' },
  { id: 'tea',        label: 'Tea',         emoji: '🍵' },
  { id: 'energy',     label: 'Energy',      emoji: '⚡' },
  { id: 'soda',       label: 'Soda',        emoji: '🥤' },
  { id: 'supplement', label: 'Supplements', emoji: '💊' },
];

// ─────────────────────────────────────────────────────────
// Quick-add bar on dashboard — most popular
// ─────────────────────────────────────────────────────────
export const QUICK_ADD_IDS = [
  'espresso',
  'drip-coffee-sm',
  'cold-brew',
  'red-bull-250',
  'monster-original-500',
  'nocco-caribbean',
];

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
export function getDrinkById(id) {
  return DRINKS.find(d => d.id === id) || null;
}

export function searchDrinks(query, category = 'all') {
  let results = DRINKS;
  if (category !== 'all') {
    results = results.filter(d => d.category === category);
  }
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  }
  return results;
}
