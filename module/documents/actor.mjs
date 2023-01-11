/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class MonsterHunter3eActor extends Actor {

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
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.monsterhunter3e || {};

    // Make separate methods for each Actor type (character, monster, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareMonsterData(actorData);
  }

  /**
   * Prepare Character-type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    // Set up references.
    data.attributes.muscle.label = "MUSCLE";
    data.attributes.agility.label = "AGILITY";
    data.attributes.endurance.label = "ENDURANCE";
    data.attributes.cunning.label = "CUNNING";
    data.attributes.skill.label = "SKILLS";
    data.attributes.presence.label = "PRESENCE";

    // Calculate Attributes.
    data.attributes.muscle.value = data.attributes.muscle.base;
    data.attributes.agility.value = data.attributes.agility.base;
    data.attributes.endurance.value = data.attributes.endurance.base;
    data.attributes.skill.value = data.attributes.skill.base;
    data.attributes.cunning.value = data.attributes.cunning.base;
    data.attributes.presence.value = data.attributes.presence.base;

    // Calculate attribute points spent.
    let pointsToBeSpent = 3 + (data.rank.value * 2);
    pointsToBeSpent -= data.attributes.muscle.base;
    pointsToBeSpent -= data.attributes.agility.base;
    pointsToBeSpent -= data.attributes.endurance.base;
    pointsToBeSpent -= data.attributes.skill.base;
    pointsToBeSpent -= data.attributes.cunning.base;
    pointsToBeSpent -= data.attributes.presence.base;

    if (pointsToBeSpent == 0) data.pointsRemainingMessage = " ";
    else if (pointsToBeSpent < 0) data.pointsRemainingMessage = "[" + Math.abs(pointsToBeSpent) + "] too many points!"
    else data.pointsRemainingMessage = "[" + pointsToBeSpent + "] points remaining.";
    data.pointsRemainingMessage = "<p style=\"text-align:center; font-weight:bold\">" + data.pointsRemainingMessage + "</p>";

    // Calculate Resources.
    data.health.max = (100 * data.rank.value) + (20 * data.attributes.muscle.value) + (20 * data.attributes.endurance.value) + (10 * data.attributes.presence.value);
    data.stamina.max = (5 * data.rank.value) + (1 * data.attributes.muscle.value) + (1 * data.attributes.endurance.value) + (1 * data.attributes.presence.value);
    data.stress.max = (5 * data.rank.value) + (1 * data.attributes.skill.value) + (1 * data.attributes.cunning.value) + (1 * data.attributes.presence.value);

    // Calculate Properties.
    let armourProtection = 2 * data.armour.quality;
    if (data.armour.type == "light") { armourProtection += 20; }
    else if (data.armour.type == "medium") { armourProtection += 40; }
    else if (data.armour.type == "heavy") { armourProtection += 50; }
    else if (data.armour.type == "ironclad") { armourProtection += 60; }
    data.resistances.stab.value = armourProtection;
    data.resistances.cut.value = armourProtection;
    data.resistances.smash.value = armourProtection;

    let elementalProtection = Math.round(armourProtection / 2);
    if (data.armour.fullElemental == true) { elementalProtection = armourProtection; }
    data.resistances.fire.value = elementalProtection;
    data.resistances.ice.value = elementalProtection;
    data.resistances.water.value = elementalProtection;
    data.resistances.lightning.value = elementalProtection;
    data.resistances.poison.value = elementalProtection;
    data.resistances.blast.value = elementalProtection;
    data.resistances.sonic.value = elementalProtection;
    data.resistances.radiation.value = elementalProtection;
    data.resistances.mental.value = elementalProtection;
    data.resistances.dragon.value = elementalProtection;


    data.dodge.cap = (1 * data.attributes.agility.value);
    if (data.armour.type == "unarmoured") { data.dodge.cap += 20 + (2 * data.armour.quality); }
    else if (data.armour.type == "light") { data.dodge.cap += 15 + (1 * data.armour.quality); }
    else if (data.armour.type == "medium") { data.dodge.cap += 10 + (1 * data.armour.quality); }
    else if (data.armour.type == "heavy") { data.dodge.cap += 5 + (1 * data.armour.quality); }
    else if (data.armour.type == "ironclad") { data.dodge.cap += 3 + (1 * data.armour.quality); }

    data.dodge.value = 10 + (2 * data.attributes.agility.value) + (1 * data.attributes.skill.value) + (1 * data.attributes.cunning.value);
    if (data.dodge.value > data.dodge.cap) { data.dodge.value = data.dodge.cap; }
    if (data.armour.type == "unarmoured") {
      let minimumDodge = 10 + (1 * data.armour.quality);
      if (data.dodge.value < minimumDodge) { data.dodge.value = minimumDodge; }
    }

    data.posture.value = (1 * data.attributes.muscle.value);
    if (data.armour.type == "light") { data.posture.value += 0 + Math.round(data.armour.quality / 4); }
    else if (data.armour.type == "medium") { data.posture.value += 1 + Math.round(data.armour.quality / 3); }
    else if (data.armour.type == "heavy") { data.posture.value += 2 + Math.round(data.armour.quality / 2); }
    else if (data.armour.type == "ironclad") { data.posture.value += 3 + Math.round(data.armour.quality / 2); }

    data.resilience.value = (1 * data.attributes.endurance.value);
    if (data.armour.type == "medium") { data.resilience.value += 0 + Math.round(data.armour.quality / 5); }
    else if (data.armour.type == "heavy") { data.resilience.value += 1 + Math.round(data.armour.quality / 3); }
    else if (data.armour.type == "ironclad") { data.resilience.value += 2 + Math.round(data.armour.quality / 3); }

    data.mobility.value = (1 * data.attributes.agility.value);
    if (data.armour.type == "heavy") { data.mobility.value -= 1; }
    else if (data.armour.type == "ironclad") { data.mobility.value -= 2; }

    data.logic.value = (1 * data.attributes.cunning.value);

    data.affinity.value = (1 * data.attributes.skill.value);

    data.potency.value = Math.round(0.25 * data.attributes.presence.value);


    data.attackMods.damage.value = (10 * data.rank.value);
    if (data.element == "raw") { data.attackMods.damage.value = (12 * data.rank.value) + (5 * data.potency.value); }

    data.attackMods.toHit.value = (1 * data.rank.value);
  }

  /**
   * Prepare Monster-type specific data.
   */
  _prepareMonsterData(actorData) {
    if (actorData.type !== 'monster') return;

    // Make modifications to data here.
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
    if (this.data.type !== 'character') return;

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
   * Prepare monster roll data.
   */
  _getMonsterRollData(data) {
    if (this.data.type !== 'monster') return;

    // Process additional monster data here.
  }

}