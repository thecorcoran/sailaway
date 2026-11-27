// world_canada.js — Strait of Georgia & British Waters North (1850, Vancouver Island / New Caledonia coast)
window.WORLD_REGIONS = window.WORLD_REGIONS || {};

window.WORLD_REGIONS.canada = {
  fort_victoria: {
    id: "fort_victoria",
    name: "Fort Victoria (HBC)",
    region: "Strait of Georgia",
    description: "The Hudson's Bay Company's new western headquarters on Vancouver Island, squared cedar palisades and bastions rising above a winding inner harbor. Company brigs anchor off the wharf, and Coast Salish canoes trade fish and furs along the beach.",
    exits: {
      ne: { to: "haro_strait", steps: 2, look: "Haro Strait lies northeast." },
      n: { to: "gulf_islands", steps: 2, look: "The Gulf Islands shelter the route north." }
    },
    scenery: {
      palisades: "Stout cedar pickets and corner bastions flying the HBC ensign.",
      wharf: "Heavy timber wharf piled with barrels, blankets, and sawn lumber.",
      brigs: "Company supply vessels riding at anchor in the harbor.",
      canoes: "Local Coast Salish canoes coming and going along the shore."
    },
    objects: ["hbc_factor"],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water inside the harbor narrows.",
      flood: "Flood drifts gently past the wharf.",
      ebb: "Ebb pulls out toward the Strait of Juan de Fuca."
    },
    hasShore: true,
    isFort: true,
    milestone: "Reached Fort Victoria, headquarters of the Hudson's Bay Company.",
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 Fort Victoria colony status (Colony of Vancouver Island chartered 1849; Blanshard arrived March 1850)."
  },

  gulf_islands: {
    id: "gulf_islands",
    name: "Gulf Islands",
    region: "Strait of Georgia",
    description: "A maze of sun-warmed sandstone islands, twisted arbutus trees, and sheltered passages along Vancouver Island's inner coast. Calm coves offer refuge from Strait of Georgia squalls.",
    exits: {
      se: { to: "haro_strait", steps: 2, look: "Haro Strait opens southeast." },
      s: { to: "fort_victoria", steps: 2, look: "Fort Victoria lies south." },
      nw: { to: "dodd_narrows", steps: 2, requiresTide: "slack", blockedText: "Dodd Narrows is roaring with current; wait for slack water.", look: "The tight rocky cleft of Dodd Narrows lies northwest." }
    },
    scenery: {
      sandstone: "Wave-carved honeycombed sandstone ledges.",
      arbutus: "Peeling red-barked arbutus trees leaning over clear coves.",
      coves: "Snug gravel pockets tucked between rocky islets."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: true },
    tide_variants: {
      slack: "Clear, quiet water among the sandstone ledges.",
      flood: "Flood streams north between the islands.",
      ebb: "Ebb draws south toward Haro Strait."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  dodd_narrows: {
    id: "dodd_narrows",
    name: "Dodd Narrows",
    region: "Strait of Georgia",
    description: "A rocky gap scarcely fifty yards wide where the tide pours through like a river chute. Steep boulders and kelp beds crowd both banks.",
    exits: {
      se: { to: "gulf_islands", steps: 2, look: "The Gulf Islands open southeast." },
      n: { to: "nanaimo", steps: 1, look: "Nanaimo's broad bay opens immediately north." }
    },
    scenery: {
      boulders: "Barnacle-crusted rocks narrowing the channel.",
      kelp: "Long kelp fronds pinned flat underwater.",
      water: "Boils and eddies twisting through the rocky gap."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "Briefly quiet—your only safe window to pass.",
      flood: "Fierce flood roars north through the gap.",
      ebb: "Standing waves boil south out of the bay."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  nanaimo: {
    id: "nanaimo",
    name: "Nanaimo",
    region: "Strait of Georgia",
    description: "A wide bay backed by dark timber and exposed coal seams along the shoreline. Coast Salish villages line the sheltered water; in 1850 the Hudson's Bay Company has only just heard of the coal here and no fort stands yet.",
    exits: {
      s: { to: "dodd_narrows", steps: 1, requiresTide: "slack", blockedText: "Dodd Narrows is running too hard; wait for slack water.", look: "Dodd Narrows lies south." },
      n: { to: "desolation_sound", steps: 4, look: "The broad Strait of Georgia stretches north toward Desolation Sound." }
    },
    scenery: {
      seams: "Dark seams of surface coal breaking through coastal sandstone.",
      villages: "Coast Salish cedar houses along the protected bay.",
      timber: "Heavy fir forest rising behind the shore."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Quiet water inside the bay islands.",
      flood: "Gentle flood creeps across the flats.",
      ebb: "Ebb pulls out into the wide Strait of Georgia."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 status of Nanaimo (coal reported to HBC ~1849-50; Fort Nanaimo built 1852)."
  },

  desolation_sound: {
    id: "desolation_sound",
    name: "Desolation Sound",
    region: "British Waters North",
    description: "Deep fjord-like water enclosed by steep granite peaks and waterfalls at the north end of the Strait of Georgia. Ahead lie the notorious tidal rapids leading into Johnstone Strait.",
    exits: {
      s: { to: "nanaimo", steps: 4, look: "The wide Strait of Georgia stretches south toward Nanaimo." },
      n: { to: "yuculta_rapids", steps: 2, requiresTide: "slack", blockedText: "Yuculta, Gillard, and Dent Rapids are impassable except at slack.", look: "Narrow island passages lead north into Yuculta, Gillard, and Dent Rapids." },
      w: { to: "seymour_narrows", steps: 2, requiresTide: "slack", blockedText: "Seymour Narrows is a violent whirlpool; wait for slack water.", look: "Discovery Passage leads west toward Seymour Narrows." }
    },
    scenery: {
      peaks: "Steep snow-streaked coastal mountains rising from dark water.",
      waterfalls: "Thin white creeks plunging down sheer granite faces.",
      granite: "Smooth glacially scoured rock ledges."
    },
    objects: ["fresh_spring"],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: true },
    tide_variants: {
      slack: "Mirror-still water beneath the peaks.",
      flood: "Tides converge here from north and south.",
      ebb: "Water draws briskly toward the northern passes."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  yuculta_rapids: {
    id: "yuculta_rapids",
    name: "Yuculta, Gillard & Dent Rapids",
    region: "British Waters North",
    description: "A gauntlet of narrow island channels where the tide meets over submerged rock ledges. Huge whirlpools and overfalls roar through the narrows except during brief slack water.",
    exits: {
      s: { to: "desolation_sound", steps: 2, requiresTide: "slack", blockedText: "The rapids are running violently; wait for slack.", look: "Desolation Sound opens south." },
      w: { to: "johnstone_strait", steps: 2, requiresTide: "slack", blockedText: "Gillard and Dent Rapids bar passage west except at slack.", look: "Cordero Channel leads west into Johnstone Strait." }
    },
    scenery: {
      whirlpools: "Wide spinning funnels opening in the dark green water.",
      ledges: "Kelp-draped rock ledges just below the surface.",
      water: "Roaring tidal races crashing between granite islets."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "A brief, eerie hush settles over the rapids.",
      flood: "Violent flood boils northward.",
      ebb: "Fierce ebb cascades south with standing waves."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  seymour_narrows: {
    id: "seymour_narrows",
    name: "Seymour Narrows",
    region: "British Waters North",
    description: "A narrow rocky throat in Discovery Passage where a submerged pinnacle—Ripple Rock—turns the tide into a boiling cauldron. Even large ships wait for slack water here.",
    exits: {
      e: { to: "desolation_sound", steps: 2, look: "Discovery Passage opens east toward Desolation Sound." },
      nw: { to: "johnstone_strait", steps: 2, look: "Long, steep-walled Johnstone Strait stretches northwest." }
    },
    scenery: {
      rock: "Submerged Ripple Rock betrayed by violent upwellings.",
      cliffs: "Steep timbered walls squeezing the channel.",
      water: "Massive boils and whirlpools surging past the shore."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "fierce", shelter: false },
    tide_variants: {
      slack: "The cauldron flattens for a short slack window.",
      flood: "Up to twelve knots of flood race south.",
      ebb: "Fierce ebb pours north with explosive boils."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  johnstone_strait: {
    id: "johnstone_strait",
    name: "Johnstone Strait",
    region: "British Waters North",
    description: "A long, steep-walled corridor between Vancouver Island and the mainland mountains. Afternoon westerlies funnel straight down the slot, piling steep chop against the ebb. Kwakwaka'wakw villages sit in sheltered bays along the route.",
    exits: {
      e: { to: "yuculta_rapids", steps: 2, requiresTide: "slack", blockedText: "Yuculta Rapids are roaring; wait for slack water.", look: "The rapids route lies east." },
      se: { to: "seymour_narrows", steps: 2, requiresTide: "slack", blockedText: "Seymour Narrows is impassable except at slack.", look: "Seymour Narrows lies southeast." },
      nw: { to: "fort_rupert", steps: 4, look: "The long strait runs northwest toward Fort Rupert." }
    },
    scenery: {
      mountains: "Dark timbered mountains rising straight from deep water.",
      villages: "Kwakwaka'wakw cedar plank houses in sheltered coves; canoes cross on their own errands.",
      water: "Deep, cold, wind-funneled strait water."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "The long corridor quiets between tides.",
      flood: "Flood drives southeast down the strait.",
      ebb: "Ebb pushes northwest, kicking up sharp chop in west wind."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify Kwakwaka'wakw regional boundaries along Johnstone Strait."
  },

  fort_rupert: {
    id: "fort_rupert",
    name: "Fort Rupert (HBC)",
    region: "British Waters North",
    description: "A newly built Hudson's Bay Company palisade on Beaver Harbour, erected in 1849 near coastal coal outcrops. Large Kwakwaka'wakw plank houses line the beach beside the fort, and trade is brisk and watchful.",
    exits: {
      se: { to: "johnstone_strait", steps: 4, look: "Johnstone Strait stretches southeast." },
      n: { to: "queen_charlotte_strait", steps: 2, look: "Queen Charlotte Strait opens north toward the Pacific swell." }
    },
    scenery: {
      palisade: "Freshly squared cedar walls and bastions of the new 1849 fort.",
      houses: "Monumental Kwakwaka'wakw cedar plank houses lining the gravel beach.",
      coal: "Wet black coal outcrops along the shore."
    },
    objects: ["hbc_factor"],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water in Beaver Harbour.",
      flood: "Rising tide covers the broad gravel beach.",
      ebb: "Low water exposes wide kelp beds."
    },
    hasShore: true,
    hasCamp: true,
    isFort: true,
    milestone: "Reached Fort Rupert at the north end of Vancouver Island.",
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 Fort Rupert details (built 1849; coal mining disputes 1850)."
  },

  queen_charlotte_strait: {
    id: "queen_charlotte_strait",
    name: "Queen Charlotte Strait",
    region: "British Waters North",
    description: "The protected inside waters widen here, admitting the first long ocean groundswell from the Pacific. Low rocky islands and reefs border the mainland shore.",
    exits: {
      s: { to: "fort_rupert", steps: 2, look: "Fort Rupert lies south on Vancouver Island." },
      nw: { to: "cape_caution", steps: 3, look: "Exposed Cape Caution looms northwest." }
    },
    scenery: {
      swell: "Long smooth Pacific swell rolling in from the west.",
      reefs: "Foam-ringed islets and submerged ledges."
    },
    objects: [],
    hazard: { exposure: 2, tidal: true, currentStrength: "moderate", shelter: false },
    tide_variants: {
      slack: "Long swells roll steadily across the strait.",
      flood: "Ocean flood sweeps southeast.",
      ebb: "Ebb pulls northwest toward Cape Caution."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  cape_caution: {
    id: "cape_caution",
    name: "Cape Caution",
    region: "British Waters North",
    description: "A low, granite-ribbed promontory named by George Vancouver for its hidden reefs and breaking Pacific swell. There is no shelter here—only open ocean to the west and Queen Charlotte Sound ahead.",
    exits: {
      se: { to: "queen_charlotte_strait", steps: 3, look: "Queen Charlotte Strait lies southeast." },
      n: { to: "queen_charlotte_sound", steps: 3, look: "Open, exposed Queen Charlotte Sound stretches north." }
    },
    scenery: {
      promontory: "Wave-washed granite ledges whitened with surf.",
      reefs: "Hidden rocks boiling with white water half a mile offshore.",
      water: "Heavy Pacific groundswell breaking over shallows."
    },
    objects: [],
    hazard: { exposure: 3, tidal: true, currentStrength: "strong", shelter: false },
    tide_variants: {
      slack: "Heavy swell still breaks across the outer rocks.",
      flood: "Flood piles swell along the granite shore.",
      ebb: "Ebb meets ocean swell in steep cross-seas."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  queen_charlotte_sound: {
    id: "queen_charlotte_sound",
    name: "Queen Charlotte Sound",
    region: "British Waters North",
    description: "Forty miles of open water completely exposed to the North Pacific. No island chain blocks the western horizon; fog, gales, and long gray swells test every seam in your boat.",
    exits: {
      s: { to: "cape_caution", steps: 3, look: "Cape Caution lies south." },
      n: { to: "fitz_hugh_sound", steps: 3, look: "The sheltered mouth of Fitz Hugh Sound opens north." }
    },
    scenery: {
      horizon: "Empty gray Pacific horizon to the west.",
      swell: "Long rolling ocean troughs lifting and dropping the boat."
    },
    objects: [],
    hazard: { exposure: 3, tidal: false, shelter: false },
    tide_variants: {
      slack: "Deep ocean swell rolls endlessly eastward.",
      flood: "Steady swell and wind chop.",
      ebb: "Steep cross-seas whenever west wind freshens."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  fitz_hugh_sound: {
    id: "fitz_hugh_sound",
    name: "Fitz Hugh Sound",
    region: "British Waters North",
    description: "Back inside the shelter of steep forested islands. Rain-soaked cedar mountains rise directly from deep green water, breaking the force of the Pacific swell.",
    exits: {
      s: { to: "queen_charlotte_sound", steps: 3, look: "Exposed Queen Charlotte Sound opens south." },
      n: { to: "bella_bella", steps: 2, look: "Heiltsuk waters and Bella Bella lie north." }
    },
    scenery: {
      mountains: "Moss-draped cedar slopes vanishing into low mist.",
      water: "Deep, dark inside-passage water."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Calm water sheltered from the outer ocean.",
      flood: "Gentle flood drifts north.",
      ebb: "Ebb pulls south toward the open sound."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  bella_bella: {
    id: "bella_bella",
    name: "Bella Bella (Fort McLoughlin Ruins)",
    region: "British Waters North",
    description: "Sheltered Heiltsuk waters in Lama Passage. The old Hudson's Bay Company Fort McLoughlin was abandoned in 1843, leaving weathered timbers, while Heiltsuk villages and canoes remain active along the island shores.",
    exits: {
      s: { to: "fitz_hugh_sound", steps: 2, look: "Fitz Hugh Sound runs south." },
      nw: { to: "princess_royal_channel", steps: 4, look: "Long forested channels lead northwest toward Princess Royal Channel." }
    },
    scenery: {
      ruins: "Overgrown sill logs and stone chimneys of abandoned Fort McLoughlin.",
      villages: "Heiltsuk cedar houses along the sheltered cove; canoes travel the passage.",
      cedars: "Rain-soaked red cedars dripping steadily."
    },
    objects: ["fresh_spring"],
    hazard: { exposure: 0, tidal: false, shelter: true },
    tide_variants: {
      slack: "Still protected water in the passage.",
      flood: "Gentle flood moves north.",
      ebb: "Quiet ebb draws south."
    },
    hasShore: true,
    hasCamp: true,
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 Bella Bella / Heiltsuk settlement details after Fort McLoughlin closed in 1843."
  },

  princess_royal_channel: {
    id: "princess_royal_channel",
    name: "Princess Royal Channel",
    region: "British Waters North",
    description: "A deep, silent canyon of water winding between towering glacier-carved cliffs. Waterfalls spill white threads down sheer granite into dark, sheltered water.",
    exits: {
      se: { to: "bella_bella", steps: 4, look: "Lama Passage and Bella Bella lie southeast." },
      nw: { to: "grenville_channel", steps: 4, look: "Straight, narrow Grenville Channel continues northwest." }
    },
    scenery: {
      cliffs: "Sheer granite walls rising thousands of feet.",
      waterfalls: "Snowmelt streams plunging straight into salt water.",
      water: "Deep, glassy fjord water."
    },
    objects: [],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Dead calm beneath towering walls.",
      flood: "Slight drift northward.",
      ebb: "Gentle southward set."
    },
    hasShore: true,
    original_name: "",
    tribal_note: ""
  },

  grenville_channel: {
    id: "grenville_channel",
    name: "Grenville Channel",
    region: "British Waters North",
    description: "Forty-five miles of arrow-straight, narrow fjord walled by steep spruce and cedar slopes. Anchoring is scarce in the deep water; wind either blows dead ahead or dead astern.",
    exits: {
      se: { to: "princess_royal_channel", steps: 4, look: "Princess Royal Channel lies southeast." },
      nw: { to: "fort_simpson", steps: 3, look: "Chatham Sound and Fort Simpson lie northwest." }
    },
    scenery: {
      slopes: "Steep rain-green mountains rising like canyon walls.",
      water: "Narrow dark channel stretching straight as a ruler."
    },
    objects: [],
    hazard: { exposure: 1, tidal: true, currentStrength: "moderate", shelter: true },
    tide_variants: {
      slack: "Calm ribbon of water between dark hills.",
      flood: "Tide meets near the center of the channel.",
      ebb: "Steady ebb drains toward both ends."
    },
    hasShore: false,
    original_name: "",
    tribal_note: ""
  },

  fort_simpson: {
    id: "fort_simpson",
    name: "Fort Simpson (HBC)",
    region: "British Waters North",
    description: "A major Hudson's Bay Company trading post on the northern Tsimshian peninsula, surrounded by a large, bustling Tsimshian town of cedar plank houses and carved poles. Beyond lies Dixon Entrance and Russian America.",
    exits: {
      se: { to: "grenville_channel", steps: 3, look: "Grenville Channel opens southeast." },
      nw: { to: "dixon_entrance", steps: 3, look: "Exposed Dixon Entrance crosses northwest into Russian America." }
    },
    scenery: {
      fort: "Stout palisaded HBC trading post with storehouses and wharf.",
      town: "Extensive Tsimshian plank-house community; large trade canoes come from the Skeena, Nass, and Haida Gwaii.",
      poles: "Tall carved cedar poles standing before the houses."
    },
    objects: ["hbc_factor"],
    hazard: { exposure: 1, tidal: false, shelter: true },
    tide_variants: {
      slack: "Protected anchorage off the fort beach.",
      flood: "Flood rises briskly along the northern coast.",
      ebb: "Broad tidal flats appear along the shore."
    },
    hasShore: true,
    hasCamp: true,
    isFort: true,
    milestone: "Reached Fort Simpson on the northern Tsimshian coast.",
    original_name: "",
    tribal_note: "",
    verify: "Verify 1850 Fort Simpson (Lax Kw'alaams) Tsimshian/Haida trade details."
  }
};
