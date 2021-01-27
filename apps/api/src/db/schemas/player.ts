import * as mongoose from 'mongoose';
import { ValidationFile } from '@cff/api-interfaces';

const playerSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  name: { type: String, required: true },
  yearOfBirth: { type: Number, required: true },
  gender: { type: String, enum: ['M', 'F', ''] },
  club: { type: String, required: true },
  branch: {
    type: String,
    required: true,
    enum: ['ON', 'QC', 'SK', 'BC', 'MB', 'AB', 'NL', 'NT', 'NS', 'NU', 'NB', 'PE']
  },
  country: { type: String, required: true },
  cffNumber: { type: String, required: true },
  validated: { type: String, required: true, enum: ['y', 'n'] }
});

const validationFile = new mongoose.Schema({
  players: { type: [playerSchema] },
  dateGenerated: { type: Date, required: true, default: Date.now }
});

type ValidationFileType = ValidationFile & mongoose.Document;
export const ValidationFileModel = mongoose.model<ValidationFileType>('ValidationFile', validationFile);
