import { CompetitionResults, Player, PlayerClassification } from '@cff/api-interfaces';
import { CompetitionModel, CompetitionResultsModel, PlayerClassificationModel, PlayerModel } from './schemas';
import { mongoose } from '@typegoose/typegoose';
import { Competition } from '../../../../libs/api-interfaces/src/lib/api-interfaces';

export async function findCompetitionResults(): Promise<CompetitionResults[]> {
  return CompetitionResultsModel.find({});
}

export async function findCompetitionResult(id): Promise<CompetitionResults> {
  const objectId = mongoose.Types.ObjectId(id)
  return CompetitionResultsModel.findOne({ _id: objectId });
}

export async function findPlayerByCffNumber(cffNumber: string): Promise<Player> {
  return PlayerModel.findOne({ cffNumber: cffNumber });
}

export async function saveCompetitionResults(competitionResults: CompetitionResults) {
  const competition = await getCompetition(competitionResults.competitionShortName)
  competitionResults.competition = competition._id
  await new CompetitionResultsModel(competitionResults).save()
}

export async function updateCompetitionResults(competitionResults: CompetitionResults) {
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

export async function createCompetition(competition: Competition) {
  await new CompetitionModel(competition).save()
}

export async function getCompetitions(): Promise<Competition[]> {
  return CompetitionModel.find({});
}

export async function getCompetition(code: string): Promise<Competition> {
  return CompetitionModel.findOne({code: code})
}

export async function deleteCompetition(code: string) {
  await CompetitionModel.deleteOne({code: code})
}

export async function saveClassifications(classifications: PlayerClassification[]) {
  await PlayerClassificationModel.insertMany(classifications);
}

export async function save(entity) {
  entity.save()
}
