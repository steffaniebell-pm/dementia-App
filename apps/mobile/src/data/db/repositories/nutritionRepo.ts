import { NutritionRecipe } from '../../../domain/models';

const dailyTip = 'Add one glass of water with each meal to stay hydrated.';

const recipes: NutritionRecipe[] = [
  {
    id: 'recipe-1',
    title: 'Easy Oatmeal Bowl',
    tag: 'easy to chew',
    ingredients: ['1/2 cup oats', '1 cup milk', 'soft fruit topping'],
    steps: [
      'Add oats and milk to a bowl.',
      'Heat for about 2 minutes.',
      'Top with soft fruit and serve warm.',
    ],
  },
];

export const getDailyNutritionTip = (): string => dailyTip;

export const getRecipeOfTheDay = (): NutritionRecipe => recipes[0];

export const getRecipeById = (id: string): NutritionRecipe | undefined => {
  return recipes.find((recipe) => recipe.id === id);
};