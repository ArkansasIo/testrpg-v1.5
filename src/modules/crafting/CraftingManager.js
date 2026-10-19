export class CraftingManager {
  constructor(recipes = []) { this.recipes = new Map(recipes.map(r => [r.id, r])); }
  canCraft(recipeId, inventory, level = 1) { const recipe = this.recipes.get(recipeId); if (!recipe) return { ok: false, reason: 'invalid-recipe' }; if (recipe.requiredLevel && level < recipe.requiredLevel) return { ok: false, reason: 'level-restricted' }; for (const ingredient of recipe.ingredients) { if ((inventory.get(ingredient.itemId)?.quantity ?? 0) < ingredient.quantity) return { ok: false, reason: 'missing-ingredient' }; } return { ok: true }; }
  craft(recipeId, inventory, level = 1) { const check = this.canCraft(recipeId, inventory, level); if (!check.ok) return check; const recipe = this.recipes.get(recipeId); for (const ingredient of recipe.ingredients) inventory.remove(ingredient.itemId, ingredient.quantity); inventory.add({ id: recipe.outputItemId }, recipe.outputQuantity); return { ok: true }; }
}
