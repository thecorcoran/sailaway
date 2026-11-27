// world_central.js — Central Puget Sound (1850, Oregon Territory)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.central = {
  gig_harbor: {
    id: "gig_harbor",
    name: "Gig Harbor",
    region: "Central Sound",
    description: "A tight, sheltered pocket harbor hidden behind a low gravel spit. Tall firs ring calm water; no cabins stand on the shore, only cleared canoe landings along the beach.",
    exits: {
      s: { to: "tacoma_narrows", steps: 1, requiresTide: "slack", blockedText: "The Narrows are running too hard; wait for slack water.", look: "The steep mouth of Tacoma Narrows lies south." },
      e: { to: "commencement_bay", steps: 1, look: "Commencement Bay opens east." },
      n: { to: "colvos_passage", steps: 1, look: "Colvos Passage runs straight north." }
    },
    scenery: {
      spit: "Low gravel sandspit curling across the entrance.",
      firs: "Wall of towering firs keeping the harbor flat.",
      landings: "Cleared pebble runways where Coast Salish canoes land."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Mirror-flat water inside the spit.",
      flood: "Water slides quietly past the entrance.",
      ebb: "Outflowing tide shows gravel bars at the mouth."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  commencement_bay: {
    id: "commencement_bay",
    name: "Commencement Bay",
    region: "Central Sound",
    description: "A broad deep bay ending in wide river flats at the Puyallup mouth. No town exists—only unbroken forest on the bluffs, river marsh, and Coast Salish cedar houses along the shore.",
    exits: {
      sw: { to: "tacoma_narrows", steps: 2, requiresTide: "slack", blockedText: "Strong current guards the Narrows; wait for slack water.", look: "Tacoma Narrows pinches southwest." },
      w: { to: "gig_harbor", steps: 1, look: "Gig Harbor's spit lies west." },
      n: { to: "vashon_island", steps: 2, look: "Vashon Island's southern bluff rises north." }
    },
    scenery: {
      flats: "Broad river mudflats cut by drifting snags.",
      forest: "Dark unbroken evergreens climbing the ridge.",
      houses: "Plank cedar houses along the bay shore; canoes rest on the gravel.",
      marsh: "Tall reeds and salt grass at the river mouth."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Broad quiet water beneath the bluffs.",
      flood: "Salt water pushes into the river marsh.",
      ebb: "Brown river water fans out over the bay."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 Commencement Bay shoreline (no white town; Job Carr 1864)."
  },

  colvos_passage: {
    id: "colvos_passage",
    name: "Colvos Passage",
    region: "Central Sound",
    description: "A straight, deep corridor between Vashon Island and the Kitsap shore. The current here flows north almost constantly, helping boats bound up-Sound.",
    exits: {
      s: { to: "gig_harbor", steps: 1, look: "Gig Harbor lies south." },
      e: { to: "vashon_island", steps: 1, look: "Vashon Island's western coves lie east." },
      n: { to: "agate_pass", steps: 2, requiresTide: "slack", blockedText: "Agate Pass runs too fast right now; wait for slack water.", look: "Channels lead north past Blake Island toward Agate Pass." }
    },
    scenery: {
      shore: "Steep forested Kitsap hills rising west.",
      island: "Vashon's wooded western bluffs.",
      water: "Steady northward drift along the straight channel."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "Even at slack a faint northward drift lingers.",
      flood: "Water pushes steadily north along Vashon.",
      ebb: "A brisk northward set carries driftwood up the passage."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  vashon_island: {
    id: "vashon_island",
    name: "Vashon Island",
    region: "Central Sound",
    description: "A long forested island with gravel spits and sheltered coves. No settler cabins show along the clay bluffs—only old firs and quiet beaches.",
    exits: {
      s: { to: "commencement_bay", steps: 2, look: "Commencement Bay opens south." },
      w: { to: "colvos_passage", steps: 1, look: "Colvos Passage runs west." },
      n: { to: "elliott_bay", steps: 2, look: "Open water leads north toward Elliott Bay." }
    },
    scenery: {
      spits: "Low sandy spits bordered with driftwood.",
      coves: "Quiet timber-lined coves out of the channel.",
      bluffs: "High clay bluffs shadowed by firs."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water off the gravel spits.",
      flood: "Tide rises gently into the coves.",
      ebb: "Gravel bars and eelgrass show along the shore."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  elliott_bay: {
    id: "elliott_bay",
    name: "Elliott Bay",
    region: "Central Sound",
    description: "A deep curving bay backed by steep forested hills and wide Duwamish flats to the south. No town stands here in 1850—only Coast Salish plank houses near the river mouth and cedar canoes crossing the bay.",
    exits: {
      s: { to: "vashon_island", steps: 2, look: "Vashon Island rises south." },
      w: { to: "agate_pass", steps: 2, requiresTide: "slack", blockedText: "Agate Pass is boiling with tide; wait for slack water.", look: "Bainbridge Island and Agate Pass lie west." },
      nw: { to: "port_madison", steps: 2, look: "Port Madison lies northwest across the main channel." }
    },
    scenery: {
      hills: "Dense old-growth forest rising straight from the beach.",
      flats: "Broad Duwamish tidal flats and winding sloughs.",
      houses: "Cedar longhouses and drying racks along the shore.",
      canoes: "Canoes crossing between the point and Bainbridge Island."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Deep calm water inside the bay.",
      flood: "Flood tide covers the southern river flats.",
      ebb: "Fresh river water pushes north past the point."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Elliott Bay (no white settlement yet; Denny/Collins 1851)."
  },

  agate_pass: {
    id: "agate_pass",
    name: "Agate Pass",
    region: "Central Sound",
    description: "A narrow, swift-running gut separating Bainbridge Island from the Kitsap mainland. Kelp whips along gravelly ledges and tide boils twist past the points.",
    exits: {
      s: { to: "colvos_passage", steps: 2, look: "Channels lead south toward Colvos Passage." },
      e: { to: "elliott_bay", steps: 2, look: "Elliott Bay lies east across the Sound." },
      n: { to: "port_madison", steps: 1, look: "Port Madison opens immediately north." }
    },
    scenery: {
      kelp: "Bull kelp stretched flat by the current.",
      ledges: "Gravel ledges visible under rushing green water.",
      water: "Fast tidal boils funneling between wooded points."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The narrow gut pauses, calm and easy to row.",
      flood: "Fast flood water rushes south through the pass.",
      ebb: "Strong ebb pours north into Port Madison."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  port_madison: {
    id: "port_madison",
    name: "Port Madison",
    region: "Central Sound",
    description: "A wide sheltered bay at the north end of Bainbridge Island. A large Coast Salish village of cedar plank houses faces the water, canoes lined neatly along the gravel beach.",
    exits: {
      s: { to: "agate_pass", steps: 1, requiresTide: "slack", blockedText: "Agate Pass is boiling with tide; wait for slack water.", look: "Agate Pass pinches south." },
      se: { to: "elliott_bay", steps: 2, look: "Elliott Bay lies southeast." },
      ne: { to: "possession_sound", steps: 2, look: "Possession Sound opens northeast." },
      nw: { to: "foulweather_bluff", steps: 3, look: "Admiralty Inlet stretches northwest to Foulweather Bluff." }
    },
    scenery: {
      village: "A substantial Suquamish plank-house village facing the bay; people come and go in cedar canoes.",
      houses: "Weathered cedar-plank houses built above the gravel.",
      beach: "Broad gravel shore lined with canoes."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water across the bay.",
      flood: "Gentle tide rises onto the gravel shore.",
      ebb: "Ebb currents gather off the northern point."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Madison (Meigs sawmill built 1853-54)."
  }
};
