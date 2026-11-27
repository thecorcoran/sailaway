// hazards.js — Single tunable table for wind, tide, exposure, vessel, season, and death odds
window.HAZARD_CONFIG = {
  RISK_SCALE: 1.0,              // Tune overall lethality (~1 in 10 to 1 in 20 death on risky legs)
  WARN_THRESHOLD: 4,            // Refuse sail/row and warn when risk >= this until player types "push on"
  WIND_RISK: { calm: 0, breeze: 1, strong: 3, gale: 5 },
  WIND_AGAINST_TIDE: 2,
  REEF_MITIGATION: -2,
  WINTER_PENALTY: 1,
  OVERLOAD_PENALTY: 2,
  LOW_HULL_THRESHOLD: 65,
  FATIGUE_THRESHOLD: 65,
  NO_SHELTER_PENALTY: 1,
  SHOALS_NO_LEAD_PENALTY: 2,
  SHELLFISH_POISON_CHANCE: 0.16 // Higher in summer, lower in winter
};

window.Hazards = {
  totalWeight(inventory) {
    return inventory.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  },

  evaluateLeg(state, fromLoc, toLoc, hasLeadLine) {
    const cfg = window.HAZARD_CONFIG;
    const vessel = window.VESSELS[state.vesselId] || window.VESSELS.skiff;
    const reasons = [];
    let score = 0;

    let windRisk = cfg.WIND_RISK[state.wind] || 0;
    if (state.reefed && windRisk > 0) {
      windRisk = Math.max(0, windRisk + cfg.REEF_MITIGATION);
      reasons.push(`wind(${state.wind},reefed)=${windRisk}`);
    } else if (windRisk > 0) {
      reasons.push(`wind(${state.wind})=${windRisk}`);
    }
    score += windRisk;

    const tidal = Boolean(fromLoc.hazard?.tidal || toLoc.hazard?.tidal);
    const windAgainstTide = tidal && state.tide !== "slack" && (state.wind === "strong" || state.wind === "gale" || (state.wind === "breeze" && state.tide === "ebb"));
    if (windAgainstTide) {
      score += cfg.WIND_AGAINST_TIDE;
      reasons.push(`wind-vs-tide=+${cfg.WIND_AGAINST_TIDE}`);
    }

    const exposure = Math.max(fromLoc.hazard?.exposure || 0, toLoc.hazard?.exposure || 0);
    if (exposure > 0) {
      score += exposure;
      reasons.push(`exposure=+${exposure}`);
    }

    if (!toLoc.hazard?.shelter) {
      score += cfg.NO_SHELTER_PENALTY;
      reasons.push(`away-from-shelter=+${cfg.NO_SHELTER_PENALTY}`);
    }

    if (toLoc.hazard?.shoals && !hasLeadLine && state.tide === "ebb") {
      score += cfg.SHOALS_NO_LEAD_PENALTY;
      reasons.push(`shoals-no-lead=+${cfg.SHOALS_NO_LEAD_PENALTY}`);
    }

    if (state.season === "winter") {
      score += cfg.WINTER_PENALTY;
      reasons.push(`winter=+${cfg.WINTER_PENALTY}`);
    }

    if (state.hull < cfg.LOW_HULL_THRESHOLD) {
      score += 2;
      reasons.push("worn-hull=+2");
    }

    const wt = this.totalWeight(state.inventory);
    if (wt > vessel.cargoLimit) {
      score += cfg.OVERLOAD_PENALTY;
      reasons.push(`overloaded(${wt.toFixed(0)}/${vessel.cargoLimit}lb)=+${cfg.OVERLOAD_PENALTY}`);
    }

    if (state.fatigue >= cfg.FATIGUE_THRESHOLD) {
      score += 1;
      reasons.push("fatigue=+1");
    }

    if (vessel.riskBonus) {
      score = Math.max(0, score + vessel.riskBonus);
      reasons.push(`${vessel.id}=${vessel.riskBonus}`);
    }

    const scaled = Math.max(0, Math.round(score * cfg.RISK_SCALE * 10) / 10);
    return { score: scaled, warn: scaled >= cfg.WARN_THRESHOLD, windAgainstTide, exposure, reasons };
  },

  buildWarning(state, toLoc, risk) {
    const vessel = window.VESSELS[state.vesselId] || window.VESSELS.skiff;
    const bits = [];
    if (state.wind === "gale") bits.push("Slate cloud to the west; gale gusts tear white streaks across the water.");
    else if (state.wind === "strong") bits.push("Heavy gusts stack steep gray chop across the reach.");
    if (risk.windAgainstTide) bits.push(`The ${state.tide} is running against the wind off the point.`);
    if (toLoc.hazard?.shoals && state.tide === "ebb") bits.push("Low water exposes uncharted shoals without a lead line.");
    if (this.totalWeight(state.inventory) > vessel.cargoLimit) bits.push(`Your ${vessel.name} sits heavy past its ${vessel.cargoLimit} lb load.`);
    if (!state.reefed && (state.wind === "strong" || state.wind === "gale")) bits.push("Your sail is still unreefed.");
    if (state.season === "winter") bits.push("Short winter daylight leaves little margin.");
    if (!bits.length) bits.push(`Exposed water lies ahead toward ${toLoc.name}.`);
    bits.push("Sailing now would be foolish. Type 'push on' or repeat the command to proceed anyway.");
    return bits.join(" ");
  },

  resolveLeg(risk, state) {
    const cfg = window.HAZARD_CONFIG;
    if (risk.score < cfg.WARN_THRESHOLD) return { type: "safe" };

    const excess = Math.max(0, risk.score - cfg.WARN_THRESHOLD);
    const pCapsize = Math.min(0.22, (0.07 + excess * 0.025) * cfg.RISK_SCALE);
    const pSwamp = Math.min(0.32, (0.18 + excess * 0.03) * cfg.RISK_SCALE);
    const pScare = Math.min(0.45, (0.30 + excess * 0.03) * cfg.RISK_SCALE);

    const roll = Math.random();
    if (roll < pCapsize) return { type: "capsize" };
    if (roll < pCapsize + pSwamp) return { type: "swamp", turns: 2 + (Math.random() < 0.4 ? 1 : 0) };
    if (roll < pCapsize + pSwamp + pScare) {
      return { type: "scare", damage: 8 + Math.floor(Math.random() * 10), loseGear: !state.lashed && Math.random() < 0.35 };
    }
    return { type: "safe" };
  },

  resolveCapsizeChoice(choice, loc, state) {
    const nearShore = Boolean(loc.hazard?.shelter) || (loc.hazard?.exposure || 0) <= 1;
    const coldPenalty = state.season === "winter" ? -0.15 : 0;
    const roll = Math.random();

    if (choice === "cling") {
      if (roll < (nearShore ? 0.85 : 0.58) + coldPenalty) {
        return { survived: true, hullLoss: 15, text: "You cling to the upturned gunwale as the tide sets you onto gravel shallows. Numb with cold, you haul the flooded hull ashore." };
      }
      return { survived: false, text: "You hold the overturned hull until cold water takes the strength from your hands. The tide carries the boat beyond the point." };
    }
    if (choice === "swim") {
      if (roll < (nearShore ? 0.72 : 0.18) + coldPenalty) {
        return { survived: true, hullLoss: 25, text: "You strike out for the gravel beach before the cold locks your limbs, reaching shore and later salvaging the swamped hull." };
      }
      return { survived: false, text: "The water is colder than you reckoned. Halfway to the distant bluff your arms fail." };
    }
    if (choice === "right") {
      if (roll < (state.fatigue < 60 ? 0.65 : 0.32) + coldPenalty) {
        return { survived: true, hullLoss: 12, swamped: 3, text: "Throwing your weight onto the keel, you heave the boat upright. She floats gunwale-deep; you scramble in to bail." };
      }
      return { survived: false, text: "The flooded boat rolls back over in the chop before you can clear it. Cold water finishes the work." };
    }
    if (choice === "call") {
      const nearPeople = Boolean(loc.isFort || loc.hasCamp);
      if (roll < (nearPeople ? 0.82 : nearShore ? 0.40 : 0.12)) {
        return { survived: true, hullLoss: 10, text: "Your shout carries across the water. A cedar canoe puts out from shore, pulls you clear, and tows your boat to the beach." };
      }
      return { survived: false, text: "Your voice vanishes into wind and surf. No boat is within earshot." };
    }
    return null;
  }
};
