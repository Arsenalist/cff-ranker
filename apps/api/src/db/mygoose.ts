import { CompetitionResults, Player } from '@cff/api-interfaces';
import { CompetitionResultsModel, PlayerModel } from './schemas';
import { mongoose } from '@typegoose/typegoose';

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

export async function save(entity) {
  entity.save()
}
