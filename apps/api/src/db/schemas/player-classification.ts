import * as mongoose from 'mongoose';
import { ClassificationFile, PlayerClassification } from '@cff/api-interfaces';

export const playerClassificationSchema = new mongoose.Schema({
  weapon: { type: String, required: true },
  class: { type: String, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  cffNumber: { type: String, required: true },
  club: { type: String, required: true },
  province: { type: String, required: true }
});

const validationFile = new mongoose.Schema({
  classifications: { type: [playerClassificationSchema] },
  dateGenerated: { type: Date, required: true, default: Date.now }
});

type ClassificationFileType = ClassificationFile & mongoose.Document;
export const ClassificationFileModel = mongoose.model<ClassificationFileType>('ClassificationFile', validationFile);
