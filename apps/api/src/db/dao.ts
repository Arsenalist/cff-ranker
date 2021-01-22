import { decorateResultsWithWarnings, isCffNumberFormatValid } from '@cff/csv';
import {
  AgeCategory,
  Competition,
  CompetitionParticipant,
  CompetitionResults,
  CompetitionStatus,
  Player,
  PlayerClassification
} from '@cff/api-interfaces';
import { MultiMessageError } from '@cff/common';
import * as mygoose from './mygoose';

async function savePlayers(results: Player[]) {
    await mygoose.savePlayers(results)
}

async function getCompetitionByCode(code: string): Promise<Competition> {
  const competition: Competition = await mygoose.getCompetition(code)
  if (!competition) {
    throw new MultiMessageError([`The competition code "${code}" does not exist.`])
  }
  return competition
}

async function saveCompetitionResults(competitionResults: CompetitionResults) {
  await validateCffNumber(competitionResults)
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

async function validateCffNumber(competitionResults: CompetitionResults) {
  for (const r of competitionResults.results) {
    if (r.cffNumber && !await mygoose.findPlayerByCffNumber(r.cffNumber, r.name, r.surname, r.yearOfBirth, r.gender)) {
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
  if (!isCffNumberFormatValid(data.cffNumber)) {
    throw new MultiMessageError([`Invalid CFF# format: ${data.cffNumber}`])
  }
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

async function saveClassifications(classifications: PlayerClassification[]) {
  return await mygoose.saveClassifications(classifications)
}

export async function updateAgeCategory(ageCategory: AgeCategory) {
  await mygoose.updateAgeCategory(ageCategory)
}

export async function deleteAgeCategory(code: string) {
  await mygoose.deleteAgeCategory(code)
}

export async function createAgeCategory(ageCategory: AgeCategory) {
  const existing = await mygoose.getAgeCategoryByCode(ageCategory.code)
  if (existing) {
    throw new MultiMessageError([`Code already exists: ${ageCategory.code}`])
  }
  await mygoose.createAgeCategory(ageCategory)
}

async function getAgeCategories(): Promise<AgeCategory[]> {
  return mygoose.getAgeCategories()
}


export { savePlayers, saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipant, saveParticipantInCompetition, createCompetition, getCompetitions, deleteCompetition, saveClassifications, getAgeCategories }
