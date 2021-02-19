import * as mongoose from 'mongoose';
import { playerClassificationSchema } from './player-classification';

const zoneDistribution = new mongoose.Schema({
  points: Number,
  competitions: [{
    code: String,
    points: Number
  }]
});

export const rank = new mongoose.Schema({
  position: { type: Number, required: true },
  points: { type: Number, required: true },
  player: { type: playerClassificationSchema },
  cffDistribution: zoneDistribution,
  regionalDistribution: zoneDistribution,
  nationalDistribution: zoneDistribution,
});
