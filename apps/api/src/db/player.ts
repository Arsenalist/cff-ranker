import { Player } from '@cff/api-interfaces';
import * as mygoose from './mygoose';

async function savePlayers(results: Player[]) {
  await mygoose.savePlayers(results);
}

export { savePlayers };
