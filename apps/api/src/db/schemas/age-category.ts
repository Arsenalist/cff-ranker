import * as mongoose from 'mongoose';
import { AgeCategory } from '@cff/api-interfaces';

export const ageCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  yearOfBirth: { type: Number, required: true },
  minimumForce: { type: Number, required: true }
});
type AgeCategoryType = AgeCategory & mongoose.Document;
const AgeCategoryModel = mongoose.model<AgeCategoryType>('AgeCategory', ageCategorySchema);
export { AgeCategoryModel };
