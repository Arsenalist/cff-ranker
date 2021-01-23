import * as mongoose from 'mongoose';
import { RankingJob } from '@cff/api-interfaces';

export const rankingJobSchema = new mongoose.Schema({
  user: { type: String, required: true },
  dateGenerated: { type: Date, required: true, default: Date.now }
});
type RankingJobType = RankingJob & mongoose.Document;
const RankingJobModel = mongoose.model<RankingJobType>('RankingJob', rankingJobSchema);
export { RankingJobModel };
