/*
 * world.js — Pure world data for the South Puget Sound text adventure.
 *
 * HOW TO ADD A NEW LOCATION:
 * 1. Add a new entry inside WORLD.locations keyed by its unique id.
 * 2. Define: id, name, description, exits, and objects (array).
 * 3. Connect an existing location's `exits` to your new id (and back again).
 *
 * Exit format:
 *   north: "target_id"
 *   north: { to: "target_id", requiresTide: "slack", blockedText: "Reason..." }
 *
 * Object format:
 *   {
 *     id: "unique_id",
 *     name: "display name",
 *     aliases: ["word1", "word2"],
 *     description: "Plain concrete description.",
 *     takeable: true | false,
 *     readable: "Optional text shown on 'read'.",
 *     openable: true | false,
 *     open: false,
 *     contents: [ ...nested object definitions... ]
 *   }
 */

const WORLD = {
  start: "boston_harbor_dock",
  startTied: true,

  weatherDescriptions: {
    calm: "The water lies flat, reflecting the dark firs along the shore.",
    wind: "A steady breeze pushes short gray chop across the water.",
    fog: "Low fog hangs over the water, softening the distant tree line."
  },

  locations: {
    boston_harbor_dock: {
      id: "boston_harbor_dock",
      name: "Boston Harbor Dock",
      description:
        "A weathered timber pier extends from a gravel spit at the mouth of Budd Inlet. Your small wooden sailboat floats beside the low float. Dark conifers crowd the bank behind the point.",
      tideNotes: {
        slack: "The water beside the pilings is nearly still.",
        flood: "Incoming water curls quietly past the barnacled pilings toward the inlet.",
        ebb: "Outflowing water tugs steadily north along the float, exposing wet kelp on the pilings."
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
          description: "Salt-bleached planks and a heavy iron cleat bolted to the stringer.",
          takeable: false
        },
        {
          id: "notice",
          name: "weathered notice",
          aliases: ["notice", "sign", "board"],
          description: "A faded wooden board nailed to a piling near the ramp.",
          readable: "Notice to small craft: Watch the tide in Dana Passage and Tacoma Narrows. Wait for slack water before entering the Narrows.",
          takeable: false
        },
        {
          id: "locker",
          name: "wooden locker",
          aliases: ["locker", "box", "chest"],
          description: "A low cedar gear locker sitting at the end of the float.",
          takeable: false,
          openable: true,
          open: false,
          contents: [
            {
              id: "tide_table",
              name: "tide table",
              aliases: ["table", "tide", "pamphlet", "paper"],
              description: "A damp folded booklet stained with salt and pencil marks.",
              readable: "South Sound Tides: The current turns in order — slack, flood, ebb, and back to slack. Wait if the narrows run too hard.",
              takeable: true
            },
            {
              id: "compass",
              name: "brass compass",
              aliases: ["compass", "brass"],
              description: "A pocket compass in a dull brass case. The needle settles steadily toward north.",
              takeable: true
            }
          ]
        }
      ]
    },

    budd_inlet: {
      id: "budd_inlet",
      name: "Budd Inlet",
      description:
        "A narrow arm of water running south toward Olympia. Low wooded banks close in on both sides, and the water grows shallow toward the head of the inlet.",
      tideNotes: {
        slack: "Gulls rest on the flat water near the shoals.",
        flood: "The rising tide covers the mudflats, bringing the waterline up to the gravel banks.",
        ebb: "Wide mudflats and wet eelgrass lie exposed along the southern shallows."
      },
      exits: {
        north: "boston_harbor_dock"
      },
      objects: [
        {
          id: "driftwood",
          name: "cedar driftwood",
          aliases: ["driftwood", "wood", "branch", "cedar"],
          description: "A pale, water-smoothed piece of cedar resting at the edge of the tide.",
          takeable: true
        }
      ]
    },

    dana_passage: {
      id: "dana_passage",
      name: "Dana Passage",
      description:
        "A constricted reach of water bordered by steep wooded bluffs. The channel bends between points where currents gather speed.",
      tideNotes: {
        slack: "The passage lies quiet, with only faint swirls along the kelp beds.",
        flood: "A brisk flood current pushes through the channel in smooth, glassy tongues.",
        ebb: "The ebb draws lines of foam and drifting kelp along the center of the passage."
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
          description: "A salt-streaked channel marker leaning slightly against the current.",
          takeable: false
        }
      ]
    },

    hope_island: {
      id: "hope_island",
      name: "Hope Island",
      description:
        "A low, heavily wooded island ringed with cobble beaches and leaning madronas. No buildings show through the trees; only crows call from the ridge.",
      tideNotes: {
        slack: "Clear water laps gently against the smooth beach stones.",
        flood: "The tide creeps up the gravel beach toward the line of stranded logs.",
        ebb: "Tide pools and clusters of small shells appear along the low gravel spit."
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
          description: "A small hinged tin wedged beneath a mossy fir root above the high-tide line.",
          takeable: true,
          openable: true,
          open: false,
          contents: [
            {
              id: "chart",
              name: "folded chart",
              aliases: ["chart", "map", "note"],
              description: "A creased pencil sketch of the local passages.",
              readable: "Pencil notes in a neat hand: 'Hope Island — good holding ground. Squaxin Passage north. Anderson Island east. Do not push the Narrows against the run.'",
              takeable: true
            }
          ]
        }
      ]
    },

    squaxin_passage: {
      id: "squaxin_passage",
      name: "Squaxin Passage",
      description:
        "A sheltered stretch of water lying between wooded shorelines. The water runs darker here beneath tall firs, and the wind often drops behind the trees.",
      tideNotes: {
        slack: "The passage is calm enough to hear water dripping from shoreline branches.",
        flood: "A steady drift carries small bits of bark southward along the channel.",
        ebb: "The falling tide pulls quietly past the gravel points."
      },
      exits: {
        south: "hope_island",
        east: "anderson_island"
      },
      objects: [
        {
          id: "heron",
          name: "great blue heron",
          aliases: ["heron", "bird"],
          description: "A tall gray heron standing motionless in the shallows, watching the water.",
          takeable: false
        }
      ]
    },

    anderson_island: {
      id: "anderson_island",
      name: "Anderson Island",
      description:
        "High wooded bluffs rise above quiet gravel coves on the southern shore of the island. To the north, the Sound narrows between steep opposing hills.",
      tideNotes: {
        slack: "The water off the cove is calm, and the northern strait looks passable.",
        flood: "A strong tide line forms off the northern point; white water boils in the distance.",
        ebb: "Heavy current streams past the northern bluff, dragging eddies out into the reach."
      },
      exits: {
        south: "dana_passage",
        west: "squaxin_passage",
        north: {
          to: "tacoma_narrows",
          requiresTide: "slack",
          blockedText:
            "The tide is running hard through Tacoma Narrows. Boiling eddies and standing waves bar the strait; it is not safe to enter except at slack water."
        }
      },
      objects: [
        {
          id: "cairn",
          name: "stone cairn",
          aliases: ["cairn", "stones", "pile", "rocks"],
          description: "A neat stack of beach cobbles built just above the wrack line.",
          takeable: false
        }
      ]
    },

    tacoma_narrows: {
      id: "tacoma_narrows",
      name: "Tacoma Narrows",
      description:
        "Steep, wooded walls squeeze Puget Sound into a narrow throat barely a mile wide. Even at slack water, faint seams and cold upwellings hint at the volume of water moving beneath your keel.",
      tideNotes: {
        slack: "For a brief interval the strait holds still, wide and deep beneath the bluffs.",
        flood: "The flood is building again, spinning slick whirlpools along the walls.",
        ebb: "The ebb tugs hard at the rudder, pulling south and north in confused boils."
      },
      exits: {
        south: "anderson_island"
      },
      objects: [
        {
          id: "kelp",
          name: "bull kelp",
          aliases: ["kelp", "seaweed", "bed"],
          description: "Long olive-brown fronds anchored deep below, streaming in the current.",
          takeable: false
        }
      ]
    }
  }
};
