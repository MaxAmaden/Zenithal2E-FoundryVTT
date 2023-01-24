/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class Zenithal2eActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.zenithal2e || {};

    // Make separate methods for each Actor type (character, monster, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareMonsterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    const systemData = actorData.system;


    // Define null values.
    if (systemData.attributes.durability.base == null) systemData.attributes.durability.base = 0;
    if (systemData.attributes.durability.mods == null) systemData.attributes.durability.mods = 0;

    if (systemData.attributes.mass.base == null) systemData.attributes.mass.base = 0;
    if (systemData.attributes.mass.mods == null) systemData.attributes.mass.mods = 0;

    if (systemData.attributes.agility.base == null) systemData.attributes.agility.base = 0;
    if (systemData.attributes.agility.mods == null) systemData.attributes.agility.mods = 0;

    if (systemData.attributes.precision.base == null) systemData.attributes.precision.base = 0;
    if (systemData.attributes.precision.mods == null) systemData.attributes.precision.mods = 0;

    if (systemData.attributes.cunning.base == null) systemData.attributes.cunning.base = 0;
    if (systemData.attributes.cunning.mods == null) systemData.attributes.cunning.mods = 0;

    if (systemData.focus.value == null) systemData.focus.value = 3;
    if (systemData.focus.mods == null) systemData.focus.mods = 0;

    if (systemData.ammo.value == null) systemData.ammo.value = 5;
    if (systemData.ammo.mods == null) systemData.ammo.mods = 0;



    // Calculate attribute points.
    systemData.attributes.durability.value = systemData.attributes.durability.base + systemData.attributes.durability.mods;    
    systemData.attributes.mass.value = systemData.attributes.mass.base + systemData.attributes.mass.mods;    
    systemData.attributes.agility.value = systemData.attributes.agility.base + systemData.attributes.agility.mods;    
    systemData.attributes.precision.value = systemData.attributes.precision.base + systemData.attributes.precision.mods;    
    systemData.attributes.cunning.value = systemData.attributes.cunning.base + systemData.attributes.cunning.mods;


    let pointsToBeSpent = 2 + (systemData.rank.value * 2);
    pointsToBeSpent -= systemData.attributes.durability.base;
    pointsToBeSpent -= systemData.attributes.mass.base;
    pointsToBeSpent -= systemData.attributes.agility.base;
    pointsToBeSpent -= systemData.attributes.precision.base;
    pointsToBeSpent -= systemData.attributes.cunning.base;

    if (pointsToBeSpent == 0) systemData.pointsRemainingMessage = " ";
    else if (pointsToBeSpent < 0) systemData.pointsRemainingMessage = "[" + Math.abs(pointsToBeSpent) + "] too many points!"
    else systemData.pointsRemainingMessage = "[" + pointsToBeSpent + "] points remaining.";
    systemData.pointsRemainingMessage = "<p style=\"text-align:center; font-weight:bold\">" + systemData.pointsRemainingMessage + "</p>";



    // Special feature for Rank X (-1).
    let recallRank = systemData.rank.value;
    if (recallRank < 0) { systemData.rank.value = 0; }



    // Calculate Resources.
    systemData.life.max = systemData.rank.value * ((50) + (5 * systemData.attributes.durability.value) + (2 * systemData.attributes.mass.value) + (1 * systemData.attributes.agility.value));
    if (systemData.armor.type == "armor_light") { systemData.life.max += 10 * systemData.rank.value; }
    else if (systemData.armor.type == "armor_medium") { systemData.life.max += 20 * systemData.rank.value; }
    else if (systemData.armor.type == "armor_heavy") { systemData.life.max += 30 * systemData.rank.value; }
    else if (systemData.armor.type == "packs_medium") { systemData.life.max += 5 * systemData.rank.value; }
    else if (systemData.armor.type == "packs_heavy") { systemData.life.max += 15 * systemData.rank.value; }
    else if (systemData.armor.type == "robes_light") { systemData.life.max -= 10 * systemData.rank.value; }
    else if (systemData.armor.type == "robes_heavy") { systemData.life.max -= 25 * systemData.rank.value; }
    if (systemData.rank.value == 0) { systemData.life.max = 25; }
    if (recallRank < 0) { systemData.life.max = 10; }

    systemData.focus.max = 3 + systemData.focus.mods;
    if (systemData.armor.type == "robes_light") { systemData.focus.max += 1; }
    else if (systemData.armor.type == "robes_heavy") { systemData.focus.max += 2; }

    systemData.ammo.max = 5 + systemData.ammo.mods;
    if (systemData.armor.type == "packs_light") { systemData.ammo.max += 1; }
    else if (systemData.armor.type == "packs_medium") { systemData.ammo.max += 3; }
    else if (systemData.armor.type == "packs_heavy") { systemData.ammo.max += 5; }

    systemData.resources.stance.max = Math.floor(systemData.attributes.mass.value / 2);
    if (systemData.armor.type == "armor_light") { systemData.resources.stance.max += 1; }
    else if (systemData.armor.type == "armor_medium") { systemData.resources.stance.max += 2; }
    else if (systemData.armor.type == "armor_heavy") { systemData.resources.stance.max += 3; }
    else if (systemData.armor.type == "packs_heavy") { systemData.resources.stance.max += 1; }

    systemData.resources.perfection.max = Math.floor(systemData.attributes.precision.value / 2);

    systemData.resources.expertise.max = Math.floor(systemData.attributes.cunning.value / 2);

    systemData.resources.lastStand.max = Math.floor(systemData.attributes.durability.value / 2);

    

    // Calculate Properties.
    systemData.damageMultiplier.value = (50) + (50 * systemData.rank.value);
    if (recallRank < 0) { systemData.damageMultiplier.value = 25; }

    systemData.accuracy.value = (2 * systemData.rank.value) + (1 * systemData.attributes.precision.value);
    if (recallRank < 0) { systemData.accuracy.value = -4; }

    systemData.healingFactor.value = (10 * systemData.rank.value) + (2 * systemData.attributes.durability.value);

    systemData.speed.value = (25) + (Math.floor(systemData.attributes.agility.value / 2) * 5);
    if (systemData.armor.type == "armor_medium" && systemData.attributes.mass.value <= 1) { systemData.speed.value -= 5; }
    else if (systemData.armor.type == "armor_heavy" && systemData.attributes.mass.value <= 1) { systemData.speed.value -= 10; }
    else if (systemData.armor.type == "armor_heavy" && systemData.attributes.mass.value <= 3) { systemData.speed.value -= 5; }

    systemData.dodgeRating.value = (systemData.attributes.agility.value);
    if (systemData.armor.type == "bare") { systemData.dodgeRating.value += 11 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "clothes") { systemData.dodgeRating.value += 10 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "armor_light") { systemData.dodgeRating.value += 7 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "armor_medium") { systemData.dodgeRating.value += 4 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "armor_heavy") { systemData.dodgeRating.value += 1 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "packs_light") { systemData.dodgeRating.value += 9 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "packs_medium") { systemData.dodgeRating.value += 7 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "packs_heavy") { systemData.dodgeRating.value += 4 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "robes_light") { systemData.dodgeRating.value += 7 + (2 * systemData.rank.value); }
    else if (systemData.armor.type == "robes_heavy") { systemData.dodgeRating.value += 4 + (2 * systemData.rank.value); }

    systemData.criticalResistance.value = 0;
    if (systemData.armor.type == "armor_medium") { systemData.criticalResistance.value += 1; }
    else if (systemData.armor.type == "armor_heavy") { systemData.criticalResistance.value += 2; }



    // Special feature for Rank X (-1).
    if (recallRank < 0) { systemData.rank.value = recallRank; }
  }

  /**
   * Prepare Monster type specific data.
   */
  _prepareMonsterData(actorData) {
    if (actorData.type !== 'monster') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = (systemData.cr * systemData.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getMonsterRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare Monster roll data.
   */
  _getMonsterRollData(data) {
    if (this.type !== 'monster') return;

    // Process additional Monster data here.
  }

}