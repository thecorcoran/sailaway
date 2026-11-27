// world_south.js — South Puget Sound (1850, Oregon Territory)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.south = {
  olympia_landing: {
    id: "olympia_landing",
    name: "Olympia Landing",
    region: "South Sound",
    description: "A timber landing at the southern head of Budd Inlet, Oregon Territory, early spring 1850. Your sloop-rigged skiff floats beside the piling. A few claim cabins and a trading store stand among fresh fir stumps; Coast Salish canoes rest along the gravel.",
    exits: {
      s: { to: "tumwater", steps: 1, look: "The Deschutes falls and Tumwater's sawmill lie south." },
      n: { to: "budd_inlet", steps: 1, look: "Budd Inlet stretches north between wooded banks." }
    },
    scenery: {
      landing: "Rough cedar planks spiked to fir pilings.",
      piling: "Tarred pilings furred with barnacles.",
      cabins: "Freshly notched log cabins built on new claims.",
      store: "A clapboard store smelling of salt pork, flour, and wool.",
      stumps: "Wide fir stumps blackened from clearing fires.",
      canoes: "Cedar dugout canoes drawn cleanly above high water.",
      gravel: "Coarse tidal gravel streaked with silt."
    },
    objects: ["dock_cleat", "gear_locker", "trading_post_notice"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Still brown water laps the lower piling.",
      flood: "Rising salt water covers the mudflats up to the gravel.",
      ebb: "Wide mudflats appear beneath the landing."
    },
    hasShore: true,
    hasCamp: false,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 buildings at Olympia landing (Sylvester's 1850 plat / Smithfield)."
  },

  tumwater: {
    id: "tumwater",
    name: "Tumwater",
    region: "South Sound",
    description: "Where the Deschutes River pours over dark basalt ledges into the inlet head. A small water-powered sawmill clatters above the falls beside settler cabins and stacks of fresh fir lumber.",
    exits: {
      n: { to: "olympia_landing", steps: 1, look: "Olympia Landing sits a short row north." }
    },
    scenery: {
      river: "Cold fresh water foaming down into brackish shallows.",
      falls: "White water tumbling over basalt steps.",
      ledges: "Wet basalt slick with moss.",
      sawmill: "Waterwheel mill cutting fir logs into rough boards.",
      cabins: "Early Oregon Territory cabins tucked among tall cedars.",
      lumber: "Resinous fir planks curing above the bank."
    },
    objects: ["fresh_spring"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Brackish water pools quietly below the falls.",
      flood: "High tide backs salt water close to the rocks.",
      ebb: "The river threads through exposed gravel bars."
    },
    hasShore: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 state of Tumwater sawmill/gristmill."
  },

  budd_inlet: {
    id: "budd_inlet",
    name: "Budd Inlet",
    region: "South Sound",
    description: "A narrow arm of water running north from Olympia. Steep clay banks and Douglas firs crowd both shores. Thin smoke rises from a Coast Salish camp along the western beach.",
    exits: {
      s: { to: "olympia_landing", steps: 1, look: "Olympia Landing lies south." },
      n: { to: "boston_harbor_cove", steps: 1, look: "An unsettled gravel spit and cove mark the northern mouth." }
    },
    scenery: {
      banks: "Clay bluffs weeping groundwater beneath hanging ferns.",
      firs: "Tall old-growth firs darkening the water.",
      camp: "Cedar-mat shelters and drying racks on the west shore. Approaching uninvited would be unwise; you can hail from the water.",
      smoke: "Thin blue alder smoke drifting over the inlet.",
      beach: "Gravel and clam shells along the tide line."
    },
    objects: ["clam_bed"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Flat water reflects the green walls of timber.",
      flood: "Incoming tide hides the shoals and lifts driftwood.",
      ebb: "Ebb exposes dark flats and eelgrass along the margins."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: ""
  },

  boston_harbor_cove: {
    id: "boston_harbor_cove",
    name: "Quiet Cove (Later Boston Harbor)",
    region: "South Sound",
    description: "An unsettled gravel spit and sheltered cove at the mouth of Budd Inlet. No cabins stand here—only overhanging firs, bleached cedar logs, and calm water out of the south wind.",
    exits: {
      s: { to: "budd_inlet", steps: 1, look: "Budd Inlet stretches south toward Olympia." },
      w: { to: "eld_inlet", steps: 1, look: "Eld Inlet opens west past a wooded point." },
      n: { to: "dana_passage", steps: 1, look: "Water narrows north into Dana Passage." }
    },
    scenery: {
      spit: "Low gray gravel curving around calm water.",
      cove: "Snug anchorage with good gravel holding.",
      firs: "Old firs leaning over high-tide wrack.",
      logs: "Bark-stripped cedar logs bleached silver."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Quiet water laps the gravel spit.",
      flood: "Gentle current curls into Budd Inlet.",
      ebb: "Ebb sweeps north past the spit, showing kelp."
    },
    hasShore: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 name for Boston Harbor cove (unsettled in 1850; platted later)."
  },

  eld_inlet: {
    id: "eld_inlet",
    name: "Eld Inlet",
    region: "South Sound",
    description: "A winding, shallow inlet bordered by dense cedar and alder. Native oyster beds and mudflats line the coves; herons wade undisturbed along the gravel.",
    exits: {
      e: { to: "boston_harbor_cove", steps: 1, look: "The gravel spit at Budd Inlet's mouth lies east." },
      n: { to: "squaxin_passage", steps: 1, look: "Sheltered Squaxin Passage runs north." }
    },
    scenery: {
      cedar: "Shaggy red cedars dropping brown needles.",
      alder: "Pale alders crowding creek mouths.",
      oysters: "Clusters of small native oysters on gravel bars.",
      mudflats: "Soft dark flats exposed at low water.",
      herons: "Great blue herons standing motionless in the shallows."
    },
    objects: ["oyster_bed"],
    hazard: { exposure: 0, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Still, shallow water over dark silt.",
      flood: "Rising water covers the oyster bars.",
      ebb: "Shoals and mudflats narrow the channel."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  totten_inlet: {
    id: "totten_inlet",
    name: "Totten Inlet",
    region: "South Sound",
    description: "A quiet western reach backed by low timbered hills. A Coast Salish canoe glides past the far point, paddles dipping steadily, bound for the upper flats.",
    exits: {
      e: { to: "squaxin_passage", steps: 1, look: "Squaxin Passage lies east past the wooded point." },
      n: { to: "hammersley_inlet", steps: 1, requiresTide: "slack", blockedText: "Strong current boils out of Hammersley Inlet; wait for slack water.", look: "The narrow mouth of Hammersley Inlet pinches north." }
    },
    scenery: {
      hills: "Low wooded ridges wrapped in thin haze.",
      canoe: "A cedar travel canoe moving along the far bank on its own business.",
      flats: "Wide tidal flats rich with clams.",
      point: "Gravel point tufted with salal and madrona."
    },
    objects: ["clam_bed"],
    hazard: { exposure: 0, tidal: true, currentStrength: "moderate", shelter: true, shoals: true },
    tide_variants: {
      slack: "Calm water mirrors the wooded points.",
      flood: "Flood water pushes steadily into the inlet.",
      ebb: "Ebb drains briskly past Hammersley's mouth."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  hammersley_inlet: {
    id: "hammersley_inlet",
    name: "Hammersley Inlet",
    region: "South Sound",
    description: "A crooked, narrow gut winding between close wooded banks. Swift dark water swirls over submerged gravel bars around tight bends.",
    exits: {
      s: { to: "totten_inlet", steps: 1, requiresTide: "slack", blockedText: "Swift water in the gut bars the southern turn except at slack.", look: "Totten Inlet opens south." },
      e: { to: "pickering_passage", steps: 1, requiresTide: "slack", blockedText: "Strong current races through Hammersley; wait for slack.", look: "Pickering Passage lies east." }
    },
    scenery: {
      banks: "Close earthen banks shadowed by firs.",
      bars: "Submerged gravel bars marked by smooth ripples.",
      water: "Fast, dark tidal water swirling around tree roots."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "strong", shelter: true, shoals: true },
    tide_variants: {
      slack: "Briefly quiet between turns of the tide.",
      flood: "Hard flood races west through the bends.",
      ebb: "Ebb pours east in smooth, fast tongues."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  squaxin_passage: {
    id: "squaxin_passage",
    name: "Squaxin Passage",
    region: "South Sound",
    description: "A sheltered channel between a wooded island and the mainland shore. Kelp beds fringe the gravel points, and the wind drops behind tall timber.",
    exits: {
      s: { to: "eld_inlet", steps: 1, look: "Eld Inlet opens south." },
      w: { to: "totten_inlet", steps: 1, look: "Totten Inlet bends west." },
      e: { to: "hope_island", steps: 1, look: "Low wooded Hope Island lies east." },
      n: { to: "pickering_passage", steps: 1, look: "Pickering Passage continues north." }
    },
    scenery: {
      island: "A densely wooded island above gravel beaches.",
      kelp: "Olive bull-kelp beds leaning with the tidal drift.",
      points: "Cobble points piled with driftwood.",
      water: "Dark shaded channel water."
    },
    objects: [],
    hazard: { exposure: 0, tidal: true, currentStrength: "light", shelter: true },
    tide_variants: {
      slack: "Quiet enough to hear crows across the channel.",
      flood: "Gentle drift moves south along the kelp.",
      ebb: "Falling water pulls north past the points."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  hope_island: {
    id: "hope_island",
    name: "Hope Island",
    region: "South Sound",
    description: "A small uninhabited wooded island ringed with cobble beaches, tide pools, and red-barked madronas. Only salt wind and the rattle of stones break the quiet.",
    exits: {
      w: { to: "squaxin_passage", steps: 1, look: "Squaxin Passage lies west." },
      e: { to: "dana_passage", steps: 1, look: "Dana Passage runs east between steep bluffs." },
      nw: { to: "pickering_passage", steps: 1, look: "Pickering Passage opens northwest." }
    },
    scenery: {
      beach: "Smooth gray cobbles and bleached cedar logs.",
      madronas: "Twisted red-barked madronas leaning over salt water.",
      "tide pools": "Clear pockets holding anemones and small shore crabs.",
      stones: "Round cobbles rattling softly in the wash."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Clear water laps the stones.",
      flood: "Rising water climbs the gravel spit.",
      ebb: "Tide pools show along the low spit."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  dana_passage: {
    id: "dana_passage",
    name: "Dana Passage",
    region: "South Sound",
    description: "A constricted passage between high wooded bluffs. Kelp lines the edges, and tide seams show where waters from the southern inlets meet.",
    exits: {
      s: { to: "boston_harbor_cove", steps: 1, look: "The quiet cove at Budd Inlet's mouth lies south." },
      w: { to: "hope_island", steps: 1, look: "Hope Island's madrona shore sits west." },
      n: { to: "case_inlet", steps: 2, look: "Case Inlet stretches far north." },
      e: { to: "nisqually_reach", steps: 2, look: "Broad Nisqually Reach opens east." }
    },
    scenery: {
      bluffs: "Steep sandy bluffs topped with firs.",
      kelp: "Long fronds streaming taut in the run.",
      seams: "Lines of foam where currents meet.",
      water: "Deep green water moving briskly."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "The passage rests briefly, kelp floating loose.",
      flood: "Brisk flood pushes south through the bend.",
      ebb: "Ebb draws foam lines north and east."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  pickering_passage: {
    id: "pickering_passage",
    name: "Pickering Passage",
    region: "South Sound",
    description: "A winding wooded corridor between Hartstene Island and the western shore. Quiet coves indent the bank, and woodpeckers drum in the cedars.",
    exits: {
      w: { to: "hammersley_inlet", steps: 1, requiresTide: "slack", blockedText: "Hammersley Inlet is boiling; wait for slack water.", look: "The tight mouth of Hammersley Inlet lies west." },
      s: { to: "squaxin_passage", steps: 1, look: "Squaxin Passage lies south." },
      se: { to: "hope_island", steps: 1, look: "Hope Island sits southeast." },
      e: { to: "case_inlet", steps: 1, look: "Case Inlet opens east." }
    },
    scenery: {
      island: "Timbered slopes of Hartstene Island rising east.",
      coves: "Shallow gravel coves sheltered from wind.",
      cedars: "Old cedars overhanging the bank."
    },
    objects: [],
    hazard: { exposure: 0, tidal: true, currentStrength: "light", shelter: true },
    tide_variants: {
      slack: "Flat water reflects both wooded banks.",
      flood: "Steady flood drifts south.",
      ebb: "Ebb pulls gently north."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  case_inlet: {
    id: "case_inlet",
    name: "Case Inlet",
    region: "South Sound",
    description: "A long, dead-end northern reach stretching into timbered hills. Gravel spits and empty beaches run for miles; a wooded peninsula separates this water from Carr Inlet to the east.",
    exits: {
      s: { to: "dana_passage", steps: 2, look: "Dana Passage lies south." },
      w: { to: "pickering_passage", steps: 1, look: "Pickering Passage opens west." }
    },
    scenery: {
      hills: "Unbroken evergreen hills receding north.",
      spits: "Long gravel points jutting into the inlet.",
      peninsula: "The wooded Key Peninsula barring any direct passage east to Carr Inlet.",
      beaches: "Empty cobble beaches littered with driftwood."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water stretches far north.",
      flood: "Rising water covers the lower spits.",
      ebb: "Wide gravel bars show along the coves."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  nisqually_reach: {
    id: "nisqually_reach",
    name: "Nisqually Reach",
    region: "South Sound",
    description: "Broad open water facing the wide salt marsh and mudflats of the Nisqually River delta. Mount Rainier looms white above the timber when the sky clears.",
    exits: {
      w: { to: "dana_passage", steps: 2, look: "Dana Passage lies west." },
      n: { to: "anderson_island", steps: 1, look: "Anderson Island's bluffs rise north." },
      ne: { to: "carr_inlet", steps: 2, look: "Carr Inlet opens northeast past Anderson and McNeil islands." },
      e: { to: "fort_nisqually", steps: 1, look: "The Hudson's Bay landing below Fort Nisqually lies east." }
    },
    scenery: {
      marsh: "Wide beds of salt grass swaying above braided river channels.",
      mudflats: "Miles of glistening tidal silt.",
      delta: "Flat driftwood-strewn flats too shallow for a keel.",
      mountain: "Mount Rainier's snow peak towering above the eastern forest."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false, shoals: true },
    tide_variants: {
      slack: "Long gentle swells roll off the delta.",
      flood: "Salt water spreads quietly over the marsh flats.",
      ebb: "Silty river water fans out across the reach."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  fort_nisqually: {
    id: "fort_nisqually",
    name: "Fort Nisqually (HBC)",
    region: "South Sound",
    description: "The beach landing below the Hudson's Bay Company post. A wagon track climbs the bluff toward the palisade. Company men and Coast Salish traders handle wool, pelts, and blankets beside a squared-timber warehouse.",
    exits: {
      w: { to: "nisqually_reach", steps: 1, look: "Nisqually Reach opens west." },
      n: { to: "steilacoom", steps: 1, look: "The new settlement at Steilacoom lies north." }
    },
    scenery: {
      track: "Rutted wagon road climbing the steep clay bluff.",
      bluff: "High bluff hiding the fort's palisade above.",
      warehouse: "Stout squared-timber Company storehouse above high water.",
      traders: "Coast Salish families and Company clerks weighing pelts and blankets; an older traveler warns you that shellfish in warm months have killed people."
    },
    objects: ["hbc_clerk"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water along the Company beach.",
      flood: "High water reaches the timber skidway.",
      ebb: "Wide gravel beach makes landing easy."
    },
    hasShore: true,
    isFort: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 Sequalitchew Creek beach warehouse details at Fort Nisqually."
  },

  anderson_island: {
    id: "anderson_island",
    name: "Anderson Island",
    region: "South Sound",
    description: "Wooded bluffs above quiet gravel coves. Clear water laps the stones, and the mainland shore stands across a brisk eastern channel.",
    exits: {
      s: { to: "nisqually_reach", steps: 1, look: "Nisqually Reach opens south." },
      n: { to: "carr_inlet", steps: 1, look: "Carr Inlet widens north." },
      e: { to: "steilacoom", steps: 1, look: "Steilacoom's gravel beach lies east across Balch Passage." }
    },
    scenery: {
      bluffs: "Sandy bluffs crowned with dark firs.",
      coves: "Protected gravel coves good for anchoring.",
      stones: "Clean beach cobbles along the tideline."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Quiet water along the coves.",
      flood: "Current moves briskly past the eastern point.",
      ebb: "Ebb draws past the bluffs toward the Narrows."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  steilacoom: {
    id: "steilacoom",
    name: "Steilacoom",
    region: "South Sound",
    description: "A newly settled shore of fresh-cut stumps, rough claim cabins, and an army post on the gravel prairie above. Stacked timbers await a wharf along the beach.",
    exits: {
      s: { to: "fort_nisqually", steps: 1, look: "Fort Nisqually's landing lies south." },
      w: { to: "anderson_island", steps: 1, look: "Anderson Island rises west across Balch Passage." },
      n: { to: "tacoma_narrows", steps: 2, requiresTide: "slack", blockedText: "Tacoma Narrows is boiling with tide; wait for slack water.", look: "Steep opposing walls mark Tacoma Narrows to the north." }
    },
    scenery: {
      cabins: "New claim cabins near the bluff.",
      timbers: "Half-finished wharf pilings stacked on the gravel.",
      stumps: "Raw fir stumps smelling of pitch.",
      prairie: "Open prairie above where U.S. soldiers camp."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Quiet swells roll onto the gravel.",
      flood: "Rising tide reaches the stacked timbers.",
      ebb: "Broad cobble beach opens below the cabins."
    },
    hasShore: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 details of Steilacoom (Balch 1850 / Fort Steilacoom 1849)."
  },

  carr_inlet: {
    id: "carr_inlet",
    name: "Carr Inlet",
    region: "South Sound",
    description: "A broad basin reached north from Nisqually Reach, bordered by wooded islands and steep bluffs. East, the hills pinch toward the mouth of the Narrows.",
    exits: {
      sw: { to: "nisqually_reach", steps: 2, look: "Nisqually Reach opens southwest." },
      s: { to: "anderson_island", steps: 1, look: "Anderson Island rises just south." },
      e: { to: "tacoma_narrows", steps: 2, requiresTide: "slack", blockedText: "The tide roars through Tacoma Narrows; wait for slack water.", look: "Tacoma Narrows pinches east." }
    },
    scenery: {
      islands: "Low forested McNeil and Fox islands resting in the basin.",
      bluffs: "Sandy glacial bluffs streaked with runoff.",
      hills: "Dark ridges closing in toward the Narrows."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "The broad basin lies quiet.",
      flood: "Current streams in from the Narrows.",
      ebb: "Water draws steadily east toward the Narrows."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  tacoma_narrows: {
    id: "tacoma_narrows",
    name: "Tacoma Narrows",
    region: "South Sound",
    description: "Sheer wooded bluffs squeeze the southern Sound into a throat barely a mile wide. Even at slack, cold upwellings and faint seams hint at the weight of water below.",
    exits: {
      s: { to: "steilacoom", steps: 2, look: "The shore opens south toward Steilacoom." },
      w: { to: "carr_inlet", steps: 2, look: "Carr Inlet opens west." },
      n: { to: "gig_harbor", steps: 1, look: "A narrow gravel spit guards Gig Harbor to the north." },
      ne: { to: "commencement_bay", steps: 2, look: "Wide Commencement Bay opens northeast." }
    },
    scenery: {
      bluffs: "Steep wooded walls dropping straight into deep water.",
      seams: "Smooth current lines twisting through the strait.",
      kelp: "Heavy bull kelp anchored deep below.",
      water: "Cold green water boiling silently from below."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "For a brief span the strait holds still and passable.",
      flood: "Fierce flood races south in spinning whirlpools.",
      ebb: "Ebb boils north with standing waves along the points."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  }
};
