// hazards.js — Tunable risk calculation, warn-first gate, swamping, capsize, and death
window.HAZARD_CONFIG = {
  RISK_SCALE: 1.0,            // Master multiplier for tuning lethality (target: ~1 in 10 to 1 in 20 death on risky legs)
  WARN_THRESHOLD: 4,          // Risk score at or above which sail/row refuses until player confirms ("push on" or repeat)
  WIND_RISK: {
    calm: 0,
    breeze: 1,
    strong: 3,
    gale: 5
  },
  WIND_AGAINST_TIDE: 2,       // Added when wind blows against ebb/flood in tidal water
  REEF_MITIGATION: -2,        // Reefing the lugsail reduces wind risk
  OVERLOAD_WEIGHT: 38,        // Carrying more than this adds +2 risk
  OVERLOAD_PENALTY: 2,
  LOW_HULL_THRESHOLD: 65,     // Hull below 65 adds +2 risk
  FATIGUE_THRESHOLD: 65,      // High fatigue adds +1 risk
  NO_SHELTER_PENALTY: 1,      // Starting or ending away from shelter adds +1
  SHOALS_NO_LEAD_PENALTY: 2,  // Entering shoals without a lead line
  SHELLFISH_POISON_CHANCE: 0.14
};

window.Hazards = {
  totalWeight(inventory) {
    return inventory.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  },

  // Compute detailed risk score and human-readable reasons for a proposed leg
  evaluateLeg(state, fromLoc, toLoc, hasLeadLine) {
    const cfg = window.HAZARD_CONFIG;
    const reasons = [];
    let score = 0;

    // Wind
    let windRisk = cfg.WIND_RISK[state.wind] || 0;
    if (state.reefed && windRisk > 0) {
      windRisk = Math.max(0, windRisk + cfg.REEF_MITIGATION);
      reasons.push(`wind(${state.wind}, reefed)=${windRisk}`);
    } else if (windRisk > 0) {
      reasons.push(`wind(${state.wind})=${windRisk}`);
    }
    score += windRisk;

    // Wind against tide (ebb against west/north wind or strong wind in tidal zone)
    const tidal = Boolean(fromLoc.hazard?.tidal || toLoc.hazard?.tidal);
    const windAgainstTide = tidal && state.tide !== "slack" && (state.wind === "strong" || state.wind === "gale" || (state.wind === "breeze" && state.tide === "ebb"));
    if (windAgainstTide) {
      score += cfg.WIND_AGAINST_TIDE;
      reasons.push(`wind-against-tide=+${cfg.WIND_AGAINST_TIDE}`);
    }

    // Exposure
    const exposure = Math.max(fromLoc.hazard?.exposure || 0, toLoc.hazard?.exposure || 0);
    if (exposure > 0) {
      score += exposure;
      reasons.push(`exposure=+${exposure}`);
    }

    // Away from shelter
    if (!toLoc.hazard?.shelter) {
      score += cfg.NO_SHELTER_PENALTY;
      reasons.push(`no-shelter=+${cfg.NO_SHELTER_PENALTY}`);
    }

    // Shoals without lead line
    if (toLoc.hazard?.shoals && !hasLeadLine && state.tide === "ebb") {
      score += cfg.SHOALS_NO_LEAD_PENALTY;
      reasons.push(`shoals-no-lead=+${cfg.SHOALS_NO_LEAD_PENALTY}`);
    }

    // Boat condition, load, fatigue
    if (state.hull < cfg.LOW_HULL_THRESHOLD) {
      score += 2;
      reasons.push("worn-hull=+2");
    }
    const wt = this.totalWeight(state.inventory);
    if (wt > cfg.OVERLOAD_WEIGHT) {
      score += cfg.OVERLOAD_PENALTY;
      reasons.push(`heavy-load(${wt.toFixed(0)}lb)=+${cfg.OVERLOAD_PENALTY}`);
    }
    if (state.fatigue >= cfg.FATIGUE_THRESHOLD) {
      score += 1;
      reasons.push("fatigue=+1");
    }

    const scaled = Math.max(0, Math.round(score * cfg.RISK_SCALE * 10) / 10);
    return { score: scaled, warn: scaled >= cfg.WARN_THRESHOLD, windAgainstTide, exposure, reasons };
  },

  // Concrete ship's-journal warning shown before a risky leg
  buildWarning(state, toLoc, risk) {
    const bits = [];
    if (state.wind === "gale") bits.push("Slate cloud and gale gusts tear white streaks across the Sound.");
    else if (state.wind === "strong") bits.push("Strong gusts stack steep gray chop across the reach.");
    if (risk.windAgainstTide) bits.push(`The ${state.tide} is running against the wind off the point.`);
    if (toLoc.hazard?.shoals && state.tide === "ebb") bits.push("Low water leaves shallow bars uncharted without a lead line.");
    if (this.totalWeight(state.inventory) > window.HAZARD_CONFIG.OVERLOAD_WEIGHT) bits.push("The skiff sits heavy in the water with your load.");
    if (!state.reefed && (state.wind === "strong" || state.wind === "gale")) bits.push("Your lugsail is still unreefed.");
    if (!bits.length) bits.push(`Exposed water lies ahead toward ${toLoc.name}.`);
    bits.push("Sailing now would be foolish. Type 'push on' or repeat the command to proceed anyway.");
    return bits.join(" ");
  },

  // Resolve outcome of a leg once the player commits to it
  // Order of likelihood: safe passage -> scare -> swamping -> capsize
  resolveLeg(risk, state) {
    const cfg = window.HAZARD_CONFIG;
    if (risk.score < cfg.WARN_THRESHOLD) {
      return { type: "safe" };
    }
    // Excess risk above threshold scales bad-outcome odds smoothly
    const excess = Math.max(0, risk.score - cfg.WARN_THRESHOLD);
    const pCapsize = Math.min(0.22, (0.07 + excess * 0.025) * cfg.RISK_SCALE); // ~1 in 10 to 1 in 15 on typical risky leg
    const pSwamp = Math.min(0.32, (0.18 + excess * 0.03) * cfg.RISK_SCALE);
    const pScare = Math.min(0.45, (0.30 + excess * 0.03) * cfg.RISK_SCALE);

    const roll = Math.random();
    if (roll < pCapsize) return { type: "capsize" };
    if (roll < pCapsize + pSwamp) return { type: "swamp", turns: 2 + (Math.random() < 0.4 ? 1 : 0) };
    if (roll < pCapsize + pSwamp + pScare) {
      const damage = 8 + Math.floor(Math.random() * 10);
      const loseGear = !state.lashed && Math.random() < 0.35;
      return { type: "scare", damage, loseGear };
    }
    return { type: "safe" };
  },

  // Resolve player's choice during an active capsize sequence
  // Choices: cling, swim, right, call
  resolveCapsizeChoice(choice, loc, state) {
    const nearShore = Boolean(loc.hazard?.shelter) || (loc.hazard?.exposure || 0) <= 1;
    const roll = Math.random();

    if (choice === "cling") {
      // Safest in exposed water if hull is sound; cold still poses risk
      const surviveChance = nearShore ? 0.85 : 0.60;
      if (roll < surviveChance) {
        return { survived: true, hullLoss: 15, text: "You cling to the upturned gunwale as the tide carries you toward gravel shallows. Numb with cold, you drag the flooded skiff onto the beach." };
      }
      return { survived: false, text: "You hold the overturned hull until your fingers lose all feeling in the cold water. The tide carries the skiff out beyond the point." };
    }
    if (choice === "swim") {
      // Good near shelter, lethal far from shore in cold Sound water
      const surviveChance = nearShore ? 0.72 : 0.20;
      if (roll < surviveChance) {
        return { survived: true, hullLoss: 25, text: "You strike out for the gravel beach before the cold locks your limbs, pulling yourself ashore and later salvaging the swamped skiff." };
      }
      return { survived: false, text: "The Sound is colder than you reckoned. Halfway to the distant bluff your arms grow heavy and fail." };
    }
    if (choice === "right") {
      // Works if not overly fatigued and hull is decent
      const surviveChance = state.fatigue < 60 ? 0.65 : 0.35;
      if (roll < surviveChance) {
        return { survived: true, hullLoss: 12, swamped: 3, text: "Throwing your weight onto the keel, you heave the skiff upright. It floats gunwale-deep; you scramble in and start bailing." };
      }
      return { survived: false, text: "The flooded skiff rolls back over in the chop before you can clear it. Cold water finishes what the squall began." };
    }
    if (choice === "call") {
      // Better near villages/posts/sheltered shore
      const nearPeople = ["olympia_landing", "fort_nisqually", "steilacoom", "elliott_bay", "port_madison", "port_townsend", "neah_bay", "budd_inlet"].includes(loc.id);
      const surviveChance = nearPeople ? 0.85 : (nearShore ? 0.45 : 0.15);
      if (roll < surviveChance) {
        return { survived: true, hullLoss: 10, text: "Your shout carries across the water. A cedar canoe puts out from shore, hauls you clear of the cold Sound, and tows your skiff to the gravel." };
      }
      return { survived: false, text: "Your voice vanishes into the wind and surf. No boat is within earshot." };
    }
    return null;
  }
};
