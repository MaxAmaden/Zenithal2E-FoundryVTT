/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/monsterhunter3e/templates/actor/parts/actor-character-header.html",
    "systems/monsterhunter3e/templates/actor/parts/actor-character-core.html",
    "systems/monsterhunter3e/templates/actor/parts/actor-character-build.html",
    "systems/monsterhunter3e/templates/actor/parts/actor-features.html",
    "systems/monsterhunter3e/templates/actor/parts/actor-items.html",
    "systems/monsterhunter3e/templates/actor/parts/actor-spells.html",
    "systems/monsterhunter3e/templates/actor/parts/actor-effects.html",
  ]);
};
