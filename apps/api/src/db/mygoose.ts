import {
  AgeCategory,
  Competition,
  CompetitionResult,
  CompetitionStatus,
  Player,
  PlayerClassification,
  Weapon
} from '@cff/api-interfaces';
import { mongoose } from '@typegoose/typegoose';
import { CompetitionResultsModel } from './schemas/competition-results';
import { CompetitionModel } from './schemas/competition';
import { ClassificationFileModel } from './schemas/player-classification';
import { AgeCategoryModel } from './schemas/age-category';
import { ValidationFileModel } from './schemas/player';

export async function findCompetitionResults(): Promise<CompetitionResult[]> {
  return CompetitionResultsModel.find({}).populate('ageCategory competition');
}

export async function findCompetitionResult(id): Promise<CompetitionResult> {
  const objectId = mongoose.Types.ObjectId(id)
  return CompetitionResultsModel.findOne({ _id: objectId }).populate('ageCategory competition');
}

async function latestValidationFileId() {
  const latestValidationFileId = await ValidationFileModel.findOne().sort('-dateGenerated').select('_id');
  return latestValidationFileId._id;
}

export async function validateParticipant(cffNumber: string, name: string, surname: string, yearOfBirth: number, gender: string): Promise<Player> {
  const matchedPlayersInLatestValidationFile = await ValidationFileModel.findOne({
      "_id": await latestValidationFileId(),
      "players.cffNumber": cffNumber,
      "players.name": name.toLowerCase(),
      "players.surname": surname.toLowerCase(),
      "players.yearOfBirth": yearOfBirth,
      "players.gender": gender
    }, {'players.$': 1})
    return matchedPlayersInLatestValidationFile == null ? null : matchedPlayersInLatestValidationFile.players[0]
}

export async function saveCompetitionResults(competitionResults: CompetitionResult) {
  await new CompetitionResultsModel(competitionResults).save()
}

export async function updateCompetitionResult(competitionResults: CompetitionResult) {
  await save(competitionResults)
}

export async function savePlayers(results: Player[]) {
  const lowercase = results.map(p => { return {
    ...p,
    name: p.name.toLowerCase(),
    surname: p.surname.toLowerCase()
  }})
  await new ValidationFileModel({players: lowercase}).save()
}

export async function queryListById<T>(list: T[], id): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await list.id(id)
}

export async function deleteCompetition(code: string) {
  await CompetitionModel.deleteOne({ code: code });
}

export async function createCompetition(competition: Competition) {
  await new CompetitionModel(competition).save()
}

export async function getCompetitions(): Promise<Competition[]> {
  return CompetitionModel.find({});
}

export async function getCompetition(code: string): Promise<Competition> {
  return CompetitionModel.findOne({code: code})
}

export async function deleteAgeCategory(id: string) {
  await AgeCategoryModel.findByIdAndDelete(id)
}

export async function updateAgeCategory(ageCategory: AgeCategory) {
  await AgeCategoryModel.findByIdAndUpdate(ageCategory._id, ageCategory)
}

export async function createAgeCategory(ageCategory: AgeCategory) {
  await new AgeCategoryModel(ageCategory).save()
}

export async function getAgeCategories(): Promise<AgeCategory[]> {
  return AgeCategoryModel.find({})
}

export async function getAgeCategoryByCode(code: string): Promise<AgeCategory> {
  return AgeCategoryModel.findOne({code: code})
}


export async function saveClassifications(classifications: PlayerClassification[]) {
  await new ClassificationFileModel({classifications: classifications}).save()
}

export async function getApprovedCompetitionResultsInLast12Months(weapon: Weapon): Promise<CompetitionResult[]> {
  return CompetitionResultsModel.find({weapon: weapon, status: CompetitionStatus.approved}).populate('competition');
}

export async function getPlayerClassifications(): Promise<PlayerClassification[]> {
  const latestClassificationFile = await ClassificationFileModel.findOne().sort('-dateGenerated').limit(1)
  return latestClassificationFile.classifications
}

export async function save(entity) {
  entity.save()
}
