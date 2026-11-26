/*
 * world.js — Pure world data for the South Puget Sound text adventure.
 *
 * Add new locations by adding entries to WORLD.locations and linking exits.
 * Exit format:  north: "target_id"
 *           or  north: { to: "target_id", requiresTide: "slack", blockedText: "..." }
 */

const WORLD = {
  start: "boston_harbor_dock",
  startTied: true,

  weatherDescriptions: {
    calm: "Flat water.",
    wind: "Brisk chop.",
    fog: "Low fog."
  },

  locations: {
    boston_harbor_dock: {
      id: "boston_harbor_dock",
      name: "Boston Harbor Dock",
      description: "A timber pier at the mouth of Budd Inlet. Your skiff floats by the low float.",
      tideNotes: {
        slack: "Still water along the pilings.",
        flood: "Water curls south past the pilings.",
        ebb: "Water pulls north, showing wet kelp."
      },
      exits: {
        south: "budd_inlet",
        north: "dana_passage"
      },
      objects: [
        {
          id: "dock",
          name: "timber dock",
          aliases: ["dock", "pier", "float", "cleat", "piling", "pilings"],
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
              description: "A salt-stained booklet.",
              readable: "Tides turn in order: slack, flood, ebb.",
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

    budd_inlet: {
      id: "budd_inlet",
      name: "Budd Inlet",
      description: "A narrow arm of water running south toward Olympia. Wooded banks close in.",
      tideNotes: {
        slack: "Gulls sit on the still shallows.",
        flood: "Rising water covers the flats.",
        ebb: "Wide mudflats lie bare to the south."
      },
      exits: {
        north: "boston_harbor_dock"
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

    dana_passage: {
      id: "dana_passage",
      name: "Dana Passage",
      description: "A tight channel between steep wooded bluffs.",
      tideNotes: {
        slack: "Quiet water along the kelp.",
        flood: "A brisk flood runs through the bend.",
        ebb: "The ebb draws lines of foam down the channel."
      },
      exits: {
        south: "boston_harbor_dock",
        west: "hope_island",
        north: "anderson_island"
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
      description: "A low wooded island rimmed with cobble beaches and madronas.",
      tideNotes: {
        slack: "Clear water laps the stones.",
        flood: "Water creeps up the gravel.",
        ebb: "Tide pools show along the spit."
      },
      exits: {
        east: "dana_passage",
        north: "squaxin_passage"
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
              readable: "Hope Island: good holding. Squaxin north. Anderson east. Wait for slack at the Narrows.",
              takeable: true
            }
          ]
        }
      ]
    },

    squaxin_passage: {
      id: "squaxin_passage",
      name: "Squaxin Passage",
      description: "Dark, sheltered water between tall firs. A faded orange float bobs near the kelp.",
      tideNotes: {
        slack: "Calm enough to hear branches drip.",
        flood: "A slow drift moves south.",
        ebb: "Falling water pulls past the points."
      },
      exits: {
        south: "hope_island",
        east: "anderson_island"
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
          contents: [
            {
              id: "crab",
              name: "Dungeness crab",
              aliases: ["crab", "dungeness"],
              description: "A heavy Dungeness crab, clicking its claws.",
              takeable: true
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
      exits: {
        south: "dana_passage",
        west: "squaxin_passage",
        north: {
          to: "tacoma_narrows",
          requiresTide: "slack",
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

    tacoma_narrows: {
      id: "tacoma_narrows",
      name: "Tacoma Narrows",
      description: "Steep wooded walls squeeze the Sound to a narrow throat.",
      tideNotes: {
        slack: "The strait holds still for a brief span.",
        flood: "Whirlpools spin along the walls.",
        ebb: "Confused boils tug at the rudder."
      },
      exits: {
        south: "anderson_island"
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
