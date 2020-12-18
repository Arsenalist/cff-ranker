import { decorateResultsWithWarnings } from '@cff/csv';
import {
  CompetitionResults,
  CompetitionParticipant,
  Player,
  CompetitionStatus,
  Competition
} from '@cff/api-interfaces';
import { MultiMessageError } from '../multi-message-error';
import * as mygoose from './mygoose'

async function savePlayers(results: Player[]) {
    await mygoose.savePlayers(results)
}

async function validateCompetitionCode(code: string) {
  const competition: Competition = await mygoose.getCompetition(code)
  if (!competition) {
    throw new MultiMessageError([`The competition code "${code}" does not exist.`])
  }
}

async function saveCompetitionResults(competitionResults: CompetitionResults) {
  await validateCffNumber(competitionResults)
  await validateCompetitionCode(competitionResults.competitionShortName)
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

async function createCompetition(competition: Competition) {
  try {
    await mygoose.createCompetition(competition)
  } catch (e) {
    if (e.code && e.code === 11000) {
      throw new MultiMessageError([`Competition with code "${competition.code}" already exists.`])
    } else {
      throw e
    }
}
}

async function deleteCompetition(code: string) {
  await mygoose.deleteCompetition(code)
}

async function getCompetitions(): Promise<Competition[]> {
  return await mygoose.getCompetitions()
}


export { savePlayers, saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipant, saveParticipantInCompetition, createCompetition, getCompetitions, deleteCompetition }
