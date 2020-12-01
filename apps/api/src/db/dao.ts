import { CompetitionResults, ValidationFileRecord } from './schemas';

async function saveValidationFileRecords(results) {
    await ValidationFileRecord.insertMany(results);
}

async function saveCompetitionResults(competitionResults) {
  await new CompetitionResults(competitionResults).save()
}

export { saveValidationFileRecords, saveCompetitionResults }
