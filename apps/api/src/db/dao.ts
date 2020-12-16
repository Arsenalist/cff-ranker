import { decorateResultsWithWarnings } from '@cff/csv';
import { CompetitionResults, CompetitionParticipant, Player, CompetitionStatus } from '@cff/api-interfaces';
import { MultiMessageError } from '../multi-message-error';
import * as mygoose from './mygoose'

async function savePlayers(results: Player[]) {
    await mygoose.savePlayers(results)
}

async function saveCompetitionResults(competitionResults: CompetitionResults) {
  await validateCffNumber(competitionResults)
  await mygoose.saveCompetitionResults(competitionResults)
}

async function validateCffNumber(competitionResults: CompetitionResults) {
  for (const r of competitionResults.results) {
    if (r.cffNumber && !await mygoose.findPlayerByCffNumber(r.cffNumber)) {
      throw new MultiMessageError([`The CFF# ${r.cffNumber} was not found.`])
    }
  }
}

async function findCompetitionResults(): Promise<CompetitionResults[]> {
  return mygoose.findCompetitionResults()
}

async function findCompetitionResult(id): Promise<CompetitionResults> {
  return mygoose.findCompetitionResult(id)
}

async function findParticipant(competitionId: string, participantId: string): Promise<CompetitionParticipant> {
  const competition: CompetitionResults = await mygoose.findCompetitionResult(competitionId)
  return await mygoose.queryListById(competition.results, participantId)
}

async function saveParticipantInCompetition(competitionId: string, participantId: string, data: Partial<CompetitionParticipant>) {
  let competition: CompetitionResults = await mygoose.findCompetitionResult(competitionId)
  const participant =  await mygoose.queryListById(competition.results, participantId)
  participant.cffNumber = data.cffNumber
  competition = decorateResultsWithWarnings(competition)
  await mygoose.save(competition)
}

export async function updateCompetitionStatus(competitionId: string, status: CompetitionStatus) {
  const competitionResults = await findCompetitionResult(competitionId)
  competitionResults.status = status
  await mygoose.updateCompetitionResults(competitionResults)
}

export { savePlayers, saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipant, saveParticipantInCompetition }
