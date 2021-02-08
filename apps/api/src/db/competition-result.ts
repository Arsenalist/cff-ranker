import { decorateCompetitionResultWithWarnings, isCffNumberFormatValid } from '@cff/csv';
import { AgeCategory, CompetitionParticipant, CompetitionResult, CompetitionStatus } from '@cff/api-interfaces';
import { MultiMessageError } from '@cff/common';
import * as mygoose from './mygoose';
import { getCompetitionByCode } from './competition';

export async function saveCompetitionResults(competitionResult: CompetitionResult) {
  await validateParticipantsInCompetitionResult(competitionResult.results)
  const ageCategory = await mygoose.getAgeCategoryByCode(competitionResult.ageCategory as string);
  if (!ageCategory) {
    throw new MultiMessageError([`Age Category is invalid: ${competitionResult.ageCategory}`])
  }
  competitionResult.results = validateAges(competitionResult.results, ageCategory)
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
  await mygoose.saveCompetitionResults(decoratedResults)
  return decoratedResults
}

function removedPlayers(newPlayers: CompetitionParticipant[], players: CompetitionParticipant[]) {
  return players.filter(p => (
    newPlayers.filter(newP => JSON.stringify(p) === JSON.stringify(newP) ).length == 0
  )).map(p => `${p.name} ${p.surname}`).join(", ")

}

function validateAges(players: CompetitionParticipant[], ageCategory: AgeCategory): CompetitionParticipant[] {
  const newPlayers = players.filter(p => p.yearOfBirth >= ageCategory.yearOfBirth)
  if (newPlayers.length != players.length && newPlayers.length < 6) {
    throw new MultiMessageError([`${removedPlayers(newPlayers, players)} ineligible. Minimum number of players not met.`])
  }
  return newPlayers
}

export async function validateParticipantsInCompetitionResult(competitionParticipants: CompetitionParticipant[]) {
  for (const r of competitionParticipants) {
    if (r.cffNumber && !await mygoose.validateParticipant(r.cffNumber, r.name, r.surname, r.yearOfBirth, r.gender)) {
      throw new MultiMessageError([`Could not validate: ${r.cffNumber}, ${r.name}, ${r.surname}, ${r.yearOfBirth}, ${r.gender}.`])
    }
  }
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
