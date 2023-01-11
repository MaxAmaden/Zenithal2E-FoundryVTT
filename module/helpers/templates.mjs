/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/z2e/templates/actor/parts/actor-character-header.html",
    "systems/z2e/templates/actor/parts/actor-character-core.html",
    "systems/z2e/templates/actor/parts/actor-character-build.html",
    "systems/z2e/templates/actor/parts/actor-features.html",
    "systems/z2e/templates/actor/parts/actor-items.html",
    "systems/z2e/templates/actor/parts/actor-spells.html",
    "systems/z2e/templates/actor/parts/actor-effects.html",
  ]);
};
