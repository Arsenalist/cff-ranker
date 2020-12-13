import { CompetitionResultsModel, PlayerModel } from './schemas';
import { decorateResultsWithWarnings } from '@cff/csv';
import { CompetitionResults, CompetitionParticipant, Player } from '@cff/api-interfaces';

async function savePlayers(results: Player[]) {
    await PlayerModel.insertMany(results);
}

async function saveCompetitionResults(competitionResults: CompetitionResults) {
  await new CompetitionResultsModel(competitionResults).save()
}

async function findCompetitionResults(): Promise<CompetitionResults[]> {
  return CompetitionResultsModel.find({});
}

async function findCompetitionResult(id): Promise<CompetitionResults> {
  return await CompetitionResultsModel.findById(id).exec()
}

async function findParticipant(competitionId: string, participantId: string): Promise<CompetitionParticipant> {
  const competition: CompetitionResults = await CompetitionResultsModel.findById(competitionId).exec()
  return await queryListById(competition.results, participantId)

}
async function saveParticipantInCompetition(competitionId: string, participantId: string, data: Partial<CompetitionParticipant>) {
  let competition: CompetitionResults = await CompetitionResultsModel.findById(competitionId).exec()
  const participant =  await queryListById(competition.results, participantId)
  participant.cffNumber = data.cffNumber
  competition = decorateResultsWithWarnings(competition)
  await save(competition)
}

function findPlayerByCffNumber(cffNumber: string): boolean {
  return false
}

async function queryListById<T>(list: T[], id): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await list.id(id)
}

async function save(entity) {
  entity.save()
}


export { savePlayers, saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipant, saveParticipantInCompetition }
