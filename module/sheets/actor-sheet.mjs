import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class Zenithal2eActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["zenithal2e", "sheet", "actor"],
      template: "systems/zenithal2e/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/zenithal2e/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare Monster data and items.
    if (actorData.type == 'monster') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Calculate attribute points spent.
    let pointsToBeSpent = 2 + (context.system.rank.value * 2);
    pointsToBeSpent -= context.system.attributes.durability.value;
    pointsToBeSpent -= context.system.attributes.mass.value;
    pointsToBeSpent -= context.system.attributes.agility.value;
    pointsToBeSpent -= context.system.attributes.precision.value;
    pointsToBeSpent -= context.system.attributes.cunning.value;

    if (pointsToBeSpent == 0) context.system.pointsRemainingMessage = " ";
    else if (pointsToBeSpent < 0) context.system.pointsRemainingMessage = "[" + Math.abs(pointsToBeSpent) + "] too many points!"
    else context.system.pointsRemainingMessage = "[" + pointsToBeSpent + "] points remaining.";
    context.system.pointsRemainingMessage = "<p style=\"text-align:center; font-weight:bold\">" + context.system.pointsRemainingMessage + "</p>";

    // Calculate Resources.
    context.system.life.max = (50 * context.system.rank.value) + (5 * context.system.attributes.durability.value) + (2 * context.system.attributes.mass.value) + (1 * context.system.attributes.agility.value);
    if (context.system.armor.type == "armor_light") { context.system.life.max += 10 * context.system.rank.value; }
    else if (context.system.armor.type == "armor_medium") { context.system.life.max += 20 * context.system.rank.value; }
    else if (context.system.armor.type == "armor_heavy") { context.system.life.max += 30 * context.system.rank.value; }
    else if (context.system.armor.type == "packs_medium") { context.system.life.max += 5 * context.system.rank.value; }
    else if (context.system.armor.type == "packs_heavy") { context.system.life.max += 15 * context.system.rank.value; }
    else if (context.system.armor.type == "robes_light") { context.system.life.max -= 10 * context.system.rank.value; }
    else if (context.system.armor.type == "robes_heavy") { context.system.life.max -= 25 * context.system.rank.value; }

    // Calculate Properties.
    context.system.damageMultiplier.value = (50) + (50 * context.system.rank.value);

    context.system.accuracy.value = (2 * context.system.rank.value) + (1 * context.system.attributes.precision.value);

    context.system.healingFactor.value = (10 * context.system.rank.value) + (2 * context.system.attributes.durability.value);

    context.system.speed.value = (25) + Math.floor(context.system.attributes.agility.value / 2);
    if (context.system.armor.type == "armor_medium" && context.system.attributes.mass.value <= 1) { context.system.speed.value -= 5; }
    else if (context.system.armor.type == "armor_heavy" && context.system.attributes.mass.value <= 1) { context.system.speed.value -= 10; }
    else if (context.system.armor.type == "armor_heavy" && context.system.attributes.mass.value <= 3) { context.system.speed.value -= 5; }

    context.system.dodgeRating.value = (context.system.attributes.agility.value);
    if (context.system.armor.type == "bare") { context.system.dodgeRating.value += 11 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "clothes") { context.system.dodgeRating.value += 10 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "armor_light") { context.system.dodgeRating.value += 7 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "armor_medium") { context.system.dodgeRating.value += 4 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "armor_heavy") { context.system.dodgeRating.value += 1 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "packs_light") { context.system.dodgeRating.value += 9 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "packs_medium") { context.system.dodgeRating.value += 7 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "packs_heavy") { context.system.dodgeRating.value += 4 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "robes_light") { context.system.dodgeRating.value += 7 + (2 * context.system.rank.value); }
    else if (context.system.armor.type == "robes_heavy") { context.system.dodgeRating.value += 4 + (2 * context.system.rank.value); }

    context.system.criticalResistance.value = 0;
    if (context.system.armor.type == "armor_medium") { context.system.criticalResistance.value += 1; }
    else if (context.system.armor.type == "armor_heavy") { context.system.criticalResistance.value += 2; }
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: []
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

}
