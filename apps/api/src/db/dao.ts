import { decorateResultsWithWarnings, isCffNumberFormatValid } from '@cff/csv';
import {
  CompetitionParticipant,
  CompetitionResults,
  CompetitionStatus,
  PlayerClassification
} from '@cff/api-interfaces';
import { MultiMessageError } from '@cff/common';
import * as mygoose from './mygoose';
import { getCompetitionByCode } from './competition';

async function saveCompetitionResults(competitionResults: CompetitionResults) {
  await validateParticipants(competitionResults)
  const ageCategory = await mygoose.getAgeCategoryByCode(competitionResults.ageCategory as string);
  if (!ageCategory) {
    throw new MultiMessageError([`Age Category is invalid: ${competitionResults.ageCategory}`])
  }
  const competition = await getCompetitionByCode(competitionResults.competitionShortName)
  competitionResults.ageCategory = ageCategory
  competitionResults.competition = competition._id
  const decoratedResults = decorateResultsWithWarnings(competitionResults)
  const hasWarnings = decoratedResults.results.filter(p => p.warnings.length !== 0).length !== 0
  if (hasWarnings) {
    decoratedResults.status = CompetitionStatus.pending
  } else {
    decoratedResults.status = CompetitionStatus.approved
  }
  await mygoose.saveCompetitionResults(decoratedResults)
  return decoratedResults
}

async function validateParticipants(competitionResults: CompetitionResults) {
  for (const r of competitionResults.results) {
    if (!await mygoose.validateParticipant(r.cffNumber, r.name, r.surname, r.yearOfBirth, r.gender)) {
      throw new MultiMessageError([`Could not validate: ${r.cffNumber}, ${r.name}, ${r.surname}, ${r.yearOfBirth}, ${r.gender}.`])
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

async function saveParticipantInCompetitionResults(competitionResultId: string, participantId: string, data: Partial<CompetitionParticipant>) {
  if (!isCffNumberFormatValid(data.cffNumber)) {
    throw new MultiMessageError([`Invalid CFF# format: ${data.cffNumber}`])
  }
  let competition: CompetitionResults = await mygoose.findCompetitionResult(competitionResultId)
  const participant =  await mygoose.queryListById(competition.results, participantId)
  participant.cffNumber = data.cffNumber
  competition = decorateResultsWithWarnings(competition)
  await mygoose.save(competition)
}

export async function updateCompetitionResultsStatus(competitionId: string, status: CompetitionStatus) {
  const competitionResults = await findCompetitionResult(competitionId)
  competitionResults.status = status
  await mygoose.updateCompetitionResults(competitionResults)
}

async function saveClassifications(classifications: PlayerClassification[]) {
  return await mygoose.saveClassifications(classifications)
}


export { saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipant, saveParticipantInCompetitionResults, saveClassifications}
