// world_hood.js — Hood Canal (1850, Oregon Territory)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.hood = {
  port_gamble: {
    id: "port_gamble",
    name: "Port Gamble",
    region: "Hood Canal",
    description: "A sheltered bay just inside the mouth of Hood Canal, guarded by a low sandspit. Tall firs crowd the steep shore; no sawmill exists here yet, only a Native village on the eastern point.",
    exits: {
      n: { to: "foulweather_bluff", steps: 1, look: "Foulweather Bluff lies north at the canal entrance." },
      sw: { to: "dabob_bay", steps: 2, look: "Hood Canal stretches southwest toward Dabob Bay." }
    },
    scenery: {
      spit: "A curving sandspit sheltering the inner bay.",
      firs: "Unbroken old-growth fir timber rising behind the beach.",
      village: "Cedar houses and canoes along the point; smoke drifts over the calm bay."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Still, clear water inside the spit.",
      flood: "Flood tide slides quietly into the bay.",
      ebb: "Ebb pulls north past the sandspit."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Port Gamble (Puget Mill Co. founded 1853)."
  },

  dabob_bay: {
    id: "dabob_bay",
    name: "Dabob Bay",
    region: "Hood Canal",
    description: "A deep, quiet northern arm of Hood Canal beneath the steep snow-dusted wall of the Olympic Mountains. Gravel beaches and dark cedar coves line the base of the peaks.",
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
      ebb: "Ebb draws slowly south toward the main canal."
    },
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
      s: { to: "great_bend", steps: 2, look: "The canal bends sharply east at The Great Bend to the south." }
    },
    scenery: {
      creeks: "Clear snowmelt creeks cutting through gravel fans.",
      shoreline: "Steep cobble beach dropping quickly into deep water.",
      peaks: "Snow-streaked Olympic ridges towering directly overhead."
    },
    objects: ["fresh_spring"],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Dark, quiet water under the mountains.",
      flood: "Flood tide pushes south down the canal.",
      ebb: "Ebb pulls north; wind can raise sudden chop."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 name for Hoodsport shore (modern name dates to 1890s)."
  },

  great_bend: {
    id: "great_bend",
    name: "The Great Bend",
    region: "Hood Canal",
    description: "Where Hood Canal turns sharply eastward like a crooked hook. The Skokomish River delta spreads broad mudflats and marsh across the southern shore, where Native plank houses and canoes line the river banks.",
    exits: {
      n: { to: "hoodsport", steps: 2, look: "The long straight arm of Hood Canal runs north." },
      e: { to: "lynch_cove", steps: 2, look: "Shallow Lynch Cove stretches east." }
    },
    scenery: {
      delta: "Wide braided mouths of the Skokomish River.",
      mudflats: "Broad tidal flats rich with clams and shorebirds.",
      houses: "Native cedar houses along the river mouth; canoes move across the flats."
    },
    objects: ["clam_bed"],
    hazard: { exposure: 1, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Calm brackish water at the bend.",
      flood: "Rising tide covers the delta bars.",
      ebb: "Extensive mudflats appear off the river mouth."
    },
    original_name: "",
    tribal_note: ""
  },

  lynch_cove: {
    id: "lynch_cove",
    name: "Lynch Cove",
    region: "Hood Canal",
    description: "The shallow eastern tail of Hood Canal, ending in quiet marsh and mudflats just a short overland portage from Case Inlet. Tall firs and silence enclose the water.",
    exits: {
      w: { to: "great_bend", steps: 2, look: "The Great Bend lies west." }
    },
    scenery: {
      marsh: "Salt grass and cattails where the canal finally ends.",
      mudflats: "Shallow dark flats steaming faintly in cool air.",
      firs: "Quiet timbered hills separating this cove from South Sound."
    },
    objects: ["oyster_bed"],
    hazard: { exposure: 0, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Mirror-still shallow water.",
      flood: "High water makes the upper cove easy to float.",
      ebb: "Low water leaves wide flats—watch your keel."
    },
    original_name: "",
    tribal_note: ""
  }
};
