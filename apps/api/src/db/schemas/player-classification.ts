import * as mongoose from 'mongoose';
import { PlayerClassification } from '@cff/api-interfaces';

export const playerClassificationSchema = new mongoose.Schema({
  weapon: { type: String, required: true },
  class: { type: String, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  cffNumber: { type: String, required: true },
  club: { type: String, required: true },
  province: { type: String, required: true }
});
type PlayerClassificationType = PlayerClassification & mongoose.Document;
export const PlayerClassificationModel = mongoose.model<PlayerClassificationType>('PlayerClassification', playerClassificationSchema);
