// world_central.js — Central Puget Sound (1850, Oregon Territory)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.central = {
  gig_harbor: {
    id: "gig_harbor",
    name: "Gig Harbor",
    region: "Central Sound",
    description: "A tight, completely sheltered pocket harbor hidden behind a low gravel spit. Tall firs ring the calm water; no cabins stand on the shore, only old canoe landings along the beach.",
    exits: {
      s: { to: "tacoma_narrows", steps: 1, requiresTide: "slack", blockedText: "The Narrows are running too hard to enter; wait for slack water.", look: "The steep mouth of Tacoma Narrows lies south." },
      e: { to: "commencement_bay", steps: 1, look: "Commencement Bay opens east across the reach." },
      n: { to: "colvos_passage", steps: 1, look: "Colvos Passage runs straight north." }
    },
    scenery: {
      spit: "A low gravel sandspit curling across the harbor mouth.",
      firs: "Wall of towering firs keeping the harbor flat even in a breeze.",
      landings: "Cleared pebble runways where Native canoes come ashore."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Mirror-flat water inside the spit.",
      flood: "Water slides quietly past the narrow entrance.",
      ebb: "Outflowing tide shows gravel bars at the mouth."
    },
    original_name: "",
    tribal_note: ""
  },

  commencement_bay: {
    id: "commencement_bay",
    name: "Commencement Bay",
    region: "Central Sound",
    description: "A broad deep bay ending in wide tidal flats at the mouth of the Puyallup River. No town exists—only unbroken forest on the bluffs, river marsh, and Native cedar houses along the shore.",
    exits: {
      sw: { to: "tacoma_narrows", steps: 2, requiresTide: "slack", blockedText: "Strong current guards the Narrows; wait for slack water.", look: "Tacoma Narrows pinches southwest." },
      w: { to: "gig_harbor", steps: 1, look: "Gig Harbor's spit lies west." },
      n: { to: "vashon_island", steps: 2, look: "Vashon Island's southern bluff rises north." }
    },
    scenery: {
      flats: "Broad river mudflats cut by drifting snags.",
      forest: "Dark unbroken evergreens climbing the southern ridge.",
      houses: "Plank cedar houses along the bay shore; canoes rest on the gravel.",
      marsh: "Tall reeds and salt grass at the river mouth."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Broad, quiet water beneath the bluffs.",
      flood: "Salt water pushes up into the river marsh.",
      ebb: "Brown river water fans out over the bay."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 shoreline details on Commencement Bay (no white settlement yet; Job Carr arrived 1864)."
  },

  colvos_passage: {
    id: "colvos_passage",
    name: "Colvos Passage",
    region: "Central Sound",
    description: "A straight, deep corridor between Vashon Island and the Kitsap shore. The current here flows north almost constantly, helping boats bound up-Sound.",
    exits: {
      s: { to: "gig_harbor", steps: 1, look: "Gig Harbor lies south." },
      e: { to: "vashon_island", steps: 1, look: "Vashon Island's western coves lie east." },
      n: { to: "blake_island", steps: 2, look: "Wooded Blake Island sits ahead to the north." }
    },
    scenery: {
      shore: "Steep forested Kitsap hills rising to the west.",
      island: "Vashon's wooded western bluffs.",
      water: "Steady northward drift along the straight channel."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "Even at slack, a faint northward drift lingers.",
      flood: "Water pushes steadily north along Vashon.",
      ebb: "A brisk northward set carries driftwood up the passage."
    },
    original_name: "",
    tribal_note: ""
  },

  vashon_island: {
    id: "vashon_island",
    name: "Vashon Island",
    region: "Central Sound",
    description: "A long forested island with gravel spits and sheltered coves. A deep pocket harbor indents the southern end; no settler cabins show along the bluff.",
    exits: {
      s: { to: "commencement_bay", steps: 2, look: "Commencement Bay opens south." },
      w: { to: "colvos_passage", steps: 1, look: "Colvos Passage runs west." },
      nw: { to: "blake_island", steps: 1, look: "Blake Island lies northwest." },
      n: { to: "elliott_bay", steps: 2, look: "Wide open water leads north toward Elliott Bay." }
    },
    scenery: {
      spits: "Low sandy spits bordered with driftwood.",
      coves: "Quiet timber-lined coves out of the main channel.",
      bluff: "High clay bluffs shadowed by firs."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water off the gravel spits.",
      flood: "Tide rises gently into the coves.",
      ebb: "Gravel bars and eelgrass show along the shore."
    },
    original_name: "",
    tribal_note: ""
  },

  blake_island: {
    id: "blake_island",
    name: "Blake Island",
    region: "Central Sound",
    description: "A rounded, uninhabited island of old firs and pebble spits standing at the crossroads of the central Sound. Snow peaks gleam east and west on clear days.",
    exits: {
      s: { to: "colvos_passage", steps: 2, look: "Colvos Passage runs south." },
      se: { to: "vashon_island", steps: 1, look: "Vashon Island lies southeast." },
      w: { to: "sinclair_inlet", steps: 2, look: "Rich Passage leads west toward Sinclair Inlet." },
      n: { to: "eagle_harbor", steps: 1, look: "Eagle Harbor indents Bainbridge Island to the north." },
      ne: { to: "elliott_bay", steps: 2, look: "Elliott Bay opens northeast across the main channel." }
    },
    scenery: {
      firs: "Tall old-growth firs and cedars covering the island.",
      spits: "Smooth pebble spits jutting into the channel.",
      peaks: "The Olympics west and the Cascades east."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "light", shelter: true },
    tide_variants: {
      slack: "Quiet water all around the island.",
      flood: "Current divides cleanly past the southern spit.",
      ebb: "Ebb ripples off the northern gravel point."
    },
    original_name: "",
    tribal_note: ""
  },

  elliott_bay: {
    id: "elliott_bay",
    name: "Elliott Bay",
    region: "Central Sound",
    description: "A deep curving bay backed by steep forested hills and wide river flats to the south. No town stands here yet—only Native plank houses near the river mouth, cedar canoes crossing the bay, and a lone claim clearing on the point.",
    exits: {
      s: { to: "vashon_island", steps: 2, look: "Vashon Island rises south." },
      sw: { to: "blake_island", steps: 2, look: "Blake Island sits southwest." },
      w: { to: "eagle_harbor", steps: 2, look: "Eagle Harbor lies west across the Sound." },
      n: { to: "shilshole_bay", steps: 2, look: "Wooded headlands run north toward Shilshole Bay." }
    },
    scenery: {
      hills: "Dense old-growth forest rising straight from the beach.",
      flats: "Broad Duwamish tidal flats and winding sloughs.",
      houses: "Cedar longhouses and drying racks along the shore; smoke rises steadily.",
      canoes: "Canoes crossing between the point and Bainbridge Island.",
      clearing: "A small rough clearing near the southern point—too early for any town."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Deep calm water inside the bay.",
      flood: "Flood tide covers the southern river flats.",
      ebb: "Fresh river water pushes north past the point."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Elliott Bay (Collins/Denny party arrived 1851; no Seattle settlement in 1850)."
  },

  shilshole_bay: {
    id: "shilshole_bay",
    name: "Shilshole Bay",
    region: "Central Sound",
    description: "A sweeping sandy bight below high wooded bluffs north of Elliott Bay. A shallow stream outlet cuts across the gravel beach, where a Native village sits sheltered behind the point.",
    exits: {
      s: { to: "elliott_bay", steps: 2, look: "Elliott Bay lies south past the headland." },
      w: { to: "port_madison", steps: 2, look: "Port Madison opens west across the Sound." },
      n: { to: "possession_sound", steps: 3, look: "Wide open water stretches north into Possession Sound." }
    },
    scenery: {
      bluffs: "High clay bluffs streaked with sand.",
      beach: "Broad gravel and driftwood beach.",
      village: "Cedar houses tucked near the creek mouth; people tend nets and canoes.",
      outlet: "Shallow brackish creek draining from an inland lake."
    },
    objects: [],
    hazard: { exposure: 2, tidal: false, shelter: false },
    tide_variants: {
      slack: "Gentle swells roll onto the sandy bight.",
      flood: "High water floods the creek mouth.",
      ebb: "Wide sandbars appear off the point."
    },
    original_name: "",
    tribal_note: ""
  },

  eagle_harbor: {
    id: "eagle_harbor",
    name: "Eagle Harbor",
    region: "Central Sound",
    description: "A long, snug harbor cutting deep into Bainbridge Island. Dense cedar and fir crowd the banks; a sandspit shelters the anchorage from eastern chop.",
    exits: {
      s: { to: "blake_island", steps: 1, look: "Blake Island lies south." },
      e: { to: "elliott_bay", steps: 2, look: "Elliott Bay lies east across the main channel." },
      nw: { to: "agate_pass", steps: 2, requiresTide: "slack", blockedText: "Agate Pass runs too fast right now; wait for slack water.", look: "The channel leads northwest toward Agate Pass." }
    },
    scenery: {
      cedar: "Thick cedar timber down to the waterline.",
      spit: "Low gravel spit guarding the harbor entrance.",
      anchorage: "Calm muddy bottom—good holding in any wind."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Glass-calm water inside the spit.",
      flood: "Rising tide fills the shallow head of the harbor.",
      ebb: "Low water exposes mudflats at the inner end."
    },
    original_name: "",
    tribal_note: ""
  },

  sinclair_inlet: {
    id: "sinclair_inlet",
    name: "Sinclair Inlet",
    region: "Central Sound",
    description: "A deep, quiet western inlet ringed by dark timbered hills. No navy yard or town stands here—only quiet coves, cedar beaches, and a few Native camps along the shore.",
    exits: {
      e: { to: "blake_island", steps: 2, look: "Rich Passage runs east toward Blake Island." },
      n: { to: "agate_pass", steps: 2, requiresTide: "slack", blockedText: "Agate Pass is running hard; wait for slack water.", look: "Port Orchard leads north to Agate Pass." }
    },
    scenery: {
      hills: "Dark forested hills enclosing the inlet.",
      coves: "Empty gravel coves backed by salal.",
      camps: "Seasonal Native camps along the flat beaches; drying fish hang in the smoke."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Flat, dark water reflecting the hills.",
      flood: "Gentle flood fills the inner mudflats.",
      ebb: "Ebb draws out through the eastern passage."
    },
    original_name: "",
    tribal_note: ""
  },

  agate_pass: {
    id: "agate_pass",
    name: "Agate Pass",
    region: "Central Sound",
    description: "A narrow, swift-running gut separating Bainbridge Island from the Kitsap mainland. Kelp whips along the gravelly ledges and tide boils twist past the points.",
    exits: {
      se: { to: "eagle_harbor", steps: 2, look: "The channel opens southeast toward Eagle Harbor." },
      s: { to: "sinclair_inlet", steps: 2, look: "Port Orchard stretches south toward Sinclair Inlet." },
      e: { to: "port_madison", steps: 1, look: "Port Madison opens immediately east." }
    },
    scenery: {
      kelp: "Bull kelp stretched flat by the current.",
      ledges: "Gravel ledges visible under rushing green water.",
      points: "Close wooded points funneling the tide."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The narrow gut pauses, calm and easy to row.",
      flood: "Fast flood water rushes south through the pass.",
      ebb: "Strong ebb pours north into Port Madison."
    },
    original_name: "",
    tribal_note: ""
  },

  port_madison: {
    id: "port_madison",
    name: "Port Madison",
    region: "Central Sound",
    description: "A wide, sheltered bay at the north end of Bainbridge Island. A large Native village stands on the western shore, cedar plank houses facing the water and canoes lined along the beach.",
    exits: {
      w: { to: "agate_pass", steps: 1, requiresTide: "slack", blockedText: "Agate Pass is boiling with tide; wait for slack water.", look: "Agate Pass pinches west." },
      e: { to: "shilshole_bay", steps: 2, look: "Shilshole Bay lies east across the main channel." },
      nw: { to: "foulweather_bluff", steps: 3, look: "The long open reach of Admiralty Inlet stretches northwest." }
    },
    scenery: {
      village: "A substantial Suquamish plank-house village facing the bay; people come and go in cedar canoes.",
      houses: "Weathered cedar-plank houses built above the gravel beach.",
      beach: "Broad gravel shore lined with canoes and drying racks."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water across the bay.",
      flood: "Gentle tide rises onto the gravel shore.",
      ebb: "Ebb currents gather off the northern point."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Madison (no sawmill yet; Meigs mill built 1853-54)."
  }
};
