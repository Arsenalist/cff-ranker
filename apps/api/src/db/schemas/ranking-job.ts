import * as mongoose from 'mongoose';
import { RankingJob } from '@cff/api-interfaces';

const rankingJobSchema = new mongoose.Schema({
  user: { type: String, required: true },
  dateGenerated: { type: Date, required: true, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});
type RankingJobType = RankingJob & mongoose.Document;
export const RankingJobModel = mongoose.model<RankingJobType>('RankingJob', rankingJobSchema);
