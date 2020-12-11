import { CompetitionResults, ValidationFileRecord } from './schemas';
import { decorateResultsWithWarnings } from '@cff/csv';
import { Competition, CompetitionParticipant, Player } from '@cff/api-interfaces';

async function saveValidationFileRecords(results: Player[]) {
    await ValidationFileRecord.insertMany(results);
}

async function saveCompetitionResults(competitionResults: Competition) {
  await new CompetitionResults(competitionResults).save()
}

async function findCompetitionResults(): Promise<Competition[]> {
  return await CompetitionResults.find({})
}

async function findCompetitionResult(id): Promise<Competition> {
  return await CompetitionResults.findById(id).exec()
}

async function findParticipantId(competitionId: string, participantId: string): Promise<CompetitionParticipant> {
  const competition: Competition = await CompetitionResults.findById(competitionId).exec()
  return await competition.results.id(participantId)
}
async function saveParticipantInCompetition(competitionId: string, participantId: string, data: Partial<CompetitionParticipant>) {
  let competition: Competition = await CompetitionResults.findById(competitionId).exec()
  const participant = competition.results.id(participantId)
  participant.cffNumber = data.cffNumber
  competition = decorateResultsWithWarnings(competition)
  await competition.save()
}


export { saveValidationFileRecords, saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipantId, saveParticipantInCompetition }
