// items.js — All 1850 gear, provisions, trade goods, finds, and fixed props
// Schema: id, name, aliases, description, takeable, weight, found_in, uses, requires
window.ITEMS_DB = [
  // --- BOAT GEAR (start aboard or in Olympia gear locker) ---
  {
    id: "oars",
    name: "pair of spruce oars",
    aliases: ["oars", "oar", "spruce oars"],
    description: "Eight-foot spruce oars worn smooth at the looms, lashed along the thwarts.",
    takeable: true,
    weight: 8,
    found_in: "inventory",
    uses: ["row in calm water or tight passes"],
    requires: null
  },
  {
    id: "anchor",
    name: "iron anchor with hemp rode",
    aliases: ["anchor", "rode", "hemp rode", "iron anchor"],
    description: "A small folding iron grapnel bent to ten fathoms of tarred hemp line.",
    takeable: true,
    weight: 10,
    found_in: "inventory",
    uses: ["anchor in coves and shelter from weather"],
    requires: null
  },
  {
    id: "boat_hook",
    name: "boat hook",
    aliases: ["boat hook", "hook", "pike"],
    description: "An ash pole tipped with a blunt iron hook for fending off pilings and catching mooring lines.",
    takeable: true,
    weight: 3,
    found_in: "gear_locker",
    uses: ["fend off docks and haul floating gear"],
    requires: null
  },
  {
    id: "bailer",
    name: "wooden bailer",
    aliases: ["bailer", "wooden bailer", "scoop"],
    description: "A carved cedar scoop for clearing shipped water from the bilge.",
    takeable: true,
    weight: 1,
    found_in: "inventory",
    uses: ["bail water when swamped"],
    requires: null
  },
  {
    id: "bucket",
    name: "oak bucket",
    aliases: ["bucket", "oak bucket", "pail"],
    description: "A tarred oak bucket with a rope lanyard; doubles as a heavy bailer.",
    takeable: true,
    weight: 3,
    found_in: "gear_locker",
    uses: ["bail water rapidly"],
    requires: null
  },
  {
    id: "tarpaulin",
    name: "painted tarpaulin",
    aliases: ["tarpaulin", "tarp", "canvas"],
    description: "Heavy oiled sailcloth to lash over provisions and keep spray out of the stores.",
    takeable: true,
    weight: 4,
    found_in: "gear_locker",
    uses: ["tie down and shelter stores"],
    requires: null
  },
  {
    id: "spare_line",
    name: "coil of spare line",
    aliases: ["spare line", "line", "rope", "hemp line", "coil"],
    description: "Thirty feet of stout hemp line for lashing gear or mending a parted halyard.",
    takeable: true,
    weight: 2,
    found_in: "gear_locker",
    uses: ["tie down gear", "repair rigging"],
    requires: null
  },

  // --- NAVIGATION (earning HUD instruments) ---
  {
    id: "brass_compass",
    name: "brass compass",
    aliases: ["compass", "brass compass", "pocket compass"],
    description: "A dull brass pocket compass in a gimbaled box. Taking it gives you a steady bearing.",
    takeable: true,
    weight: 1,
    found_in: "gear_locker",
    uses: ["shows compass rose and open exits"],
    requires: null
  },
  {
    id: "tide_notes",
    name: "tide notes",
    aliases: ["tide notes", "tide book", "tide booklet", "tide table", "notes", "booklet", "table"],
    description: "A salt-stained pocket notebook of South Sound tide turns copied from Hudson's Bay skippers. Roughly accurate, give or take a turn.",
    takeable: true,
    weight: 0.5,
    found_in: "gear_locker",
    uses: ["shows approximate tide gauge and next slack"],
    requires: null
  },
  {
    id: "lead_line",
    name: "lead line",
    aliases: ["lead line", "lead", "sounding line", "plumb"],
    description: "A four-pound lead weight on a marked hemp line for sounding depth in muddy shoals.",
    takeable: true,
    weight: 4,
    found_in: "gear_locker",
    uses: ["sound depth in shoals to prevent grounding"],
    requires: null
  },
  {
    id: "spyglass",
    name: "brass spyglass",
    aliases: ["spyglass", "glass", "telescope"],
    description: "A single-draw brass glass with slightly salt-pitted lenses for reading distant shores and weather.",
    takeable: true,
    weight: 1,
    found_in: "fort_nisqually",
    uses: ["inspect distant exits and horizons"],
    requires: null
  },
  {
    id: "wilkes_chart",
    name: "1841 Wilkes chart",
    aliases: ["chart", "wilkes chart", "map", "1841 chart"],
    description: "A folded linen-backed copy of Lieutenant Charles Wilkes's 1841 Puget Sound survey. Soundings grow sparser north of Admiralty Inlet.",
    takeable: true,
    weight: 1,
    found_in: "olympia_landing",
    uses: ["view basin connections and notes"],
    requires: null
  },
  {
    id: "logbook",
    name: "logbook and pen",
    aliases: ["logbook", "pen", "journal", "log book"],
    description: "A canvas-bound ship's journal with a steel nib pen and corked inkwell.",
    takeable: true,
    weight: 1,
    found_in: "inventory",
    uses: ["record voyage entries and place names"],
    requires: null
  },

  // --- PROVISIONS ---
  {
    id: "biscuit",
    name: "ship's biscuit",
    aliases: ["biscuit", "biscuits", "hardtack", "ships biscuit", "ship's biscuit"],
    description: "Hard-baked flour cakes that keep for months if kept dry.",
    takeable: true,
    weight: 3,
    found_in: "inventory",
    edible: true,
    foodValue: 20,
    uses: ["eat to restore strength"],
    requires: null
  },
  {
    id: "salt_pork",
    name: "salt pork",
    aliases: ["salt pork", "pork", "meat"],
    description: "Brine-cured pork wrapped in oiled cloth.",
    takeable: true,
    weight: 4,
    found_in: "gear_locker",
    edible: true,
    foodValue: 30,
    uses: ["eat to restore strength"],
    requires: null
  },
  {
    id: "flour",
    name: "sack of flour",
    aliases: ["flour", "sack of flour", "sack"],
    description: "Ten pounds of coarse mill flour from Tumwater in a sewn cotton sack.",
    takeable: true,
    weight: 5,
    found_in: "tumwater",
    edible: true,
    foodValue: 25,
    uses: ["cook into bannock with frying pan and fire"],
    requires: "frying_pan"
  },
  {
    id: "tea",
    name: "tin of black tea",
    aliases: ["tea", "black tea"],
    description: "Compressed black tea leaves in a tight tin.",
    takeable: true,
    weight: 1,
    found_in: "fort_nisqually",
    edible: true,
    foodValue: 10,
    uses: ["brew hot tea to ease fatigue"],
    requires: "tin_cup"
  },
  {
    id: "water_keg",
    name: "water keg",
    aliases: ["water keg", "keg", "water", "cask"],
    description: "An oak breaker holding fresh drinking water. Refill at creeks and springs.",
    takeable: true,
    weight: 8,
    found_in: "inventory",
    uses: ["drink water", "refill at fresh springs"],
    requires: null
  },
  {
    id: "tin_cup",
    name: "tin cup",
    aliases: ["tin cup", "cup", "mug"],
    description: "A dented tin cup hanging from a leather thong.",
    takeable: true,
    weight: 0.5,
    found_in: "inventory",
    uses: ["drink water or brew tea"],
    requires: null
  },
  {
    id: "frying_pan",
    name: "iron frying pan",
    aliases: ["frying pan", "pan", "skillet"],
    description: "A soot-blackened wrought-iron skillet.",
    takeable: true,
    weight: 3,
    found_in: "gear_locker",
    uses: ["cook fish, pork, or flour ashore"],
    requires: "tinderbox"
  },
  {
    id: "tinderbox",
    name: "flint, steel and tinderbox",
    aliases: ["tinderbox", "flint", "steel", "fire"],
    description: "A brass box holding flint, forged striker steel, and charred linen.",
    takeable: true,
    weight: 1,
    found_in: "gear_locker",
    uses: ["strike a cooking fire ashore"],
    requires: null
  },

  // --- FISHING ---
  {
    id: "hand_line",
    name: "hand line and hooks",
    aliases: ["hand line", "handline", "fishing line", "hooks", "line and hooks"],
    description: "A wooden frame wound with braided linen line, lead sinkers, and forged hooks.",
    takeable: true,
    weight: 1,
    found_in: "gear_locker",
    uses: ["fish for flounder, perch, or rockfish"],
    requires: null
  },
  {
    id: "fish_gaff",
    name: "fish gaff",
    aliases: ["fish gaff", "gaff"],
    description: "A short stout handle with a curved steel hook for landing heavy fish.",
    takeable: true,
    weight: 2,
    found_in: "steilacoom",
    uses: ["improves fishing odds"],
    requires: "hand_line"
  },
  {
    id: "crab_pot",
    name: "woven crab pot",
    aliases: ["crab pot", "pot", "trap"],
    description: "A cedar-frame and twine crab trap with a cork float. Bait with fish and leave overnight.",
    takeable: true,
    weight: 5,
    found_in: "squaxin_passage",
    openable: true,
    open: false,
    isCrabPot: true,
    baited: false,
    setTurn: null,
    contents: [],
    uses: ["bait with fish and set overnight for crab"],
    requires: null
  },

  // --- TRADE & MEDICINE ---
  {
    id: "hbc_blankets",
    name: "Hudson's Bay blankets",
    aliases: ["blankets", "blanket", "hbc blankets", "hudson's bay blankets", "point blanket"],
    description: "Heavy white wool three-point blankets—accepted as currency at posts and villages across the Sound.",
    takeable: true,
    weight: 6,
    found_in: "fort_nisqually",
    uses: ["trade for provisions or local knowledge"],
    requires: null
  },
  {
    id: "tobacco",
    name: "plug of tobacco",
    aliases: ["tobacco", "plug"],
    description: "Dark twist tobacco wrapped in oiled paper for trade.",
    takeable: true,
    weight: 1,
    found_in: "olympia_landing",
    uses: ["small trade gift"],
    requires: null
  },
  {
    id: "powder_shot",
    name: "powder and shot",
    aliases: ["powder", "shot", "powder and shot", "horn"],
    description: "A corked horn of black powder and a leather pouch of lead shot—strictly dry-stowed trade goods.",
    takeable: true,
    weight: 3,
    found_in: "fort_nisqually",
    uses: ["trade at posts"],
    requires: null
  },
  {
    id: "medicine_chest",
    name: "medicine chest",
    aliases: ["medicine chest", "medicine", "chest", "laudanum"],
    description: "A small mahogany box of bandages, quinine bark, and smelling salts.",
    takeable: true,
    weight: 3,
    found_in: "steilacoom",
    uses: ["treat shellfish sickness or injury"],
    requires: null
  },

  // --- FINDS (no sacred/burial objects; coastal flotsam & ordinary relics) ---
  {
    id: "old_bottle",
    name: "old bottle with a note",
    aliases: ["bottle", "old bottle", "note", "glass bottle"],
    description: "A thick green glass bottle corked with pitch, washed up among driftwood. A rolled paper sits inside.",
    readable: "Written in faded brown ink, 1848: 'Beware clams and mussels in warm months—two men from a brig fell gravely ill off the flats. Watch the ebb at Point Wilson.'",
    takeable: true,
    weight: 1,
    found_in: "dungeness_spit",
    uses: ["read note"],
    requires: null
  },
  {
    id: "beach_agate",
    name: "beach agate",
    aliases: ["agate", "beach agate", "stone", "pebble"],
    description: "A translucent amber-gray chalcedony agate tumbled smooth by Strait swells.",
    takeable: true,
    weight: 0.2,
    found_in: "hope_island",
    uses: ["keepsake"],
    requires: null
  },
  {
    id: "cedar_driftwood",
    name: "cedar driftwood",
    aliases: ["driftwood", "cedar driftwood", "cedar", "wood"],
    description: "A dry, straight-grained billet of red cedar—good for patching a cracked strake or kindling.",
    takeable: true,
    weight: 3,
    found_in: "budd_inlet",
    uses: ["repair minor hull damage"],
    requires: null
  },
  {
    id: "rusted_tin",
    name: "rusted tin",
    aliases: ["rusted tin", "tin", "tin box"],
    description: "A salt-pitted ship's tin wedged under a fir root. A small brass keyhole guards the lid.",
    takeable: true,
    weight: 1,
    found_in: "blake_island",
    openable: true,
    open: false,
    locked: true,
    keyId: "brass_key",
    contents: [
      {
        id: "old_letter",
        name: "waxed survey note",
        aliases: ["survey note", "letter", "paper"],
        description: "A waxed paper folded inside the tin.",
        readable: "1846 note: 'Deception Pass and Tacoma Narrows are gentle only at slack. Hold to Eagle Harbor or Port Townsend when west gales blow.'",
        takeable: true,
        weight: 0.1
      }
    ],
    uses: ["unlock with brass key"],
    requires: "brass_key"
  },
  {
    id: "brass_key",
    name: "brass key",
    aliases: ["key", "brass key"],
    description: "A small tarnish-green brass cabinet key found in the shingle.",
    takeable: true,
    weight: 0.1,
    found_in: "port_townsend",
    uses: ["unlock rusted tin"],
    requires: null
  },

  // --- FIXED PROPS / CONTAINERS / RESOURCE NODES ---
  {
    id: "dock_cleat",
    name: "iron cleat",
    aliases: ["cleat", "dock", "landing", "piling"],
    description: "A heavy iron cleat bolted to the landing stringer.",
    takeable: false,
    weight: 0,
    found_in: "olympia_landing",
    uses: ["tie boat"],
    requires: null
  },
  {
    id: "gear_locker",
    name: "gear locker",
    aliases: ["locker", "gear locker", "wooden locker", "box"],
    description: "A stout cedar locker on the landing holding your boat's extra gear and stores.",
    takeable: false,
    weight: 0,
    found_in: "olympia_landing",
    openable: true,
    open: false,
    contents: [], // Populated at init from items with found_in === "gear_locker"
    uses: ["store or take gear"],
    requires: null
  },
  {
    id: "trading_post_notice",
    name: "posted notice",
    aliases: ["notice", "posted notice", "sign", "board"],
    description: "A hand-lettered sheet tacked to the trading store wall.",
    readable: "OREGON TERRITORY, 1850 — Small craft bound north: mind the tide gates at Hammersley, Tacoma Narrows, Agate Pass, and Deception Pass. Sound the shoals with a lead line.",
    takeable: false,
    weight: 0,
    found_in: "olympia_landing",
    uses: ["read"],
    requires: null
  },
  {
    id: "fresh_spring",
    name: "fresh water creek",
    aliases: ["spring", "creek", "fresh water", "stream"],
    description: "Clear cold mountain water pouring over moss-covered gravel. Good for filling a water keg.",
    takeable: false,
    weight: 0,
    found_in: "tumwater",
    isWaterSource: true,
    uses: ["fill water keg"],
    requires: "water_keg"
  },
  {
    id: "clam_bed",
    name: "clam flat",
    aliases: ["clams", "clam", "clam bed", "clam flat", "shellfish"],
    description: "Wet gravel pocked with clam siphons at low water.",
    takeable: false,
    weight: 0,
    found_in: "budd_inlet",
    gatherable: {
      id: "clams",
      name: "butter clams",
      aliases: ["clams", "clam", "shellfish"],
      description: "A handful of heavy butter clams gathered from the gravel.",
      takeable: true,
      weight: 2,
      edible: true,
      isShellfish: true,
      foodValue: 18
    },
    uses: ["gather clams"],
    requires: null
  },
  {
    id: "oyster_bed",
    name: "oyster bed",
    aliases: ["oysters", "oyster", "oyster bed", "shellfish"],
    description: "Clusters of small native Olympia oysters clinging to gravel bars.",
    takeable: false,
    weight: 0,
    found_in: "eld_inlet",
    gatherable: {
      id: "oysters",
      name: "native oysters",
      aliases: ["oysters", "oyster", "shellfish"],
      description: "Small coppery-shelled native oysters.",
      takeable: true,
      weight: 2,
      edible: true,
      isShellfish: true,
      foodValue: 15
    },
    uses: ["gather oysters"],
    requires: null
  },
  {
    id: "hbc_clerk",
    name: "Company clerk",
    aliases: ["clerk", "trader", "company clerk", "man"],
    description: "A Scottish clerk of the Hudson's Bay Company tallying wool bales. He nods to you: 'Keep clear of shellfish in warm months—folks have died of them. Trade a blanket if you need repairs.'",
    takeable: false,
    weight: 0,
    found_in: "fort_nisqually",
    uses: ["give blankets for hull repair and water"],
    requires: null
  }
];

window.FISH_POOL = [
  { name: "flounder", aliases: ["fish", "flounder", "bait"], description: "A flat speckled starry flounder.", takeable: true, weight: 2, edible: true, foodValue: 22, isBait: true, releasable: true },
  { name: "perch", aliases: ["fish", "perch", "bait"], description: "A silver-sided pile perch.", takeable: true, weight: 1.5, edible: true, foodValue: 18, isBait: true, releasable: true },
  { name: "rockfish", aliases: ["fish", "rockfish", "rock fish", "bait"], description: "A dark-backed kelp rockfish.", takeable: true, weight: 2.5, edible: true, foodValue: 25, isBait: true, releasable: true }
];

window.CRAB_TEMPLATE = {
  id: "crab",
  name: "Dungeness crab",
  aliases: ["crab", "dungeness", "dungeness crab"],
  description: "A heavy Dungeness crab clicking its claws.",
  takeable: true,
  weight: 2,
  edible: true,
  foodValue: 28,
  releasable: true
};
