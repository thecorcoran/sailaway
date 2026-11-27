// world_alaska.js — Alaska Waters / Russian America (1850)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.alaska = {
  dixon_entrance: {
    id: "dixon_entrance",
    name: "Dixon Entrance",
    region: "Alaska Waters",
    description: "A wide, exposed border strait between British waters and Russian America, open to North Pacific storms from the west. Haida canoes cross these waters from the southern islands; heavy swells roll past rocky shoals.",
    exits: {
      se: { to: "fort_simpson", steps: 3, look: "Fort Simpson lies southeast." },
      n: { to: "tongass_narrows", steps: 3, look: "The sheltered islands of Russian America and Tongass Narrows lie north." }
    },
    scenery: {
      swell: "Cold gray Pacific swell sweeping in from the west.",
      islands: "Distant dark silhouettes of Haida Gwaii south and Prince of Wales Island north."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "Long ocean swells lift the boat steadily.",
      flood: "Heavy flood pushes east into Portland Canal.",
      ebb: "Ebb slams west into Pacific swell."
    },
    hasShore: false,
    original_name: "",
    tribal_note: "",
    verify: "Verify Haida and Tlingit crossing context at Dixon Entrance in 1850."
  },

  tongass_narrows: {
    id: "tongass_narrows",
    name: "Tongass Narrows",
    region: "Alaska Waters",
    description: "A sheltered, rain-washed channel winding past steep spruce islands in Tlingit country. Bald eagles crowd the driftwood logs, and thin mist clings to the muskeg ridges.",
    exits: {
      s: { to: "dixon_entrance", steps: 3, look: "Exposed Dixon Entrance opens south." },
      nw: { to: "clarence_strait", steps: 3, look: "Wide Clarence Strait runs northwest." }
    },
    scenery: {
      spruce: "Thick Sitka spruce and hemlock blanketing the steep slopes.",
      eagles: "Dozens of bald eagles perched along the tide line.",
      mist: "Cold coastal rain mist hanging low over the channel."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: true },
    tide_variants: {
      slack: "Calm dark water between green islands.",
      flood: "Flood drifts northwest through the narrows.",
      ebb: "Ebb pulls southeast toward Dixon Entrance."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  clarence_strait: {
    id: "clarence_strait",
    name: "Clarence Strait",
    region: "Alaska Waters",
    description: "A broad, deep Alaskan waterway stretching north for scores of miles between mountainous islands. Squalls sweep suddenly off the snowy peaks.",
    exits: {
      se: { to: "tongass_narrows", steps: 3, look: "Tongass Narrows lies southeast." },
      n: { to: "fort_stikine", steps: 3, look: "Stikine waters and Fort Stikine lie north." }
    },
    scenery: {
      peaks: "Snow-covered coastal ridges veiled in passing squalls.",
      water: "Wide cold strait churned by sudden gusts."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "Broad cold water under gray skies.",
      flood: "Flood pushes north up the strait.",
      ebb: "Ebb drives south toward Dixon Entrance."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  fort_stikine: {
    id: "fort_stikine",
    name: "Fort Stikine (HBC Lease)",
    region: "Alaska Waters",
    description: "A timber stockade on Wrangell Island near the silty mouth of the Stikine River—Russian territory leased to the Hudson's Bay Company since 1840. Tlingit plank houses line the harbor shore, and glacial silt clouds the tide.",
    exits: {
      s: { to: "clarence_strait", steps: 3, look: "Clarence Strait stretches south." },
      w: { to: "sumner_strait", steps: 2, look: "Sumner Strait opens west." }
    },
    scenery: {
      stockade: "Weathered log palisade flying the HBC flag on leased Russian ground.",
      houses: "Tlingit cedar houses along the bay; canoes work the river mouth.",
      silt: "Pale milky glacial silt swirling out of the Stikine River."
    },
    objects: ["hbc_factor", "fresh_spring"],
    hazard: { exposure: 1, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Milky river water floats over dark salt water.",
      flood: "High water covers the silty river flats.",
      ebb: "Broad mudflats show near the Stikine mouth."
    },
    hasShore: true,
    hasCamp: true,
    isFort: true,
    milestone: "Reached Fort Stikine on leased Russian-American ground.",
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Fort Stikine (HBC closed Fort Stikine in 1849 and shifted trade to steamer Beaver—confirm if abandoned or caretaker in 1850)."
  },

  sumner_strait: {
    id: "sumner_strait",
    name: "Sumner Strait",
    region: "Alaska Waters",
    description: "Cold, open Alaskan strait winding west and north past rocky spruce-covered islands. Drifting glacier ice occasionally rides the current out of northern fjords.",
    exits: {
      e: { to: "fort_stikine", steps: 2, look: "Fort Stikine lies east." },
      n: { to: "frederick_sound", steps: 3, look: "Wide Frederick Sound opens north." }
    },
    scenery: {
      islands: "Rugged spruce islands wrapped in low cloud.",
      ice: "Small pale chunks of glacier ice drifting quietly in the tide."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "Cold swells ease along the strait.",
      flood: "Flood sweeps east from the Pacific.",
      ebb: "Ebb pulls west toward the outer coast."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  frederick_sound: {
    id: "frederick_sound",
    name: "Frederick Sound",
    region: "Alaska Waters",
    description: "A vast, deep sound where humpback whales blow white plumes against a backdrop of blue tidewater glaciers and jagged peaks.",
    exits: {
      s: { to: "sumner_strait", steps: 3, look: "Sumner Strait lies south." },
      nw: { to: "chatham_strait", steps: 3, look: "Deep Chatham Strait runs northwest." }
    },
    scenery: {
      whales: "Dark backs and tall spouts rising lazily in the cold sound.",
      glaciers: "Blue rivers of ice gleaming in distant mountain valleys.",
      peaks: "Snowy coastal ranges towering above the timberline."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "Broad cold water under towering peaks.",
      flood: "Flood streams north and east.",
      ebb: "Ebb draws south and west."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  chatham_strait: {
    id: "chatham_strait",
    name: "Chatham Strait",
    region: "Alaska Waters",
    description: "A deep, trench-like strait splitting Admiralty and Baranof islands. High snow-capped ridges drop steeply into cold green water; west opens the narrow mouth of Peril Strait.",
    exits: {
      se: { to: "frederick_sound", steps: 3, look: "Frederick Sound opens southeast." },
      w: { to: "peril_strait", steps: 2, requiresTide: "slack", blockedText: "Sergius Narrows in Peril Strait is roaring; wait for slack water.", look: "Peril Strait winds west toward Sitka." }
    },
    scenery: {
      ridges: "Steep snow-streaked mountains flanking both sides of the trench.",
      water: "Deep, cold ocean water funneling north and south."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The deep strait quiets briefly.",
      flood: "Flood drives north up the trench.",
      ebb: "Ebb surges south, raising steep chop in a southerly."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  peril_strait: {
    id: "peril_strait",
    name: "Peril Strait (Sergius Narrows)",
    region: "Alaska Waters",
    description: "A twisting, rock-choked channel separating Baranof and Chichagof islands, pinched tight at Sergius Narrows. Old reports recall that over a hundred Aleut hunters died here in 1799 after eating poisoned mussels from these shores.",
    exits: {
      e: { to: "chatham_strait", steps: 2, requiresTide: "slack", blockedText: "Sergius Narrows boils with current; wait for slack water.", look: "Chatham Strait opens east." },
      sw: { to: "sitka_sound", steps: 2, requiresTide: "slack", blockedText: "Swift water in Sergius Narrows blocks passage except at slack.", look: "Island-studded Sitka Sound opens southwest." }
    },
    scenery: {
      narrows: "Rocky shoals squeezing the channel into a boiling chute.",
      shores: "Dark mussel-covered rocks along the narrow cove—remember the old warning.",
      water: "Fast, swirling tidal water over submerged rock."
    },
    objects: ["clam_bed"],
    hazard: { exposure: 2, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "Sergius Narrows hushes briefly—safe to slip through.",
      flood: "Fierce flood races east through the rocks.",
      ebb: "Boiling ebb pours southwest toward Sitka Sound."
    },
    hasShore: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1799 Peril Strait shellfish poisoning account (Baranov's Aleut hunting party; exact death count varies in sources)."
  },

  sitka_sound: {
    id: "sitka_sound",
    name: "Sitka Sound",
    region: "Alaska Waters",
    description: "An island-dotted bay opening onto the North Pacific beneath the symmetrical volcanic cone of Mount Edgecumbe. Across the sheltered eastern roadstead rise the timber bastions and green-spired cathedral of New Archangel.",
    exits: {
      ne: { to: "peril_strait", steps: 2, requiresTide: "slack", blockedText: "Peril Strait's Sergius Narrows requires slack water.", look: "Peril Strait winds northeast." },
      e: { to: "sitka", steps: 1, look: "The wharves and headland of Sitka (New Archangel) lie directly east." }
    },
    scenery: {
      mountain: "Mount Edgecumbe's snow-dusted volcanic cone rising west across the sound.",
      islands: "Dozens of spruce-tufted rocky islets sheltering the roadstead.",
      cathedral: "The onion dome and steeple of St. Michael's Cathedral gleaming above the roofs."
    },
    objects: [],
    hazard: { exposure: 2, tidal: false, shelter: true },
    tide_variants: {
      slack: "Long Pacific swells soften among the islets.",
      flood: "Tide rises cleanly around the rocky reefs.",
      ebb: "Ebb draws out toward the open ocean."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  sitka: {
    id: "sitka",
    name: "Sitka (New Archangel)",
    region: "Alaska Waters",
    description: "Capital of Russian America, 1850. On the rocky headland stands the wooden Governor's House of the Russian-American Company, overlooking timber wharves, shipyard ways, warehouses, and the dome of St. Michael's Cathedral. Outside the palisade wall stretches the substantial Tlingit village, its cedar plank houses and canoes lining the beach on their own ground.",
    exits: {
      w: { to: "sitka_sound", steps: 1, look: "Sitka Sound and Mount Edgecumbe lie west." }
    },
    scenery: {
      headland: "Baranof's Castle Hill topped by the timber Governor's House.",
      wharves: "Company wharves smelling of tar, dried fish, and sea-otter pelts.",
      cathedral: "St. Michael's Russian Orthodox Cathedral, recently consecrated.",
      palisade: "Heavy log stockade separating the Russian-American Company town from the beach.",
      village: "Large Tlingit community of stout cedar plank houses and ocean canoes just beyond the wall."
    },
    objects: ["rac_officer"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water beside the Russian-American Company wharves.",
      flood: "High tide lifts Company boats along the timber pilings.",
      ebb: "Kelp-hung rocks appear beneath Castle Hill."
    },
    hasShore: true,
    hasCamp: true,
    isFort: true,
    isSitka: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 Sitka (New Archangel) details: Governor Mikhail Tebenkov / Nikolai Rosenberg transition (1850), St. Michael's Cathedral (1848), Russian-American Company headquarters and Tlingit village."
  }
};
