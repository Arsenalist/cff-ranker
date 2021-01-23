import * as mongoose from 'mongoose';
import { playerClassificationSchema } from './player-classification';

export const rank = new mongoose.Schema({
  points: { type: Number, required: true },
  player: { type: playerClassificationSchema }
});
