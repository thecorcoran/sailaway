// world_strait.js — San Juans, Strait of Juan de Fuca & Pacific Side Route (1850)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.strait = {
  rosario_strait: {
    id: "rosario_strait",
    name: "Rosario Strait",
    region: "San Juans",
    description: "A wide, exposed channel separating Fidalgo Island from the rocky San Juan archipelago. Tide rips curl over kelp-marked reefs, and Mount Baker shines white to the northeast.",
    exits: {
      s: { to: "point_wilson", steps: 3, look: "Open water crosses south to Point Wilson." },
      e: { to: "deception_pass", steps: 2, requiresTide: "slack", blockedText: "Deception Pass is boiling; wait for slack water.", look: "The dark cleft of Deception Pass lies east." },
      w: { to: "lopez_island", steps: 2, look: "Lopez Island's grassy headlands lie west." }
    },
    scenery: {
      reefs: "Kelp-marked rock reefs just beneath the swell.",
      mountain: "Mount Baker's white cone glowing above the mainland.",
      water: "Heavy currents surging north and south through the strait."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The strait eases to long rolling swells.",
      flood: "Strong flood surges north toward the Strait of Georgia.",
      ebb: "Ebb drives south with steep chop."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  lopez_island: {
    id: "lopez_island",
    name: "Lopez Island",
    region: "San Juans",
    description: "Low grassy headlands, rocky coves, and calm bays on the eastern side of the San Juans. Kelp beds ring the points, and Coast Salish reef-netting waters lie off the clear shore.",
    exits: {
      e: { to: "rosario_strait", steps: 2, look: "Rosario Strait opens east." },
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
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  san_juan_island: {
    id: "san_juan_island",
    name: "San Juan Island",
    region: "San Juans",
    description: "Open grassy prairies and fir-topped ridges above rocky coves. In 1850 the Hudson's Bay Company maintains a salmon station here while Americans and British both claim the channel—no boundary is settled.",
    exits: {
      e: { to: "lopez_island", steps: 2, look: "Lopez Island lies east." },
      w: { to: "haro_strait", steps: 1, look: "Wide Haro Strait opens west toward Vancouver Island." }
    },
    scenery: {
      prairies: "Dry grass dotted with wild roses and Garry oaks.",
      ridges: "Rocky timbered hills looking west across the strait.",
      station: "A small HBC salmon-salting camp along the gravel; Coast Salish crews trade fish."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Clear water laps the rocky shelves.",
      flood: "Flood runs north along the island.",
      ebb: "Ebb draws south toward the Strait."
    },
    hasShore: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify exact 1850 HBC presence on San Juan Island (salmon station ~1850; Belle Vue sheep farm 1853)."
  },

  haro_strait: {
    id: "haro_strait",
    name: "Haro Strait",
    region: "San Juans",
    description: "Wide, deep, disputed water separating San Juan Island from Vancouver Island. Southwest, smoke rises from the British fort at Victoria; northwest, the Gulf Islands lead into the Strait of Georgia.",
    exits: {
      e: { to: "san_juan_island", steps: 1, look: "San Juan Island lies east." },
      sw: { to: "fort_victoria", steps: 2, look: "Fort Victoria (HBC) lies southwest on Vancouver Island." },
      nw: { to: "gulf_islands", steps: 2, look: "The wooded Gulf Islands open northwest." }
    },
    scenery: {
      strait: "Broad cold water carrying heavy Pacific tides.",
      island: "The long dark outline of Vancouver Island to the west.",
      water: "Deep cobalt water with sharp tide seams."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "Broad calm swells roll between the islands.",
      flood: "Heavy flood drives north into the Strait of Georgia.",
      ebb: "Strong ebb pours south toward the Strait of Juan de Fuca."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  cape_flattery: {
    id: "cape_flattery",
    name: "Cape Flattery",
    region: "Strait & Pacific",
    description: "Black sea stacks and wave-battered cliffs mark the westernmost point of the Strait. Nearby Makah crews work great ocean canoes out of Neah Bay. Beyond Tatoosh Island stretches the open Pacific—long gray swell, cold wind, and the outer coast running south toward California.",
    exits: {
      e: { to: "point_wilson", steps: 5, look: "The Strait of Juan de Fuca stretches far east back to Point Wilson." },
      s: { to: "fort_ross", steps: 10, look: "The open Pacific coast runs hundreds of miles south toward Fort Ross in California." }
    },
    scenery: {
      stacks: "Jagged black rock pillars white with breaking surf.",
      island: "Tatoosh Island rising starkly out of the swell.",
      canoes: "High-prowed Makah whaling canoes built for heavy Pacific seas.",
      pacific: "Endless gray-green ocean rolling in from the west."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "Long ocean groundswell lifts and drops the boat.",
      flood: "Heavy flood sweeps around the cape into the Strait.",
      ebb: "Ebb collides with Pacific swell in steep white water."
    },
    hasShore: true,
    hasCamp: true,
    milestone: "Reached Cape Flattery and the open Pacific.",
    original_name: "",
    tribal_note: "",
    verify: "Verify direct Strait leg from Point Wilson to Cape Flattery (5 steps abstracts Dungeness/Port Angeles/Neah Bay)."
  },

  fort_ross: {
    id: "fort_ross",
    name: "Fort Ross (California Coast)",
    region: "Strait & Pacific",
    description: "A weathered redwood stockade and timber chapel perched on an exposed bluff above a rocky cove. The Russian-American Company sold out and left in 1842; in 1850 the old fort is a quiet ranch with cattle grazing on the coastal terrace.",
    exits: {
      n: { to: "cape_flattery", steps: 10, look: "The rugged outer Pacific coast stretches far north back to Cape Flattery." }
    },
    scenery: {
      stockade: "Silver-gray redwood palisade walls weathered by ocean fog.",
      chapel: "Small timber Russian chapel standing quiet inside the yard.",
      cove: "Rocky surf-washed landing below the bluff.",
      cattle: "Ranch cattle grazing across the grassy marine terrace."
    },
    objects: [],
    hazard: { exposure: 3, tidal: false, shelter: true },
    tide_variants: {
      slack: "Long Pacific surf booms against the cove rocks.",
      flood: "High surf surges up the rocky landing.",
      ebb: "Kelp-covered boulders show beneath the bluff."
    },
    hasShore: true,
    milestone: "Reached the former Russian post at Fort Ross on the California coast.",
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 owner/ranch status of Fort Ross (Benitz ranch after Sutter purchase from RAC in 1841-42)."
  }
};
