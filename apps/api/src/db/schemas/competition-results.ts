import * as mongoose from 'mongoose';
import { CompetitionResult, CompetitionStatus } from '@cff/api-interfaces';
import { competitionParticipant } from './competition-participant';

const competitionFileRecordSchema = new mongoose.Schema({
  competition: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition' },
  creator: { type: String, required: true },
  competitionType: { type: String, required: true },
  competitionDate: { type: String, required: true },
  weapon: { type: String, required: true, lowercase: true, enum: ['fleuret', 'epee', 'sabre'] },
  gender: { type: String, enum: ['M', 'F', ''] },
  ageCategory: { type: mongoose.Types.ObjectId, required: true, ref: 'AgeCategory' },
  tournamentName: { type: String, required: true },
  competitionShortName: { type: String, required: true },
  status: {
    type: String,
    default: CompetitionStatus.pending,
    required: true,
    lowercase: true,
    enum: [CompetitionStatus.approved, CompetitionStatus.rejected, CompetitionStatus.pending]
  },
  results: { type: [competitionParticipant], validate: v => Array.isArray(v) && v.length > 0 }
});
type CompetitionResultsType = CompetitionResult & mongoose.Document;
export const CompetitionResultsModel = mongoose.model<CompetitionResultsType>('CompetitionResults', competitionFileRecordSchema);
