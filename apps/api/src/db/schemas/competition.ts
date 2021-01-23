import * as mongoose from 'mongoose';
import { Competition } from '@cff/api-interfaces';

const competitionSchema = new mongoose.Schema({
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
export const CompetitionModel = mongoose.model<CompetitionType>('Competition', competitionSchema);
