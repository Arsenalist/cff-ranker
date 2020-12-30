import { Competition, CompetitionResults, CompetitionStatus, Player, PlayerClassification } from '@cff/api-interfaces';

import * as mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  surname: {type: String, required: true},
  name: {type: String, required: true},
  yearOfBirth: {type: Number, required: true},
  gender: {type: String, enum: ['M', 'F', '']},
  club: {type: String, required: true},
  branch: {type: String, required: true, enum: ['ON', 'QC', 'SK', 'BC', 'MB', 'AB', 'NL', 'NT', 'NS', 'NU', 'NB', 'PE']},
  country: {type: String, required: true},
  cffNumber: {type: String, required: true},
  validated: {type: String, required: true, enum: ['y', 'n']}
});

const participantWarning = new mongoose.Schema({
  type: {type: String, required: true},
});

const competitionParticipant = new mongoose.Schema({
  surname: {type: String, required: true},
  name: {type: String, required: true},
  yearOfBirth: {type: Number, required: true},
  gender: {type: String, enum: ['M', 'F', '']},
  country: {type: String, required: true},
  cffNumber: {type: String},
  branch: {type: String, required: true},
  club: {type: String, required: true},
  rank:  {type: Number },
  validated: {type: String, required: true},
  warnings: {type: [participantWarning]}
});

const competitionFileRecordSchema = new mongoose.Schema({
  creator: {type: String, required: true},
  competitionType: {type: String, required: true},
  competitionDate: {type: String, required: true},
  weapon: {type: String, required: true, lowercase: true, enum: ['fleuret', 'epee', 'sabre']},
  gender: {type: String, enum: ['M', 'F', '']},
  ageCategory: {type: String, required: true, lowercase: true, enum: ['cadet', 'junior', 'senior', 'veterans', 'minime', 'benjamin','pupille', 'poussin', 'u23']},
  tournamentName: {type: String, required: true},
  competitionShortName: {type: String, required: true},
  status: {type: String, default: CompetitionStatus.pending, required: true, lowercase: true, enum: [CompetitionStatus.approved, CompetitionStatus.rejected, CompetitionStatus.pending]},
  results: {type: [competitionParticipant], validate: v => Array.isArray(v) && v.length > 0, }
})

const competitionSchema = new mongoose.Schema({
  name: {type: String, required: true},
  code: {type: String, required: true, unique: true},
  zone: {type: String, required: true, lowercase: true, enum: ['national', 'regional', 'cff']}
});

const playerClassificationSchema = new mongoose.Schema({
  weapon:  {type: String, required: true},
  class:  {type: String, required: true},
  lastName:  {type: String, required: true},
  firstName:  {type: String, required: true},
  cffNumber:  {type: String, required: true},
  club:  {type: String, required: true},
  province:  {type: String, required: true}
});

type CompetitionResultsType = CompetitionResults & mongoose.Document;
const CompetitionResultsModel = mongoose.model<CompetitionResultsType>('CompetitionResults', competitionFileRecordSchema);

type PlayerType = Player & mongoose.Document;
const PlayerModel = mongoose.model<PlayerType>('Player', playerSchema);

type CompetitionType = Competition & mongoose.Document;
const CompetitionModel = mongoose.model<CompetitionType>('Competition', competitionSchema);

type PlayerClassificationType = PlayerClassification & mongoose.Document;
const PlayerClassificationModel = mongoose.model<PlayerClassificationType>('PlayerClassification', playerClassificationSchema);

export { PlayerModel, CompetitionResultsModel, CompetitionModel, PlayerClassificationModel }
