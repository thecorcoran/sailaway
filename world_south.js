// world_south.js — South Puget Sound (1850, Oregon Territory)
// All locations: id, name, description, exits (reciprocal with steps), scenery, objects, hazard, tide_variants, original_name, tribal_note, optional verify.
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.south = {
  olympia_landing: {
    id: "olympia_landing",
    name: "Olympia Landing",
    region: "South Sound",
    description: "A timber landing at the southern head of Budd Inlet. Your sloop-rigged skiff rides beside the piling, oars shipped and lugsail furled. A few claim cabins and a trading store stand back among the stumps; canoes are drawn up along the gravel.",
    exits: {
      s: { to: "tumwater", steps: 1, look: "The Deschutes mouth and Tumwater's mill falls lie just south." },
      n: { to: "budd_inlet", steps: 1, look: "Budd Inlet opens north between wooded banks." }
    },
    scenery: {
      landing: "Rough-hewn cedar planks laid over fir pilings.",
      piling: "Tarred pilings furred with barnacles.",
      cabins: "Freshly notched log cabins built by new Oregon Territory settlers.",
      store: "A clapboard trading post smelling of salt pork, flour, and wet wool.",
      stumps: "Wide fir stumps blackened from recent clearing fires.",
      canoes: "Cedar dugout canoes pulled neatly above the tide line by Native travelers.",
      gravel: "Coarse tidal gravel streaked with dark silt."
    },
    objects: ["dock_cleat", "gear_locker", "trading_post_notice"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Still brown water laps the lower piling.",
      flood: "Rising salt water covers the mudflats up to the gravel.",
      ebb: "Wide mudflats appear beneath the landing; gulls work the shallows."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify exact 1850 buildings at Olympia landing (Edmund Sylvester's 1850 plat / Smithfield)."
  },

  tumwater: {
    id: "tumwater",
    name: "Tumwater",
    region: "South Sound",
    description: "Where the Deschutes River tumbles over basalt ledges into the head of the inlet. A small sawmill clatters above the falls beside a cluster of settler cabins and fresh-sawn fir boards.",
    exits: {
      n: { to: "olympia_landing", steps: 1, look: "Olympia's timber landing sits a short row north." }
    },
    scenery: {
      river: "Cold fresh water foaming down into the brackish basin.",
      falls: "White water pouring over dark basalt steps.",
      ledges: "Wet basalt rock slick with moss.",
      sawmill: "Water-powered mill turning fir logs into rough lumber.",
      cabins: "Michael Simmons's settlement cabins tucked among tall cedars.",
      boards: "Stacks of resinous fir planks curing above the bank."
    },
    objects: ["fresh_spring"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Brackish water pools quietly below the falls.",
      flood: "High tide backs salt water close to the lower rocks.",
      ebb: "The river cuts a narrow channel through exposed gravel bars."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 state of the Tumwater gristmill/sawmill."
  },

  budd_inlet: {
    id: "budd_inlet",
    name: "Budd Inlet",
    region: "South Sound",
    description: "A long, narrow arm of water running north from Olympia. Steep clay banks and Douglas firs crowd both shores. Smoke rises from a Native camp along the western beach.",
    exits: {
      s: { to: "olympia_landing", steps: 1, look: "The landing and cabins of Olympia lie south." },
      n: { to: "boston_harbor_cove", steps: 1, look: "A sheltered gravel point and quiet cove mark the northern mouth." }
    },
    scenery: {
      banks: "Clay bluffs weeping groundwater beneath hanging ferns.",
      firs: "Tall old-growth firs darkening the shoreline.",
      camp: "Cedar-mat shelters and drying racks along the west shore; people tend a low fire and pay your skiff passing notice.",
      smoke: "Thin blue alder smoke drifting over the water.",
      beach: "Gravel and clam shells along the tide line."
    },
    objects: ["clam_bed"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Flat water reflects the green walls of timber.",
      flood: "The incoming tide hides the shoals and lifts stray driftwood.",
      ebb: "Ebb water exposes dark flats and eelgrass along the margins."
    },
    original_name: "",
    tribal_note: ""
  },

  boston_harbor_cove: {
    id: "boston_harbor_cove",
    name: "Quiet Cove (Later Boston Harbor)",
    region: "South Sound",
    description: "An unsettled gravel spit and sheltered cove at the mouth of Budd Inlet. No buildings stand here—only overhanging firs, stranded cedar logs, and a calm lee out of the south wind.",
    exits: {
      s: { to: "budd_inlet", steps: 1, look: "Budd Inlet stretches south toward Olympia." },
      w: { to: "eld_inlet", steps: 1, look: "Eld Inlet opens southwest past a wooded point." },
      n: { to: "dana_passage", steps: 1, look: "The water narrows north into Dana Passage." }
    },
    scenery: {
      spit: "Low gray gravel curving around a pocket of calm water.",
      cove: "A snug anchorage with good gravel holding ground.",
      firs: "Old firs leaning over the high-tide wrack.",
      logs: "Bark-stripped cedar logs bleached silver by salt and sun."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Quiet water laps the gravel spit.",
      flood: "Gentle current curls around the point into Budd Inlet.",
      ebb: "Ebb water sweeps north past the spit, showing beds of kelp."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 name for Boston Harbor cove (unsettled in 1850; platted much later)."
  },

  eld_inlet: {
    id: "eld_inlet",
    name: "Eld Inlet",
    region: "South Sound",
    description: "A winding, shallow inlet bordered by dense cedar and alder. Oyster beds and mudflats line the upper coves; herons wade undisturbed along the gravel.",
    exits: {
      e: { to: "boston_harbor_cove", steps: 1, look: "The gravel spit at the mouth of Budd Inlet lies east." },
      n: { to: "squaxin_passage", steps: 1, look: "Sheltered Squaxin Passage runs north along wooded shores." }
    },
    scenery: {
      cedar: "Shaggy red cedars dropping brown needles to the shore.",
      alder: "Pale-barked alders crowding creek mouths.",
      oysters: "Clusters of small native oysters clinging to tide-washed gravel.",
      mudflats: "Soft dark tidal flats exposed at low water.",
      herons: "Great blue herons standing motionless in the shallows."
    },
    objects: ["oyster_bed"],
    hazard: { exposure: 0, tidal: false, shelter: true, shoals: true },
    tide_variants: {
      slack: "Still, shallow water over dark silt.",
      flood: "Rising water covers the oyster bars.",
      ebb: "Shoals and mudflats narrow the navigable channel."
    },
    original_name: "",
    tribal_note: ""
  },

  totten_inlet: {
    id: "totten_inlet",
    name: "Totten Inlet",
    region: "South Sound",
    description: "A quiet western reach backed by low wooded hills. A Native canoe party glides past the far point, paddles dipping in steady unison, bound for the upper flats.",
    exits: {
      e: { to: "squaxin_passage", steps: 1, look: "Squaxin Passage lies east past the wooded point." },
      n: { to: "hammersley_inlet", steps: 1, requiresTide: "slack", blockedText: "The current boils out of Hammersley Inlet; wait for slack water.", look: "The narrow mouth of Hammersley Inlet pinches north." }
    },
    scenery: {
      hills: "Low timbered ridges wrapped in thin haze.",
      canoe: "A cedar travel canoe moving swiftly along the far bank on its own business.",
      flats: "Wide tidal flats rich with clams and shorebirds.",
      point: "A gravel point tufted with salal and madrona."
    },
    objects: ["clam_bed"],
    hazard: { exposure: 0, tidal: true, currentStrength: "moderate", shelter: true, shoals: true },
    tide_variants: {
      slack: "Calm water mirrors the wooded points.",
      flood: "Flood water pushes steadily into the inlet.",
      ebb: "Ebb water drains briskly past the mouth of Hammersley."
    },
    original_name: "",
    tribal_note: ""
  },

  hammersley_inlet: {
    id: "hammersley_inlet",
    name: "Hammersley Inlet",
    region: "South Sound",
    description: "A crooked, narrow gut winding between close wooded banks. The water runs swift and dark over submerged gravel bars, swinging sharply around every bend.",
    exits: {
      s: { to: "totten_inlet", steps: 1, requiresTide: "slack", blockedText: "Swift water in the gut makes the southern turn unsafe except at slack.", look: "Totten Inlet opens south beyond the bend." },
      e: { to: "pickering_passage", steps: 1, requiresTide: "slack", blockedText: "Strong current races through Hammersley; wait for slack water.", look: "Pickering Passage lies east past the narrow point." }
    },
    scenery: {
      banks: "Close-set earthen banks shadowed by overhanging firs.",
      bars: "Submerged gravel bars marked by smooth ripples.",
      water: "Fast, dark tidal water swirling around tree roots."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "strong", shelter: true, shoals: true },
    tide_variants: {
      slack: "Briefly quiet between turns of the tide.",
      flood: "A hard flood races west through the narrow bends.",
      ebb: "The ebb pours east in smooth, fast tongues."
    },
    original_name: "",
    tribal_note: ""
  },

  squaxin_passage: {
    id: "squaxin_passage",
    name: "Squaxin Passage",
    region: "South Sound",
    description: "A sheltered channel running between a long wooded island and the mainland shore. Kelp beds fringe the gravel points, and the wind drops behind the tall timber.",
    exits: {
      s: { to: "eld_inlet", steps: 1, look: "Eld Inlet opens south." },
      w: { to: "totten_inlet", steps: 1, look: "Totten Inlet bends west." },
      e: { to: "hope_island", steps: 1, look: "Low wooded Hope Island lies east." },
      n: { to: "pickering_passage", steps: 1, look: "Pickering Passage continues north." }
    },
    scenery: {
      island: "A densely wooded island rising above gravel beaches.",
      kelp: "Olive bull-kelp beds leaning with the tidal drift.",
      points: "Cobble points piled with weathered driftwood.",
      timber: "Tall firs and cedars blocking the breeze."
    },
    objects: [],
    hazard: { exposure: 0, tidal: true, currentStrength: "light", shelter: true },
    tide_variants: {
      slack: "Quiet enough to hear crows across the channel.",
      flood: "A gentle drift moves south along the kelp.",
      ebb: "Falling water pulls steadily north past the points."
    },
    original_name: "",
    tribal_note: ""
  },

  hope_island: {
    id: "hope_island",
    name: "Hope Island",
    region: "South Sound",
    description: "A small, uninhabited wooded island ringed with cobble beaches, tide pools, and red-barked madronas. No cabins stand here; only salt wind and the rattle of beach stones.",
    exits: {
      w: { to: "squaxin_passage", steps: 1, look: "Squaxin Passage lies west." },
      e: { to: "dana_passage", steps: 1, look: "Dana Passage runs east between steep bluffs." },
      nw: { to: "pickering_passage", steps: 1, look: "Pickering Passage opens northwest." }
    },
    scenery: {
      beach: "Smooth gray cobbles and bleached cedar logs.",
      beaches: "Smooth gray cobbles and bleached cedar logs.",
      madronas: "Twisted red-barked madronas leaning over the salt water.",
      "tide pools": "Clear pockets of water holding anemones and small shore crabs.",
      stones: "Round cobbles rattling softly in the wash."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Clear water laps the beach stones.",
      flood: "Rising water climbs the gravel spit.",
      ebb: "Tide pools and wet shells appear along the low spit."
    },
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
      bluffs: "Steep sandy bluffs topped with wind-bent firs.",
      kelp: "Long fronds streaming taut in the channel run.",
      seams: "Lines of foam and drifting bark where currents meet.",
      water: "Deep green water moving briskly between the points."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "The passage rests briefly, kelp floating loose.",
      flood: "A brisk flood pushes south through the bend.",
      ebb: "The ebb draws long foam lines north and east."
    },
    original_name: "",
    tribal_note: ""
  },

  pickering_passage: {
    id: "pickering_passage",
    name: "Pickering Passage",
    region: "South Sound",
    description: "A winding wooded corridor between Hartstene Island and the western mainland. Quiet coves indent the shore, and woodpeckers drum in the cedars.",
    exits: {
      w: { to: "hammersley_inlet", steps: 1, requiresTide: "slack", blockedText: "Hammersley Inlet is boiling with tide; wait for slack water.", look: "The tight mouth of Hammersley Inlet lies west." },
      s: { to: "squaxin_passage", steps: 1, look: "Squaxin Passage lies south." },
      se: { to: "hope_island", steps: 1, look: "Hope Island sits southeast." },
      e: { to: "case_inlet", steps: 1, look: "Case Inlet opens east around the northern point." }
    },
    scenery: {
      island: "Timbered slopes of Hartstene Island rising to the east.",
      coves: "Shallow gravel coves sheltered from the wind.",
      cedars: "Old cedars overhanging the damp bank."
    },
    objects: [],
    hazard: { exposure: 0, tidal: true, currentStrength: "light", shelter: true },
    tide_variants: {
      slack: "Flat water reflects both wooded banks.",
      flood: "Steady flood drifts southward down the corridor.",
      ebb: "Ebb current pulls gently northward."
    },
    original_name: "",
    tribal_note: ""
  },

  case_inlet: {
    id: "case_inlet",
    name: "Case Inlet",
    region: "South Sound",
    description: "A long, wide reach stretching north into timbered hills. Gravel spits and empty beaches run for miles under quiet skies.",
    exits: {
      s: { to: "dana_passage", steps: 2, look: "Dana Passage lies south." },
      w: { to: "pickering_passage", steps: 1, look: "Pickering Passage opens west." },
      e: { to: "carr_inlet", steps: 2, look: "Carr Inlet lies east around the peninsula." }
    },
    scenery: {
      hills: "Unbroken evergreen hills receding northward.",
      spits: "Long gravel points jutting into the inlet.",
      beaches: "Empty cobble beaches littered with driftwood."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water stretches far north.",
      flood: "Rising water covers the lower gravel spits.",
      ebb: "Wide gravel bars show along the coves."
    },
    original_name: "",
    tribal_note: ""
  },

  carr_inlet: {
    id: "carr_inlet",
    name: "Carr Inlet",
    region: "South Sound",
    description: "A broad basin bordered by wooded islands and steep bluffs. To the east, the hills pinch toward the mouth of the Narrows.",
    exits: {
      w: { to: "case_inlet", steps: 2, look: "Case Inlet lies west." },
      s: { to: "anderson_island", steps: 1, look: "Anderson Island rises just south." },
      e: { to: "tacoma_narrows", steps: 2, requiresTide: "slack", blockedText: "The tide roars through Tacoma Narrows; wait for slack water.", look: "Steep opposing hills mark Tacoma Narrows to the east." }
    },
    scenery: {
      islands: "Low forested islands—McNeil and Fox—resting in the basin.",
      bluffs: "Sandy glacial bluffs streaked with runoff.",
      hills: "Dark ridges closing in toward the Narrows."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "The broad basin lies quiet.",
      flood: "Current streams in from the Narrows, forming smooth tide rips.",
      ebb: "Water draws steadily east toward the Narrows."
    },
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
      e: { to: "fort_nisqually", steps: 1, look: "The Hudson's Bay landing below Fort Nisqually lies east." }
    },
    scenery: {
      marsh: "Wide beds of salt grass swaying above braided river channels.",
      mudflats: "Miles of glistening tidal silt where the river meets the Sound.",
      delta: "Flat driftwood-strewn flats far too shallow for a keel.",
      mountain: "Mount Rainier's snow peak towering above the eastern forest."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: false, shoals: true },
    tide_variants: {
      slack: "Long gentle swells roll off the delta.",
      flood: "Salt water spreads quietly over the marsh flats.",
      ebb: "Silty river water fans out across the reach."
    },
    original_name: "",
    tribal_note: ""
  },

  fort_nisqually: {
    id: "fort_nisqually",
    name: "Fort Nisqually Landing (HBC)",
    region: "South Sound",
    description: "The beach landing below the Hudson's Bay Company post. A steep wagon track climbs the bluff toward the palisade and storehouses. Company men and Native traders load wool, hides, and blankets near a timber warehouse.",
    exits: {
      w: { to: "nisqually_reach", steps: 1, look: "Nisqually Reach opens west." },
      n: { to: "steilacoom", steps: 1, look: "The newly founded claim at Steilacoom lies north along the shore." }
    },
    scenery: {
      track: "A rutted wagon road cut up the steep clay bluff.",
      bluff: "High timbered bluff hiding the fort's palisade above.",
      warehouse: "A stout squared-timber Company storehouse above high water.",
      traders: "Native families and Company clerks weighing pelts and Hudson's Bay blankets; an older traveler warns you that shellfish taken in warm months have sickened people before."
    },
    objects: ["hbc_clerk"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water along the Company beach.",
      flood: "High water reaches the base of the timber skidway.",
      ebb: "Wide gravel beach makes landing easy."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify exact 1850 beach warehouse / Sequalitchew Creek landing details at Fort Nisqually."
  },

  anderson_island: {
    id: "anderson_island",
    name: "Anderson Island",
    region: "South Sound",
    description: "Wooded bluffs above quiet gravel coves. Clear water laps the stones, and the mainland shore stands across a narrow eastern passage.",
    exits: {
      s: { to: "nisqually_reach", steps: 1, look: "Nisqually Reach opens south." },
      n: { to: "carr_inlet", steps: 1, look: "Carr Inlet widens north." },
      e: { to: "ketron_balch", steps: 1, look: "Balch Passage and Ketron Island lie east." }
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
    original_name: "",
    tribal_note: ""
  },

  ketron_balch: {
    id: "ketron_balch",
    name: "Ketron & Balch Passage",
    region: "South Sound",
    description: "A brisk channel threading between Anderson Island, Ketron Island, and the mainland shore. Kelp bends under the run, and the steep throat of Tacoma Narrows looms north.",
    exits: {
      w: { to: "anderson_island", steps: 1, look: "Anderson Island lies west." },
      e: { to: "steilacoom", steps: 1, look: "Steilacoom's beach and new cabins lie east." },
      n: { to: "tacoma_narrows", steps: 2, requiresTide: "slack", blockedText: "Tacoma Narrows is boiling with current; wait for slack water.", look: "The steep walls of Tacoma Narrows rise north." }
    },
    scenery: {
      island: "Steep, wooded Ketron Island splitting the channel.",
      kelp: "Bull kelp pulled flat beneath the surface.",
      water: "Cold, swirling water funneled from the Narrows."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The passage eases to a slow drift.",
      flood: "Flood water pours south out of the Narrows.",
      ebb: "Ebb current pulls hard north toward the Narrows."
    },
    original_name: "",
    tribal_note: ""
  },

  steilacoom: {
    id: "steilacoom",
    name: "Steilacoom",
    region: "South Sound",
    description: "A newly settled shore of fresh-cut stumps, a couple of rough cabins, and a small army post on the prairie above. A wooden wharf is barely begun along the gravel beach.",
    exits: {
      s: { to: "fort_nisqually", steps: 1, look: "Fort Nisqually's landing lies south along the bluff." },
      w: { to: "ketron_balch", steps: 1, look: "Ketron Island and Balch Passage lie west." }
    },
    scenery: {
      cabins: "New claim cabins built by Lafayette Balch and early settlers.",
      wharf: "Half-finished pilings and stacked timbers on the beach.",
      stumps: "Raw fir stumps smelling of pitch.",
      prairie: "Open gravelly prairie glimpsed above the wooded bank where U.S. soldiers camp."
    },
    objects: [],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Quiet swells roll onto the gravel beach.",
      flood: "Rising tide reaches the stacked wharf timbers.",
      ebb: "Broad cobble beach opens below the cabins."
    },
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 details of Steilacoom (Balch's 1850 arrival / Fort Steilacoom established 1849)."
  },

  tacoma_narrows: {
    id: "tacoma_narrows",
    name: "Tacoma Narrows",
    region: "South Sound",
    description: "Sheer wooded bluffs squeeze the whole southern Sound into a throat barely a mile wide. Even at slack, cold upwellings and faint seams hint at the weight of water below.",
    exits: {
      s: { to: "ketron_balch", steps: 2, look: "Balch Passage opens south." },
      w: { to: "carr_inlet", steps: 2, look: "Carr Inlet lies southwest." },
      n: { to: "gig_harbor", steps: 1, look: "A narrow spit guards Gig Harbor to the north." },
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
      slack: "For a short span the strait holds still and passable.",
      flood: "Fierce flood races south in spinning whirlpools.",
      ebb: "The ebb boils north with standing waves along the points."
    },
    original_name: "",
    tribal_note: ""
  }
};
