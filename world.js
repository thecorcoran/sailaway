/*
 * world.js — Pure data file for South Sound.
 * Add locations by editing WORLD.locations only.
 *
 * Location schema:
 *   id, name, description,
 *   tideNotes: { slack, flood, ebb },
 *   scenery: { noun: "examine text", ... },        // nouns mentioned in description/tideNotes
 *   exits: {
 *     dir: "target_id"
 *       | { to: "target_id", timeCost?: 1, requiresTide?: "slack", blockedText?: "...", lookText?: "..." }
 *       | { blocked: true, blockedText: "Why you cannot go that way." }
 *   },
 *   objects: [ { id, name, aliases, description, takeable, readable?, openable?, open?, contents?, isBait?, isCrabPot? } ]
 */

const WORLD = {
  start: "boston_harbor_dock",
  startTied: true,
  turnsPerTide: 3,
  turnsPerWeather: 9,
  overnightTurns: 6,

  weatherDescriptions: {
    calm: "Flat water.",
    wind: "Brisk chop.",
    fog: "Low fog."
  },

  fishPool: [
    { name: "flounder", aliases: ["fish", "flounder", "bait"], description: "A flat, speckled starry flounder.", isBait: true },
    { name: "perch", aliases: ["fish", "perch", "bait"], description: "A silver-sided pile perch.", isBait: true },
    { name: "rockfish", aliases: ["fish", "rockfish", "bait"], description: "A small dark-backed rockfish.", isBait: true }
  ],

  crabTemplate: {
    id: "crab",
    name: "Dungeness crab",
    aliases: ["crab", "dungeness"],
    description: "A heavy Dungeness crab, clicking its claws.",
    takeable: true,
    releasable: true
  },

  locations: {
    olympia: {
      id: "olympia",
      name: "Olympia (Head of Budd Inlet)",
      description: "The southern end of Budd Inlet. Low pilings, gravel shoals, and the quiet waterfront of Olympia.",
      tideNotes: {
        slack: "Still, shallow water around the old pilings.",
        flood: "High water laps the concrete seawall.",
        ebb: "Broad mudflats and gull tracks stretch out from the shallows."
      },
      scenery: {
        pilings: "Barnacle-crusted timber pilings blackened by tidewater.",
        shoals: "Gravel and silt shoals where the inlet runs out of depth.",
        waterfront: "Low wooden sheds and quiet docks along the town edge.",
        seawall: "Damp concrete streaked with green algae.",
        mudflats: "Soft dark mud dotted with clam holes and gull prints.",
        gulls: "Gray-backed gulls picking through the exposed flats."
      },
      exits: {
        north: { to: "budd_inlet", timeCost: 1, lookText: "Budd Inlet opens north between wooded banks." },
        south: { blocked: true, blockedText: "The inlet ends here at Olympia's shallows and seawall." },
        east: { blocked: true, blockedText: "Timber docks and town shore block the way east." },
        west: { blocked: true, blockedText: "Mudflats and marsh grass bar passage west." }
      },
      objects: [
        {
          id: "olympia_dock",
          name: "waterfront dock",
          aliases: ["dock", "pier", "cleat"],
          description: "A low public float with rusted mooring rings.",
          takeable: false
        }
      ]
    },

    budd_inlet: {
      id: "budd_inlet",
      name: "Budd Inlet",
      description: "A narrow arm of water running north-south. Wooded banks and gravel beaches close in on both sides.",
      tideNotes: {
        slack: "Gulls sit on the still shallows.",
        flood: "Rising water covers the flats.",
        ebb: "Wide mudflats lie bare along the edges."
      },
      scenery: {
        banks: "Steep clay banks topped with firs and alders.",
        beaches: "Narrow strips of wet gravel and bleached shells.",
        beach: "Narrow strips of wet gravel and bleached shells.",
        shallows: "Clear water barely two feet deep over silt.",
        flats: "Dark exposed flats smelling faintly of kelp and brine.",
        mudflats: "Dark exposed flats smelling faintly of kelp and brine.",
        gulls: "Gulls drifting on the slack water."
      },
      exits: {
        north: { to: "boston_harbor_dock", timeCost: 1, lookText: "The timber pier at Boston Harbor lies ahead to the north." },
        south: { to: "olympia", timeCost: 1, lookText: "The inlet narrows south toward Olympia's waterfront." },
        east: { blocked: true, blockedText: "Wooded banks line the eastern shore." },
        west: { blocked: true, blockedText: "Gravel shore and overhanging firs block the west." }
      },
      objects: [
        {
          id: "driftwood",
          name: "cedar driftwood",
          aliases: ["driftwood", "wood", "branch", "cedar"],
          description: "Pale, smooth cedar at the tideline.",
          takeable: true
        }
      ]
    },

    boston_harbor_dock: {
      id: "boston_harbor_dock",
      name: "Boston Harbor Dock",
      description: "A timber pier at the mouth of Budd Inlet. Your skiff floats by the low float beneath tall firs.",
      tideNotes: {
        slack: "Still water along the pilings.",
        flood: "Water curls south past the pilings.",
        ebb: "Water pulls north, showing wet kelp."
      },
      scenery: {
        pier: "Salt-bleached timber planks supported on tarred pilings.",
        pilings: "Wet pilings furred with barnacles and dark kelp.",
        firs: "Tall Douglas firs crowding the gravel spit behind the dock.",
        kelp: "Olive kelp fronds clinging to the lower pilings.",
        spit: "A low gravel point sheltering the little harbor."
      },
      exits: {
        south: { to: "budd_inlet", timeCost: 1, lookText: "Budd Inlet stretches south between wooded shores." },
        north: { to: "dana_passage", timeCost: 1, lookText: "Open water narrows north into Dana Passage." },
        east: { blocked: true, blockedText: "The gravel spit and fir bank lie immediately east." },
        west: { blocked: true, blockedText: "Shoal water and shoreline brush bar the west." }
      },
      objects: [
        {
          id: "dock",
          name: "timber dock",
          aliases: ["dock", "float", "cleat"],
          description: "Bleached planks and an iron cleat.",
          takeable: false
        },
        {
          id: "notice",
          name: "notice",
          aliases: ["notice", "sign", "board"],
          description: "A faded board nailed to a piling.",
          readable: "Small craft: enter Tacoma Narrows at slack water only.",
          takeable: false
        },
        {
          id: "locker",
          name: "wooden locker",
          aliases: ["locker", "box", "chest"],
          description: "A low cedar gear locker on the float.",
          takeable: false,
          openable: true,
          open: false,
          contents: [
            {
              id: "handline",
              name: "fishing line",
              aliases: ["line", "handline", "fishing line", "hook", "reel"],
              description: "A wooden spool wound with heavy line and a lead jig.",
              takeable: true
            },
            {
              id: "tide_table",
              name: "tide table",
              aliases: ["table", "tide", "pamphlet", "paper"],
              description: "A salt-stained tide booklet.",
              takeable: true
            },
            {
              id: "compass",
              name: "brass compass",
              aliases: ["compass", "brass"],
              description: "A dull brass pocket compass.",
              takeable: true
            }
          ]
        }
      ]
    },

    dana_passage: {
      id: "dana_passage",
      name: "Dana Passage",
      description: "A tight channel between steep wooded bluffs, edged with drifting kelp.",
      tideNotes: {
        slack: "Quiet water along the kelp.",
        flood: "A brisk flood runs through the bend.",
        ebb: "The ebb draws lines of foam down the channel."
      },
      scenery: {
        bluffs: "Steep sandy bluffs holding gnarled firs above the water.",
        kelp: "Long ribbons of kelp streaming along the channel edge.",
        foam: "Thin white seams of tide foam tracing the current.",
        channel: "Deep green water moving between close points."
      },
      exits: {
        south: { to: "boston_harbor_dock", timeCost: 1, lookText: "Boston Harbor Dock lies south at the mouth of Budd Inlet." },
        west: { to: "hope_island", timeCost: 1, lookText: "Low wooded Hope Island sits to the west." },
        north: { to: "anderson_island", timeCost: 2, lookText: "A wider crossing leads north toward Anderson Island." },
        east: { blocked: true, blockedText: "Steep bluffs and shallow cobble shore block the east." }
      },
      objects: [
        {
          id: "buoy",
          name: "channel marker",
          aliases: ["marker", "buoy", "post"],
          description: "A salt-streaked marker leaning in the current.",
          takeable: false
        }
      ]
    },

    hope_island: {
      id: "hope_island",
      name: "Hope Island",
      description: "A low wooded island rimmed with cobble beaches, tide pools, and leaning madronas.",
      tideNotes: {
        slack: "Clear water laps the beach stones.",
        flood: "Water creeps up the cobble beach.",
        ebb: "Tide pools show along the low gravel spit."
      },
      scenery: {
        beach: "Smooth gray cobbles and bleached driftwood logs.",
        beaches: "Smooth gray cobbles and bleached driftwood logs.",
        stones: "Water-worn beach cobbles rattling in small swells.",
        madronas: "Red-barked madronas leaning out over the salt water.",
        "tide pools": "Shallow pockets of clear water holding small anemones and crabs.",
        pools: "Shallow pockets of clear water holding small anemones and crabs.",
        spit: "A tapering gravel spit running out into the shallows."
      },
      exits: {
        east: { to: "dana_passage", timeCost: 1, lookText: "Dana Passage opens east between wooded points." },
        north: { to: "squaxin_passage", timeCost: 1, lookText: "Sheltered Squaxin Passage runs north." },
        south: { blocked: true, blockedText: "Shallow shoals and gravel bars block the south." },
        west: { blocked: true, blockedText: "Dense island timber and cobble beach lie to the west." }
      },
      objects: [
        {
          id: "tin",
          name: "rusted tin",
          aliases: ["tin", "can", "box"],
          description: "A small hinged tin under a fir root.",
          takeable: true,
          openable: true,
          open: false,
          contents: [
            {
              id: "chart",
              name: "folded chart",
              aliases: ["chart", "map", "note"],
              description: "A creased pencil sketch of local channels.",
              readable: "Hope Island: good holding. Squaxin north. Anderson east. Nisqually past Anderson. Slack only in the Narrows.",
              takeable: true
            }
          ]
        }
      ]
    },

    squaxin_passage: {
      id: "squaxin_passage",
      name: "Squaxin Passage",
      description: "Dark, sheltered water between tall firs. Kelp beds fringe the gravel points.",
      tideNotes: {
        slack: "Calm enough to hear branches drip.",
        flood: "A slow drift moves south.",
        ebb: "Falling water pulls past the gravel points."
      },
      scenery: {
        firs: "Dense Douglas firs rising straight from the bank.",
        kelp: "Thick beds of olive kelp floating just off the point.",
        points: "Low gravel points jutting into the dark channel.",
        water: "Deep, shaded water sheltered from most wind."
      },
      exits: {
        south: { to: "hope_island", timeCost: 1, lookText: "Hope Island's wooded ridge lies south." },
        east: { to: "anderson_island", timeCost: 2, lookText: "Open water crosses east toward Anderson Island." },
        north: { blocked: true, blockedText: "Narrowing shoals and private shores discourage going farther north." },
        west: { blocked: true, blockedText: "The wooded shoreline closes off the west." }
      },
      objects: [
        {
          id: "crab_pot",
          name: "crab pot",
          aliases: ["pot", "crab pot", "trap", "float", "buoy"],
          description: "A wire crab pot on a short line tied to a faded orange float.",
          takeable: true,
          openable: true,
          open: false,
          isCrabPot: true,
          baited: false,
          setTurn: null,
          contents: [
            {
              id: "crab_initial",
              name: "Dungeness crab",
              aliases: ["crab", "dungeness"],
              description: "A heavy Dungeness crab, clicking its claws.",
              takeable: true,
              releasable: true
            }
          ]
        },
        {
          id: "heron",
          name: "blue heron",
          aliases: ["heron", "bird"],
          description: "A tall gray heron standing still in the shallows.",
          takeable: false
        }
      ]
    },

    anderson_island: {
      id: "anderson_island",
      name: "Anderson Island",
      description: "Wooded bluffs above gravel coves. North, the Sound pinches into a narrow strait.",
      tideNotes: {
        slack: "The northern strait looks calm.",
        flood: "White water boils off the north point.",
        ebb: "Heavy current streams past the bluff."
      },
      scenery: {
        bluffs: "High sandy bluffs crowned with dark evergreens.",
        coves: "Quiet gravel coves tucked beneath the bluffs.",
        beach: "Coarse gravel and stranded cedar logs.",
        strait: "The narrow throat of Tacoma Narrows rising to the north."
      },
      exits: {
        south: { to: "dana_passage", timeCost: 2, lookText: "A long reach runs south back to Dana Passage." },
        west: { to: "squaxin_passage", timeCost: 2, lookText: "Squaxin Passage lies west across the channel." },
        east: { to: "nisqually_reach", timeCost: 2, lookText: "Wide open water stretches east into Nisqually Reach." },
        north: {
          to: "tacoma_narrows",
          timeCost: 2,
          requiresTide: "slack",
          lookText: "Steep hills pinch the water north into Tacoma Narrows.",
          blockedText: "The tide roars through Tacoma Narrows. Wait for slack water."
        }
      },
      objects: [
        {
          id: "cairn",
          name: "stone cairn",
          aliases: ["cairn", "stones", "pile", "rocks"],
          description: "Beach cobbles stacked above the wrack line.",
          takeable: false
        }
      ]
    },

    nisqually_reach: {
      id: "nisqually_reach",
      name: "Nisqually Reach",
      description: "Broad open water facing the low mudflats and marsh grass of the Nisqually delta. Distant bluffs rise to the east.",
      tideNotes: {
        slack: "Long calm swells roll across the wide reach.",
        flood: "Incoming water spreads quietly over the delta flats.",
        ebb: "Shallow brown water drains off the marsh, leaving miles of glistening mudflats."
      },
      scenery: {
        mudflats: "Vast tidal flats where the river meets the Sound.",
        marsh: "Low salt-marsh grass bending in the breeze.",
        delta: "Flat braided channels disappearing into marsh and driftwood.",
        bluffs: "Distant wooded bluffs along the mainland shore."
      },
      exits: {
        west: { to: "anderson_island", timeCost: 2, lookText: "Anderson Island's wooded bluffs rise to the west." },
        north: { blocked: true, blockedText: "Exposed shoals and cross-currents guard the mainland point to the north." },
        south: { blocked: true, blockedText: "The Nisqually delta flats are far too shallow to sail south." },
        east: { blocked: true, blockedText: "Mainland bluffs and shallow gravel bars block the east." }
      },
      objects: [
        {
          id: "seal",
          name: "harbor seal",
          aliases: ["seal", "head"],
          description: "A dark spotted seal bobbing a boat-length away, watching you.",
          takeable: false
        }
      ]
    },

    tacoma_narrows: {
      id: "tacoma_narrows",
      name: "Tacoma Narrows",
      description: "Steep wooded walls squeeze the Sound to a narrow throat. Bull kelp streams beneath the surface.",
      tideNotes: {
        slack: "The strait holds still for a brief span.",
        flood: "Whirlpools spin along the walls.",
        ebb: "Confused boils tug at the rudder."
      },
      scenery: {
        walls: "High wooded cliffs dropping straight into deep water.",
        kelp: "Long olive bull-kelp fronds pulled tight by the current.",
        whirlpools: "Slick swirling depressions opening and closing along the tide seam.",
        water: "Deep, cold green water moving with quiet weight."
      },
      exits: {
        south: { to: "anderson_island", timeCost: 2, lookText: "The strait widens south toward Anderson Island." },
        north: { blocked: true, blockedText: "The main basin opens north beyond your chart." },
        east: { blocked: true, blockedText: "Sheer wooded walls rise immediately east." },
        west: { blocked: true, blockedText: "Steep bluffs wall in the western shore." }
      },
      objects: [
        {
          id: "kelp",
          name: "bull kelp",
          aliases: ["kelp", "seaweed", "bed"],
          description: "Long olive fronds streaming in the current.",
          takeable: false
        }
      ]
    }
  }
};
