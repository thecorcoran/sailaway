// world_hood.js — Hood Canal Side Basin (1850, Oregon Territory)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.hood = {
  port_gamble: {
    id: "port_gamble",
    name: "Port Gamble",
    region: "Hood Canal",
    description: "A sheltered bay just inside Hood Canal's mouth, guarded by a low sandspit. Tall firs crowd the steep shore; no sawmill stands here yet, only a Coast Salish village on the eastern point.",
    exits: {
      n: { to: "foulweather_bluff", steps: 1, look: "Foulweather Bluff lies north at the canal entrance." },
      sw: { to: "dabob_bay", steps: 2, look: "Hood Canal stretches southwest toward Dabob Bay." }
    },
    scenery: {
      spit: "Curving sandspit sheltering the inner bay.",
      firs: "Unbroken old-growth fir timber rising behind the beach.",
      village: "Cedar houses and canoes along the point."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Still clear water inside the spit.",
      flood: "Flood slides quietly into the bay.",
      ebb: "Ebb pulls north past the sandspit."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Gamble (Puget Mill Co. founded 1853)."
  },

  dabob_bay: {
    id: "dabob_bay",
    name: "Dabob Bay",
    region: "Hood Canal",
    description: "A deep, quiet northern arm of Hood Canal beneath the steep snow-dusted wall of the Olympic Mountains. Gravel beaches and cedar coves line the base of the peaks.",
    exits: {
      ne: { to: "port_gamble", steps: 2, look: "Port Gamble lies northeast." },
      s: { to: "hoodsport", steps: 3, look: "Hood Canal runs far south beneath the Olympics." }
    },
    scenery: {
      mountains: "Jagged Olympic ridges rising sharply from the western forest.",
      beaches: "Clean gravel beaches strewn with cedar bark.",
      coves: "Deep sheltered coves at the foot of the hills."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Deep green water mirrors the Olympic peaks.",
      flood: "Gentle flood drifts up the bay.",
      ebb: "Ebb draws slowly south."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  hoodsport: {
    id: "hoodsport",
    name: "Hoodsport Shore",
    region: "Hood Canal",
    description: "A steep gravel shoreline under the towering eastern flank of the Olympics. Cold mountain creeks tumble into the canal, and wind funnels down the narrow fjord.",
    exits: {
      n: { to: "dabob_bay", steps: 3, look: "Dabob Bay lies north along the canal." },
      se: { to: "lynch_cove", steps: 3, look: "The canal bends sharply east toward shallow Lynch Cove." }
    },
    scenery: {
      creeks: "Clear snowmelt creeks cutting through gravel fans.",
      shoreline: "Steep cobble beach dropping into deep water.",
      peaks: "Snow-streaked Olympic ridges towering overhead."
    },
    objects: ["fresh_spring"],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Dark quiet water under the mountains.",
      flood: "Flood pushes south down the canal.",
      ebb: "Ebb pulls north; wind raises sudden chop."
    },
    hasShore: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 name for Hoodsport shore (modern name dates to 1890s)."
  },

  lynch_cove: {
    id: "lynch_cove",
    name: "Lynch Cove",
    region: "Hood Canal",
    description: "The shallow eastern tail of Hood Canal, ending in quiet marsh and mudflats not far overland from Case Inlet. Tall firs and silence enclose the water.",
    exits: {
      nw: { to: "hoodsport", steps: 3, look: "Hood Canal bends northwest toward the Olympics." }
    },
    scenery: {
      marsh: "Salt grass and cattails where the canal ends.",
      mudflats: "Shallow dark flats steaming faintly in cool air.",
      firs: "Quiet timbered hills separating this cove from South Sound."
    },
    objects: ["oyster_bed"],
    hazard: { exposure: 0, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Mirror-still shallow water.",
      flood: "High water floats the upper cove easily.",
      ebb: "Low water leaves wide flats—mind your depth."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  }
};
