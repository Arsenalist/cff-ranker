import {
  AgeCategory,
  Competition,
  CompetitionResult,
  Player,
  PlayerClassification,
  Weapon
} from '@cff/api-interfaces';
import {
  AgeCategoryModel,
  CompetitionModel,
  CompetitionResultsModel,
  PlayerClassificationModel,
  PlayerModel
} from './schemas';
import { mongoose } from '@typegoose/typegoose';

export async function findCompetitionResults(): Promise<CompetitionResult[]> {
  return CompetitionResultsModel.find({}).populate('ageCategory competition');
}

export async function findCompetitionResult(id): Promise<CompetitionResult> {
  const objectId = mongoose.Types.ObjectId(id)
  return CompetitionResultsModel.findOne({ _id: objectId }).populate('ageCategory competition');
}

export async function validateParticipant(cffNumber: string, name: string, surname: string, yearOfBirth: number, gender: string): Promise<Player> {
  return PlayerModel.findOne({
    cffNumber: cffNumber,
    name: name,
    surname: surname,
    yearOfBirth: yearOfBirth,
    gender: gender
  });
}

export async function saveCompetitionResults(competitionResults: CompetitionResult) {
  await new CompetitionResultsModel(competitionResults).save()
}

export async function updateCompetitionResult(competitionResults: CompetitionResult) {
  await save(competitionResults)
}

export async function savePlayers(results: Player[]) {
  await PlayerModel.insertMany(results);
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
  await PlayerClassificationModel.insertMany(classifications);
}

export async function getCompetitionResultsInLast12Months(weapon: Weapon): Promise<CompetitionResult[]> {
  return CompetitionResultsModel.find({weapon: weapon}).populate('competition');
}

export async function getPlayerClassifications(): Promise<PlayerClassification[]> {
  return PlayerClassificationModel.find({});
}

export async function save(entity) {
  entity.save()
}
