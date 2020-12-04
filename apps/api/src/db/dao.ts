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

export { saveValidationFileRecords, saveCompetitionResults, findCompetitionResults, findCompetitionResult }
