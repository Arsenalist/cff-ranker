import { PlayerClassification } from '@cff/api-interfaces';
import * as mygoose from './mygoose';

export async function savePlayerClassifications(classifications: PlayerClassification[]) {
  return await mygoose.saveClassifications(classifications);
}
