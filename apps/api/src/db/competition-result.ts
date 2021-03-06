import { decorateCompetitionResultWithWarnings, isCffNumberFormatValid } from '@cff/csv';
import { CompetitionParticipant, CompetitionResult, CompetitionStatus } from '@cff/api-interfaces';
import { minimum_age_in_competition, minimum_players_in_competition, MultiMessageError } from '@cff/common';
import * as mygoose from './mygoose';
import { getCompetitionByCode } from './competition';
import { getCompetitionResultsInLastYear } from './mygoose';

export async function saveCompetitionResults(competitionResult: CompetitionResult) {
  const errors = await validateParticipantsInCompetitionResult(competitionResult.results)
  const ageCategory = await mygoose.getAgeCategoryByCode(competitionResult.ageCategory as string);
  if (!ageCategory) {
    errors.push(`Age Category is invalid: ${competitionResult.ageCategory}`)
  }
  if (errors.length !== 0) {
    throw new MultiMessageError(errors)
  }
  const maxYearOfBirth = new Date().getFullYear() - minimum_age_in_competition;
  competitionResult.results = validateAges(competitionResult.results, ageCategory.yearOfBirth, maxYearOfBirth, minimum_players_in_competition)
  const competition = await getCompetitionByCode(competitionResult.competitionShortName)
  competitionResult.ageCategory = ageCategory
  competitionResult.competition = competition._id
  const decoratedResults = decorateCompetitionResultWithWarnings(competitionResult)
  const hasWarnings = decoratedResults.results.filter(p => p.warnings.length !== 0).length !== 0
  if (hasWarnings) {
    decoratedResults.status = CompetitionStatus.pending
  } else {
    decoratedResults.status = CompetitionStatus.approved
  }
  const existing = await getCompetitionResultsInLastYear(competition.code);
  if (existing) {
    await mygoose.deleteCompetitionResult(existing._id)
  }
  await mygoose.saveCompetitionResults(decoratedResults)
  return decoratedResults
}

function removedPlayers(newPlayers: CompetitionParticipant[], players: CompetitionParticipant[]) {
  return players.filter(p => (
    newPlayers.filter(newP => JSON.stringify(p) === JSON.stringify(newP) ).length == 0
  )).map(p => `${p.name} ${p.surname}`).join(", ")

}

function validateAges(players: CompetitionParticipant[], minYearOfBirth: number, maxYearOfBirth: number, minPlayers: number): CompetitionParticipant[] {
  const newPlayers = players.filter(p => p.yearOfBirth >= minYearOfBirth && p.yearOfBirth <= maxYearOfBirth)
  if (newPlayers.length != players.length && newPlayers.length < minPlayers) {
    throw new MultiMessageError([`${removedPlayers(newPlayers, players)} ineligible. Minimum number of players not met.`])
  }
  return newPlayers
}

export async function validateParticipantsInCompetitionResult(competitionParticipants: CompetitionParticipant[]): Promise<string[]> {
  const errorList: string[] = []
  for (const r of competitionParticipants) {
    if (r.cffNumber && !await mygoose.validateParticipant(r.cffNumber, r.name, r.surname, r.yearOfBirth, r.gender)) {
      errorList.push(`Could not validate: ${r.cffNumber}, ${r.name}, ${r.surname}, ${r.yearOfBirth}, ${r.gender}.`)
    }
  }
  return errorList
}

export async function findCompetitionResults(): Promise<CompetitionResult[]> {
  return mygoose.findCompetitionResults()
}

export async function findCompetitionResult(id): Promise<CompetitionResult> {
  return mygoose.findCompetitionResult(id)
}

export async function findParticipant(competitionId: string, participantId: string): Promise<CompetitionParticipant> {
  const competition: CompetitionResult = await mygoose.findCompetitionResult(competitionId)
  return await mygoose.queryListById(competition.results, participantId)
}

export async function saveParticipantInCompetitionResult(competitionResultId: string, participantId: string, data: Partial<CompetitionParticipant>) {
  if (!data.cffNumber) {
    throw new MultiMessageError([`CFF# cannot be blank`])
  }
  if (!isCffNumberFormatValid(data.cffNumber)) {
    throw new MultiMessageError([`Invalid CFF# format: ${data.cffNumber}`])
  }
  let competition: CompetitionResult = await mygoose.findCompetitionResult(competitionResultId)
  const participant =  await mygoose.queryListById(competition.results, participantId)
  participant.cffNumber = data.cffNumber
  competition = decorateCompetitionResultWithWarnings(competition)
  await mygoose.save(competition)
}

export async function updateCompetitionResultStatus(competitionId: string, status: CompetitionStatus) {
  const competitionResult = await findCompetitionResult(competitionId)
  competitionResult.status = status
  await mygoose.updateCompetitionResult(competitionResult)
}
