import { CompetitionResults, ValidationFileRecord } from './schemas';

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
  const competition = await CompetitionResults.findById(competitionId).exec()
  const participant = competition.results.id(participantId)
  participant.cffNumber = data.cffNumber
  await competition.save()
}


export { saveValidationFileRecords, saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipantId, saveParticipantInCompetition }
