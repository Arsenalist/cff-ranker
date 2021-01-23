import * as mongoose from 'mongoose';
import { participantWarning } from './participant-warning';

export const competitionParticipant = new mongoose.Schema({
  surname: { type: String, required: true },
  name: { type: String, required: true },
  yearOfBirth: { type: Number, required: true },
  gender: { type: String, enum: ['M', 'F', ''] },
  country: { type: String, required: true },
  cffNumber: { type: String },
  branch: { type: String, required: true },
  club: { type: String, required: true },
  rank: { type: Number },
  validated: { type: String, required: true },
  warnings: { type: [participantWarning] }
});
