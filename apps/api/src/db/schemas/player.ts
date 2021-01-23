import * as mongoose from 'mongoose';
import { Player } from '@cff/api-interfaces';

export const playerSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  name: { type: String, required: true },
  yearOfBirth: { type: Number, required: true },
  gender: { type: String, enum: ['M', 'F', ''] },
  club: { type: String, required: true },
  branch: {
    type: String,
    required: true,
    enum: ['ON', 'QC', 'SK', 'BC', 'MB', 'AB', 'NL', 'NT', 'NS', 'NU', 'NB', 'PE']
  },
  country: { type: String, required: true },
  cffNumber: { type: String, required: true },
  validated: { type: String, required: true, enum: ['y', 'n'] }
});
type PlayerType = Player & mongoose.Document;
const PlayerModel = mongoose.model<PlayerType>('Player', playerSchema);
export { PlayerModel };
