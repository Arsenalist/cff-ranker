import {
  AgeCategory,
  Competition,
  CompetitionResults,
  CompetitionStatus,
  Player,
  PlayerClassification, Ranking, RankingJob
} from '@cff/api-interfaces';

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

const ageCategorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  code: {type: String, required: true, unique: true},
  yearOfBirth: {type: Number, required: true},
  minimumForce: {type: Number, required: true}
});

const competitionFileRecordSchema = new mongoose.Schema({
  competition: {type: mongoose.Schema.Types.ObjectId, ref: 'Competition'},
  creator: {type: String, required: true},
  competitionType: {type: String, required: true},
  competitionDate: {type: String, required: true},
  weapon: {type: String, required: true, lowercase: true, enum: ['fleuret', 'epee', 'sabre']},
  gender: {type: String, enum: ['M', 'F', '']},
  ageCategory: {type: mongoose.Types.ObjectId, required: true, ref: 'AgeCategory'},
  tournamentName: {type: String, required: true},
  competitionShortName: {type: String, required: true},
  status: {type: String, default: CompetitionStatus.pending, required: true, lowercase: true, enum: [CompetitionStatus.approved, CompetitionStatus.rejected, CompetitionStatus.pending]},
  results: {type: [competitionParticipant], validate: v => Array.isArray(v) && v.length > 0, }
})

const competitionSchema = new mongoose.Schema({
  name: {type: String, required: true},
  code: {type: String, required: true, unique: true},
  zone: {type: String, required: true, lowercase: true, enum: ['national', 'regional - east', 'regional - west', 'cff']}
});

const rankingJobSchema = new mongoose.Schema({
  user:  {type: String, required: true},
  dateGenerated:  {type: Date, required: true, default: Date.now}
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

const rank = new mongoose.Schema({
  points: {type: Number, required: true},
  player: {type: playerClassificationSchema}
})

const ranking = new mongoose.Schema({
  ageCategory: {type: mongoose.Types.ObjectId, required: true, ref: 'AgeCategory'},
  weapon: {type: String, required: true, lowercase: true, enum: ['fleuret', 'epee', 'sabre']},
  ranks: {type: [rank]},
  rankingJob: {type: mongoose.Types.ObjectId, required: true, ref: 'RankingJob'}
})


type CompetitionResultsType = CompetitionResults & mongoose.Document;
const CompetitionResultsModel = mongoose.model<CompetitionResultsType>('CompetitionResults', competitionFileRecordSchema);

type PlayerType = Player & mongoose.Document;
const PlayerModel = mongoose.model<PlayerType>('Player', playerSchema);

type CompetitionType = Competition & mongoose.Document;
const CompetitionModel = mongoose.model<CompetitionType>('Competition', competitionSchema);

type PlayerClassificationType = PlayerClassification & mongoose.Document;
const PlayerClassificationModel = mongoose.model<PlayerClassificationType>('PlayerClassification', playerClassificationSchema);

type AgeCategoryType = AgeCategory & mongoose.Document;
const AgeCategoryModel = mongoose.model<AgeCategoryType>('AgeCategory', ageCategorySchema);

type RankingJobType = RankingJob & mongoose.Document;
const RankingJobModel = mongoose.model<RankingJobType>('RankingJob', rankingJobSchema);

type RankingType = Ranking & mongoose.Document;
const RankingModel = mongoose.model<RankingType>('Ranking', ranking);

export { PlayerModel, CompetitionResultsModel, CompetitionModel, PlayerClassificationModel, AgeCategoryModel, RankingJobModel, RankingModel }
