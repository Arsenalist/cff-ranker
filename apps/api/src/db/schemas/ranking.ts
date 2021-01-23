import * as mongoose from 'mongoose';
import { rank } from './rank';
import { Ranking } from '@cff/api-interfaces';

export const ranking = new mongoose.Schema({
  ageCategory: { type: mongoose.Types.ObjectId, required: true, ref: 'AgeCategory' },
  weapon: { type: String, required: true, lowercase: true, enum: ['fleuret', 'epee', 'sabre'] },
  ranks: { type: [rank] },
  rankingJob: { type: mongoose.Types.ObjectId, required: true, ref: 'RankingJob' }
});
type RankingType = Ranking & mongoose.Document;
const RankingModel = mongoose.model<RankingType>('Ranking', ranking);
export { RankingModel };
