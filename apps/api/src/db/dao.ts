import { CompetitionResults, ValidationFileRecord } from './schemas';
import { decorateResultsWithWarnings } from '../csv/competition-file';

async function saveValidationFileRecords(results) {
    await ValidationFileRecord.insertMany(results);
}

async function saveCompetitionResults(competitionResults) {
  await new CompetitionResults(competitionResults).save()
}

async function findCompetitionResults() {
  return await CompetitionResults.find({})
}

async function findCompetitionResult(id) {
  return await CompetitionResults.findById(id).exec()
}

async function findParticipantId(competitionId, participantId) {
  const competition = await CompetitionResults.findById(competitionId).exec()
  return await competition.results.id(participantId)
}
async function saveParticipantInCompetition(competitionId, participantId, data) {
  let competition = await CompetitionResults.findById(competitionId).exec()
  const participant = competition.results.id(participantId)
  console.log("part before ", competition.results[3])
  participant.cffNumber = data.cffNumber
  competition = decorateResultsWithWarnings(competition)
  console.log("part after ", competition.results[3])
  await competition.save()
}


export { saveValidationFileRecords, saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipantId, saveParticipantInCompetition }
