import * as mongoose from 'mongoose';

export const participantWarning = new mongoose.Schema({
  type: { type: String, required: true }
});
