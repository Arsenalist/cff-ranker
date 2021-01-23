import { mockOnce } from '../../mockgoose';
import { PlayerClass, PlayerClassification } from '@cff/api-interfaces';
import { saveClassifications } from './player-classification';

describe('save classification file', () => {
  it('classification record saving is successful', async () => {
    mockOnce('insertMany');
    const classifications: PlayerClassification[] = [
      {weapon: 'ME', class: PlayerClass.A, lastName: 'Jones', firstName: 'Jim', cffNumber: 'C06-1234', club: 'ABC', province: 'ON'}
    ]
    await saveClassifications(classifications);
  });
});
