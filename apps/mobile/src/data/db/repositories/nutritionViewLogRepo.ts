import { NutritionViewLog } from '../../../domain/backendModels';
import { nowIso } from '../../../utils/time';
import { readState, upsertState } from '../sqliteStore';

const STORAGE_KEY = 'backend.nutritionViewLogs';
const views: NutritionViewLog[] = [];

const persist = () => upsertState(STORAGE_KEY, JSON.stringify(views));

export const hydrateNutritionViewLogs = (): void => {
  const raw = readState(STORAGE_KEY);
  if (!raw) {
    return;
  }
  const parsed = JSON.parse(raw) as NutritionViewLog[];
  views.splice(0, views.length, ...parsed);
};

export const logNutritionRecipeView = (patientId: string, recipeId: string): NutritionViewLog => {
  const entry: NutritionViewLog = {
    patientId,
    recipeId,
    viewedAtIso: nowIso(),
  };
  views.unshift(entry);
  persist();
  return entry;
};