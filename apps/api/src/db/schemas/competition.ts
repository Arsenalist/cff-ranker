import * as mongoose from 'mongoose';
import { Competition } from '@cff/api-interfaces';

export const competitionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  zone: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['national', 'regional - east', 'regional - west', 'cff']
  }
});
type CompetitionType = Competition & mongoose.Document;
const CompetitionModel = mongoose.model<CompetitionType>('Competition', competitionSchema);
export { CompetitionModel };
