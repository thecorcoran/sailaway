// world_strait.js — Strait of Juan de Fuca & North Route / San Juans (1850, Oregon Territory)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.strait = {
  discovery_bay: {
    id: "discovery_bay",
    name: "Discovery Bay",
    region: "Strait of Juan de Fuca",
    description: "A long, deep bay sheltered by Protection Island at its mouth—the same anchorage where George Vancouver refitted his ships in 1792. Timbered hills rise gently around quiet water.",
    exits: {
      e: { to: "point_wilson", steps: 2, look: "Point Wilson lies east where Admiralty Inlet begins." },
      w: { to: "dungeness_spit", steps: 2, look: "The long low finger of Dungeness Spit reaches west." }
    },
    scenery: {
      island: "Low, grassy Protection Island standing across the mouth.",
      hills: "Quiet evergreen slopes surrounding the anchorage."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water sheltered from Strait swells.",
      flood: "Gentle flood enters around Protection Island.",
      ebb: "Ebb draws out into the Strait."
    },
    original_name: "",
    tribal_note: ""
  },

  dungeness_spit: {
    id: "dungeness_spit",
    name: "Dungeness Spit",
    region: "Strait of Juan de Fuca",
    description: "A five-mile sandspit curving like a scythe into the Strait, heaped with bleached driftwood. Inside the hook lies a shallow, calm bay backed by Native villages and open prairie.",
    exits: {
      e: { to: "discovery_bay", steps: 2, look: "Discovery Bay lies east." },
      w: { to: "port_angeles", steps: 2, look: "Ediz Hook and Port Angeles harbor lie west along the Strait." }
    },
    scenery: {
      spit: "Long low sandspit piled with salt-white logs.",
      driftwood: "Massive storm-tossed trunks bleached pale gray.",
      villages: "Klallam settlements along the sheltered bay shore."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "moderate", shelter: true, shoals: true },
    tide_variants: {
      slack: "Ocean swell rolls gently outside the spit.",
      flood: "Flood streams east along the outer beach.",
      ebb: "Ebb pulls west toward the Pacific."
    },
    original_name: "",
    tribal_note: ""
  },

  port_angeles: {
    id: "port_angeles",
    name: "Port Angeles (Ediz Hook)",
    region: "Strait of Juan de Fuca",
    description: "A long narrow gravel hook curving out from steep bluffs to enclose a deep, empty harbor. No town stands here in 1850—only dense forest climbing toward the Olympics and a Klallam village near the creek.",
    exits: {
      e: { to: "dungeness_spit", steps: 2, look: "Dungeness Spit lies east." },
      w: { to: "sekiu", steps: 4, look: "A long, exposed reach of the Strait runs west toward Sekiu." }
    },
    scenery: {
      hook: "A thin three-mile arm of cobble and driftwood shielding the harbor.",
      bluffs: "Steep clay bluffs and dark firs above the empty shore.",
      village: "Cedar houses and large ocean-going canoes near the creek mouth."
    },
    objects: [],
    hazard: { exposure: 2, tidal: false, shelter: true },
    tide_variants: {
      slack: "Deep calm water inside the hook.",
      flood: "Ocean swell rolls past the outer tip of the hook.",
      ebb: "Strong west-running ebb outside the harbor."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Angeles (no white town; first claims late 1850s)."
  },

  sekiu: {
    id: "sekiu",
    name: "Sekiu",
    region: "Strait of Juan de Fuca",
    description: "A small kelp-fringed bight along the rugged outer Strait. Heavy Pacific groundswell rolls past the rocky points, and towering spruce and hemlock crowd the steep coast.",
    exits: {
      e: { to: "port_angeles", steps: 4, look: "The long Strait shore runs east back to Ediz Hook." },
      w: { to: "neah_bay", steps: 2, look: "Neah Bay lies west under the shadow of Cape Flattery." }
    },
    scenery: {
      kelp: "Thick beds of giant kelp damping the swell near shore.",
      points: "Dark wave-cut rocks whitened with foam.",
      spruce: "Wind-sheared Sitka spruce leaning inland from the gales."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: true },
    tide_variants: {
      slack: "Long Pacific swells heave steadily through the kelp.",
      flood: "Flood pushes east along the rocky shore.",
      ebb: "Ebb against a west wind stacks steep, breaking seas."
    },
    original_name: "",
    tribal_note: ""
  },

  neah_bay: {
    id: "neah_bay",
    name: "Neah Bay",
    region: "Strait of Juan de Fuca",
    description: "A wide bay near the mouth of the Strait, home to a thriving Makah village of cedar plank houses and great ocean whaling canoes. Sea mist drifts in from the Pacific.",
    exits: {
      e: { to: "sekiu", steps: 2, look: "Sekiu lies east along the rocky Strait." },
      w: { to: "cape_flattery", steps: 1, look: "Cape Flattery and the open Pacific lie just west." }
    },
    scenery: {
      village: "Stout cedar plank houses facing the bay; Makah crews ready canoes and gear for the sea.",
      canoes: "High-prowed ocean canoes carved for heavy Pacific swell.",
      mist: "Cold salt mist blowing off the cape."
    },
    objects: [],
    hazard: { exposure: 2, tidal: false, shelter: true },
    tide_variants: {
      slack: "Deep ocean swell rolls softly onto the beach.",
      flood: "Tide sweeps east past Waadah Island.",
      ebb: "Ebb pulls west toward the open sea."
    },
    original_name: "",
    tribal_note: ""
  },

  cape_flattery: {
    id: "cape_flattery",
    name: "Cape Flattery",
    region: "Strait of Juan de Fuca",
    description: "Black sea stacks and wave-battered cliffs mark the westernmost point. Beyond Tatoosh Island stretches the open Pacific—long gray swells, cold salt wind, and uncharted horizon with no land in sight.",
    exits: {
      e: { to: "neah_bay", steps: 1, look: "Sheltered Neah Bay lies east." }
    },
    scenery: {
      stacks: "Jagged black rock pillars white with breaking surf.",
      island: "Tatoosh Island rising starkly out of the swell.",
      pacific: "Endless gray-green ocean rolling in from the west."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "Long ocean groundswell lifts and drops your skiff.",
      flood: "Heavy flood sweeps around the cape into the Strait.",
      ebb: "Ebb collides with Pacific swell in steep white water."
    },
    ending: "cape_flattery",
    original_name: "",
    tribal_note: ""
  },

  rosario_strait: {
    id: "rosario_strait",
    name: "Rosario Strait",
    region: "North Route",
    description: "A wide, exposed channel separating Fidalgo Island from the rocky San Juan archipelago. Tide rips curl over submerged reefs, and Mount Baker shines white to the northeast.",
    exits: {
      s: { to: "point_wilson", steps: 3, look: "Open water crosses south to Point Wilson." },
      e: { to: "deception_pass", steps: 2, requiresTide: "slack", blockedText: "Deception Pass is boiling; wait for slack water.", look: "The dark cleft of Deception Pass lies east." },
      n: { to: "cypress_island", steps: 2, look: "High wooded Cypress Island rises north." },
      w: { to: "lopez_island", steps: 2, look: "Lopez Island lies west across the strait." }
    },
    scenery: {
      reefs: "Kelp-marked rock reefs just beneath the swell.",
      mountain: "Mount Baker's white cone glowing above the mainland.",
      islands: "Dark rocky silhouettes of the San Juans."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The strait eases to long rolling swells.",
      flood: "Strong flood surges north toward the Strait of Georgia.",
      ebb: "Ebb drives south with steep chop."
    },
    original_name: "",
    tribal_note: ""
  },

  cypress_island: {
    id: "cypress_island",
    name: "Cypress Island",
    region: "North Route",
    description: "A steep, uninhabited island of rocky bluffs, red madronas, and deep clear coves. Eagles perch in the dead snags above the gravel.",
    exits: {
      s: { to: "rosario_strait", steps: 2, look: "Rosario Strait opens south." },
      sw: { to: "lopez_island", steps: 2, look: "Lopez Island lies southwest." }
    },
    scenery: {
      bluffs: "Glacier-scraped rock ledges rising into dense fir.",
      madronas: "Twisted orange-barked trees clinging to dry cliffs.",
      eagles: "Bald eagles watching the tide lines from tall snags."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Clear, still water in the lee coves.",
      flood: "Flood streams north along the rocky shore.",
      ebb: "Ebb swirls past the southern point."
    },
    original_name: "",
    tribal_note: ""
  },

  lopez_island: {
    id: "lopez_island",
    name: "Lopez Island",
    region: "North Route",
    description: "Low grassy headlands, rocky coves, and calm bays on the eastern side of the San Juans. Kelp beds ring the points, and reef-netting sites mark the clear northern shore.",
    exits: {
      e: { to: "rosario_strait", steps: 2, look: "Rosario Strait lies east." },
      ne: { to: "cypress_island", steps: 2, look: "Cypress Island rises northeast." },
      w: { to: "san_juan_island", steps: 2, look: "San Juan Island lies west across San Juan Channel." }
    },
    scenery: {
      headlands: "Open grass and wind-bent Douglas firs above gray rock.",
      kelp: "Dense kelp beds sheltering rockfish and crabs.",
      coves: "Snug rocky coves with gravel beaches."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: true },
    tide_variants: {
      slack: "Quiet water inside the rocky coves.",
      flood: "Current moves north through the channels.",
      ebb: "Ebb pulls south past the kelp points."
    },
    original_name: "",
    tribal_note: ""
  },

  san_juan_island: {
    id: "san_juan_island",
    name: "San Juan Island",
    region: "North Route",
    description: "Open grassy prairies and fir-topped ridges above rocky coves. In 1850 the Hudson's Bay Company runs salmon salting and sheep camps here, while Americans and British both claim the channel—no boundary is settled.",
    exits: {
      e: { to: "lopez_island", steps: 2, look: "Lopez Island lies east." },
      w: { to: "haro_strait", steps: 1, look: "Wide Haro Strait opens west toward Vancouver Island." }
    },
    scenery: {
      prairies: "Dry golden grass dotted with wild roses and oaks.",
      ridges: "Rocky timbered hills looking west across the strait.",
      camps: "A small HBC fishing station along the shore; Native crews trade salmon."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Clear water laps the rocky shelves.",
      flood: "Flood runs north along the island.",
      ebb: "Ebb draws south toward the Strait."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify exact 1850 HBC presence on San Juan Island (salmon station ~1850; Belle Vue sheep farm 1853)."
  },

  haro_strait: {
    id: "haro_strait",
    name: "Haro Strait",
    region: "North Route",
    description: "Wide, deep, disputed water separating San Juan Island from Vancouver Island. Across the strait smoke rises near Fort Victoria (HBC); northward, the passage opens toward Vancouver Island's sheltered coast, Russian America, and Sitka far beyond.",
    exits: {
      e: { to: "san_juan_island", steps: 1, look: "San Juan Island lies east." }
    },
    scenery: {
      strait: "Broad, cold water carrying heavy Pacific tides north and south.",
      island: "The long dark outline of Vancouver Island to the west.",
      smoke: "Distant smoke rising from the British fort at Victoria."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "Broad calm swells roll between the islands.",
      flood: "Heavy flood drives north into the Strait of Georgia.",
      ebb: "Strong ebb pours south toward the Strait of Juan de Fuca."
    },
    ending: "haro_strait",
    original_name: "",
    tribal_note: ""
  }
};
