// items.js — Vessels, 1850 gear, provisions, tools, trade goods, finds, and fixed props
window.VESSELS = {
  skiff: {
    id: "skiff",
    name: "sloop-rigged skiff",
    cargoLimit: 250,
    crewMax: 1,
    riskBonus: 0,
    costBlankets: 0,
    description: "A 16-foot open wooden skiff with spruce oars and a lugsail. Light, nimble, and risky in exposed northern straits."
  },
  whaleboat: {
    id: "whaleboat",
    name: "double-ended whaleboat",
    cargoLimit: 550,
    crewMax: 2,
    riskBonus: -1,
    costBlankets: 4,
    description: "A stout 24-foot double-ended whaleboat with two pulling stations and a dipping lug. Built for open crossings."
  },
  schooner: {
    id: "schooner",
    name: "coastal trading schooner",
    cargoLimit: 1200,
    crewMax: 4,
    riskBonus: -2,
    costBlankets: 10,
    description: "A decked 36-foot coastal schooner with fore-and-aft rig and dry hold. Steady enough for Queen Charlotte Sound and Dixon Entrance."
  }
};

window.ITEMS_DB = [
  // --- DISPATCH (main ambition) ---
  {
    id: "dispatch_letter",
    name: "sealed dispatch for Sitka",
    aliases: ["dispatch", "letter", "message", "sealed dispatch", "sealed letter"],
    description: "A waxed oilskin packet stamped in red sealing wax, addressed to the Russian-American Company headquarters at New Archangel (Sitka).",
    readable: "Addressed on the outer oilskin: 'To the Chief Manager, Russian-American Company, New Archangel, Sitka. By hand from Oregon Territory, Spring 1850.'",
    takeable: true,
    weight: 0.5,
    found_in: "inventory",
    uses: ["deliver at Sitka (New Archangel)"],
    requires: null
  },

  // --- BOAT GEAR ---
  {
    id: "oars",
    name: "pair of spruce oars",
    aliases: ["oars", "oar", "spruce oars"],
    description: "Eight-foot spruce oars worn smooth at the looms.",
    takeable: true,
    weight: 14,
    found_in: "inventory",
    uses: ["row in calm water or tight passes"],
    requires: null
  },
  {
    id: "anchor",
    name: "iron anchor with hemp rode",
    aliases: ["anchor", "rode", "hemp rode", "iron anchor"],
    description: "A folding iron grapnel bent to ten fathoms of tarred hemp line.",
    takeable: true,
    weight: 22,
    found_in: "inventory",
    uses: ["anchor in sheltered coves"],
    requires: null
  },
  {
    id: "boat_hook",
    name: "boat hook",
    aliases: ["boat hook", "hook", "pike"],
    description: "An ash pole tipped with an iron hook for fending off pilings and catching lines.",
    takeable: true,
    weight: 5,
    found_in: "gear_locker",
    uses: ["fend off docks and haul gear"],
    requires: null
  },
  {
    id: "bailer",
    name: "wooden bailer",
    aliases: ["bailer", "wooden bailer", "scoop"],
    description: "A carved cedar scoop for clearing shipped water from the bilge.",
    takeable: true,
    weight: 2,
    found_in: "inventory",
    uses: ["bail water when swamped"],
    requires: null
  },
  {
    id: "bucket",
    name: "oak bucket",
    aliases: ["bucket", "oak bucket", "pail"],
    description: "A tarred oak bucket with a rope lanyard; clears water fast.",
    takeable: true,
    weight: 4,
    found_in: "gear_locker",
    uses: ["bail water rapidly"],
    requires: null
  },
  {
    id: "tarpaulin",
    name: "painted tarpaulin",
    aliases: ["tarpaulin", "tarp", "canvas"],
    description: "Heavy oiled sailcloth to lash over provisions and keep spray out.",
    takeable: true,
    weight: 9,
    found_in: "gear_locker",
    uses: ["lash down and shelter stores"],
    requires: null
  },
  {
    id: "spare_line",
    name: "coil of spare line",
    aliases: ["spare line", "line", "rope", "hemp line", "coil"],
    description: "Thirty feet of stout hemp line for lashing gear or mending rigging.",
    takeable: true,
    weight: 5,
    found_in: "gear_locker",
    uses: ["tie down gear"],
    requires: null
  },
  {
    id: "pitch_oakum",
    name: "pitch and oakum",
    aliases: ["pitch", "oakum", "pitch and oakum", "caulk", "tar"],
    description: "A tin of pine pitch and a bundle of tarred hemp oakum for caulking sprung hull seams.",
    takeable: true,
    weight: 6,
    found_in: "gear_locker",
    uses: ["repair hull damage"],
    requires: null
  },

  // --- NAVIGATION ---
  {
    id: "brass_compass",
    name: "brass compass",
    aliases: ["compass", "brass compass", "pocket compass"],
    description: "A gimbaled brass pocket compass. Carrying it lights the compass rose.",
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
    description: "A salt-stained pocket notebook of tide turns copied from Hudson's Bay skippers.",
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
    description: "A four-pound lead weight on a marked hemp line for sounding shoals.",
    takeable: true,
    weight: 5,
    found_in: "gear_locker",
    uses: ["sound depth in shoals"],
    requires: null
  },
  {
    id: "spyglass",
    name: "brass spyglass",
    aliases: ["spyglass", "glass", "telescope"],
    description: "A single-draw brass spyglass with salt-pitted lenses.",
    takeable: true,
    weight: 2,
    found_in: "fort_nisqually",
    uses: ["inspect distant shores and exits"],
    requires: null
  },
  {
    id: "wilkes_chart",
    name: "1841 Wilkes chart",
    aliases: ["chart", "wilkes chart", "map", "1841 chart"],
    description: "A linen-backed copy of Wilkes's 1841 Puget Sound survey, supplemented by rough notes north of Vancouver Island.",
    takeable: true,
    weight: 1,
    found_in: "olympia_landing",
    uses: ["view basin routes"],
    requires: null
  },
  {
    id: "logbook",
    name: "logbook and pen",
    aliases: ["logbook", "pen", "journal", "log book"],
    description: "A canvas-bound ship's journal with steel nib pen and corked inkwell.",
    takeable: true,
    weight: 1,
    found_in: "inventory",
    uses: ["record voyage log"],
    requires: null
  },

  // --- PROVISIONS ---
  {
    id: "biscuit",
    name: "ship's biscuit",
    aliases: ["biscuit", "biscuits", "hardtack", "ships biscuit", "ship's biscuit"],
    description: "Hard-baked flour cakes stowed in a canvas sack.",
    takeable: true,
    weight: 10,
    found_in: "inventory",
    edible: true,
    foodValue: 22,
    uses: ["eat to restore strength"],
    requires: null
  },
  {
    id: "salt_pork",
    name: "salt pork",
    aliases: ["salt pork", "pork", "meat"],
    description: "Brine-cured pork wrapped in oiled cloth.",
    takeable: true,
    weight: 12,
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
    description: "Twenty-five pounds of coarse Tumwater mill flour.",
    takeable: true,
    weight: 25,
    found_in: "tumwater",
    edible: true,
    foodValue: 28,
    uses: ["cook into bannock ashore"],
    requires: "frying_pan"
  },
  {
    id: "tea",
    name: "tin of black tea",
    aliases: ["tea", "black tea"],
    description: "Compressed black tea leaves in a tight tin.",
    takeable: true,
    weight: 2,
    found_in: "fort_nisqually",
    edible: true,
    foodValue: 12,
    uses: ["brew tea to ease fatigue"],
    requires: "tin_cup"
  },
  {
    id: "water_keg",
    name: "water keg",
    aliases: ["water keg", "keg", "water", "cask"],
    description: "A five-gallon oak breaker holding fresh drinking water. Refill at creeks and forts.",
    takeable: true,
    weight: 42,
    found_in: "inventory",
    uses: ["drink water", "refill at creeks"],
    requires: null
  },
  {
    id: "tin_cup",
    name: "tin cup",
    aliases: ["tin cup", "cup", "mug"],
    description: "A dented tin cup on a leather thong.",
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
    weight: 5,
    found_in: "gear_locker",
    uses: ["cook ashore"],
    requires: "tinderbox"
  },
  {
    id: "tinderbox",
    name: "flint, steel and tinderbox",
    aliases: ["tinderbox", "flint", "steel", "fire"],
    description: "A brass box holding flint, striker steel, and charred linen.",
    takeable: true,
    weight: 1,
    found_in: "gear_locker",
    uses: ["make fire ashore"],
    requires: null
  },

  // --- TOOLS & FISHING ---
  {
    id: "axe",
    name: "felling axe",
    aliases: ["axe", "ax", "hatchet", "felling axe"],
    description: "A sharp iron axe helved in hickory for cutting firewood, lumber, and shelter poles.",
    takeable: true,
    weight: 6,
    found_in: "olympia_landing",
    uses: ["chop firewood and lumber ashore", "build shelter"],
    requires: null
  },
  {
    id: "hand_line",
    name: "hand line and hooks",
    aliases: ["hand line", "handline", "fishing line", "hooks", "line and hooks"],
    description: "Braided linen line on a wooden frame with lead sinkers and forged hooks.",
    takeable: true,
    weight: 2,
    found_in: "gear_locker",
    uses: ["fish for flounder, perch, or rockfish"],
    requires: null
  },
  {
    id: "fish_gaff",
    name: "fish gaff",
    aliases: ["fish gaff", "gaff"],
    description: "A stout ash handle with a curved steel hook.",
    takeable: true,
    weight: 3,
    found_in: "steilacoom",
    uses: ["improves fishing catch"],
    requires: "hand_line"
  },
  {
    id: "crab_pot",
    name: "woven crab pot",
    aliases: ["crab pot", "pot", "trap", "woven crab pot"],
    description: "A cedar-frame and twine crab pot with a cork float. Bait with fish and lower overnight.",
    takeable: true,
    weight: 12,
    found_in: "squaxin_passage",
    openable: true,
    open: false,
    isCrabPot: true,
    baited: false,
    setStep: null,
    contents: [],
    uses: ["bait with fish and set overnight"],
    requires: null
  },

  // --- TRADE & MEDICINE ---
  {
    id: "hbc_blankets",
    name: "Hudson's Bay blankets",
    aliases: ["blankets", "blanket", "hbc blankets", "hudson's bay blankets", "point blanket"],
    description: "Heavy white three-point wool blankets—standard trade currency from Olympia to Sitka.",
    takeable: true,
    weight: 12,
    found_in: "fort_nisqually",
    isCurrency: true,
    blanketValue: 2,
    uses: ["trade at posts and villages", "buy vessels"],
    requires: null
  },
  {
    id: "tobacco",
    name: "plug of tobacco",
    aliases: ["tobacco", "plug"],
    description: "Dark twist tobacco wrapped in oiled paper.",
    takeable: true,
    weight: 2,
    found_in: "olympia_landing",
    isCurrency: true,
    blanketValue: 1,
    uses: ["trade gift"],
    requires: null
  },
  {
    id: "powder_shot",
    name: "powder and shot",
    aliases: ["powder", "shot", "powder and shot", "horn"],
    description: "A corked horn of black powder and a pouch of lead shot.",
    takeable: true,
    weight: 6,
    found_in: "fort_nisqually",
    isCurrency: true,
    blanketValue: 2,
    uses: ["trade at posts"],
    requires: null
  },
  {
    id: "medicine_chest",
    name: "medicine chest",
    aliases: ["medicine chest", "medicine", "chest"],
    description: "A mahogany box of bandages, quinine bark, and smelling salts.",
    takeable: true,
    weight: 5,
    found_in: "steilacoom",
    uses: ["treat shellfish sickness or exposure"],
    requires: null
  },

  // --- COASTAL FINDS (no sacred/burial goods) ---
  {
    id: "old_bottle",
    name: "old bottle with a note",
    aliases: ["bottle", "old bottle", "note", "glass bottle"],
    description: "A thick green glass bottle corked with pitch, holding a rolled paper.",
    readable: "Faded ink, 1848: 'Beware clams and mussels in warm water—remember the men who died in Peril Strait in 1799. Watch the ebb at Point Wilson and Seymour Narrows.'",
    takeable: true,
    weight: 1,
    found_in: "port_townsend",
    uses: ["read note"],
    requires: null
  },
  {
    id: "beach_agate",
    name: "beach agate",
    aliases: ["agate", "beach agate", "stone", "pebble"],
    description: "A translucent amber chalcedony agate tumbled smooth by swells.",
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
    description: "A dry, straight-grained billet of red cedar for patching planks or burning.",
    takeable: true,
    weight: 8,
    found_in: "budd_inlet",
    uses: ["repair hull", "firewood"],
    requires: null
  },
  {
    id: "rusted_tin",
    name: "rusted tin",
    aliases: ["rusted tin", "tin", "tin box"],
    description: "A salt-pitted ship's tin tucked beneath a fir root.",
    takeable: true,
    weight: 2,
    found_in: "vashon_island",
    openable: true,
    open: false,
    contents: [
      {
        id: "old_letter",
        name: "waxed survey note",
        aliases: ["survey note", "letter", "paper"],
        description: "A waxed note folded inside.",
        readable: "1846 skipper's note: 'A skiff can reach Victoria, but trade lumber and blankets for a whaleboat or schooner before Queen Charlotte Sound.'",
        takeable: true,
        weight: 0.1
      }
    ],
    uses: ["open and read"],
    requires: null
  },

  // --- FIXED PROPS & TRADERS ---
  {
    id: "dock_cleat",
    name: "iron cleat",
    aliases: ["cleat", "dock", "landing", "piling"],
    description: "A heavy iron cleat bolted to the landing.",
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
    description: "A cedar locker holding extra boat gear, instruments, and provisions.",
    takeable: false,
    weight: 0,
    found_in: "olympia_landing",
    openable: true,
    open: false,
    contents: [],
    uses: ["store or take gear"],
    requires: null
  },
  {
    id: "trading_post_notice",
    name: "posted notice",
    aliases: ["notice", "posted notice", "sign", "board"],
    description: "A hand-lettered sheet tacked to the trading store wall.",
    readable: "OREGON TERRITORY, SPRING 1850 — Dispatches bound for New Archangel (Sitka) travel roughly 1,100 miles by the Inside Passage. Earn blankets by cutting lumber or trading at HBC posts (Nisqually, Victoria, Rupert, Simpson) to upgrade your vessel.",
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
    description: "Cold mountain water pouring over clean gravel. Refills your water keg.",
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
    description: "Wet gravel pocked with clam siphons at ebb tide.",
    takeable: false,
    weight: 0,
    found_in: "budd_inlet",
    gatherable: {
      id: "clams",
      name: "butter clams",
      aliases: ["clams", "clam", "shellfish"],
      description: "Heavy butter clams dug from the gravel.",
      takeable: true,
      weight: 3,
      edible: true,
      isShellfish: true,
      foodValue: 18
    },
    uses: ["dig clams at ebb"],
    requires: null
  },
  {
    id: "oyster_bed",
    name: "oyster bed",
    aliases: ["oysters", "oyster", "oyster bed", "shellfish"],
    description: "Clusters of small native oysters on gravel bars.",
    takeable: false,
    weight: 0,
    found_in: "eld_inlet",
    gatherable: {
      id: "oysters",
      name: "native oysters",
      aliases: ["oysters", "oyster", "shellfish"],
      description: "Small coppery-shelled native oysters.",
      takeable: true,
      weight: 3,
      edible: true,
      isShellfish: true,
      foodValue: 15
    },
    uses: ["rake oysters at ebb"],
    requires: null
  },
  {
    id: "hbc_clerk",
    name: "Company clerk",
    aliases: ["clerk", "trader", "company clerk", "man"],
    description: "A Hudson's Bay clerk tallying wool bales. Type 'trade' to barter lumber for blankets, repair your boat, or buy a larger vessel.",
    takeable: false,
    weight: 0,
    found_in: "fort_nisqually",
    isTrader: true,
    uses: ["trade lumber/blankets or buy whaleboat"],
    requires: null
  },
  {
    id: "hbc_factor",
    name: "Company factor",
    aliases: ["factor", "clerk", "trader", "company factor"],
    description: "A Hudson's Bay Company factor overseeing the post wharf. Type 'trade' to barter lumber for blankets, resupply, or upgrade to a whaleboat or schooner.",
    takeable: false,
    weight: 0,
    found_in: "fort_victoria",
    isTrader: true,
    uses: ["trade lumber/blankets or buy whaleboat/schooner"],
    requires: null
  },
  {
    id: "rac_officer",
    name: "Russian-American Company officer",
    aliases: ["officer", "governor", "clerk", "russian", "company officer"],
    description: "An officer in a dark blue double-breasted coat standing by the Company countinghouse beneath Castle Hill.",
    takeable: false,
    weight: 0,
    found_in: "sitka",
    uses: ["give dispatch"],
    requires: "dispatch_letter"
  }
];

window.FISH_POOL = [
  { name: "flounder", aliases: ["fish", "flounder", "bait"], description: "A flat speckled starry flounder.", takeable: true, weight: 3, edible: true, foodValue: 22, isBait: true, releasable: true },
  { name: "perch", aliases: ["fish", "perch", "bait"], description: "A silver-sided pile perch.", takeable: true, weight: 2, edible: true, foodValue: 18, isBait: true, releasable: true },
  { name: "rockfish", aliases: ["fish", "rockfish", "rock fish", "bait"], description: "A dark-backed kelp rockfish.", takeable: true, weight: 4, edible: true, foodValue: 25, isBait: true, releasable: true }
];

window.CRAB_TEMPLATE = {
  id: "crab",
  name: "Dungeness crab",
  aliases: ["crab", "dungeness", "dungeness crab"],
  description: "A heavy Dungeness crab clicking its claws.",
  takeable: true,
  weight: 3,
  edible: true,
  foodValue: 28,
  releasable: true
};
