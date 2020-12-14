import { CompetitionResultsModel, PlayerModel } from './schemas';
import { decorateResultsWithWarnings } from '@cff/csv';
import { CompetitionResults, CompetitionParticipant, Player } from '@cff/api-interfaces';
import { MultiMessageError } from '../multi-message-error';

async function savePlayers(results: Player[]) {
    await PlayerModel.insertMany(results);
}

async function saveCompetitionResults(competitionResults: CompetitionResults) {
  await validateCffNumber(competitionResults)
  await new CompetitionResultsModel(competitionResults).save()
}

async function validateCffNumber(competitionResults: CompetitionResults) {
  for (const r of competitionResults.results) {
    if (r.cffNumber && !await findPlayerByCffNumber(r.cffNumber)) {
      throw new MultiMessageError([`The CFF# ${r.cffNumber} was not found.`])
    }
  }
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

async function findPlayerByCffNumber(cffNumber: string): Promise<Player> {
  return PlayerModel.findOne({ cffNumber: cffNumber });
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
