import { MultiMessageError } from '@cff/common';
import { CompetitionParticipant, CompetitionResult } from '@cff/api-interfaces';
import { isCffNumberFormatValid } from '@cff/common';

const csv = require('async-csv');

async function parseCompetitionFileContents(fileContents: string): Promise<CompetitionResult> {
  const { line1Values, line2Values } = parseHeaderRows(fileContents);
  const records: CompetitionParticipant[] = await parseResults(fileContents);
  const competition: CompetitionResult = {
    creator: line1Values[3],
    competitionType: line1Values[4],
    competitionDate: competitionStringDateToDate(line2Values[0]),
    weapon: line2Values[1],
    gender: line2Values[2],
    ageCategory: line2Values[3],
    tournamentName: line2Values[4],
    competitionShortName: line2Values[5],
    results: records
  };
  const errors = validateCompetition(competition);
  if (errors === undefined || errors.length == 0) {
    return competition;
  } else {
    throw new MultiMessageError(errors);
  }
}

function competitionStringDateToDate(date: string): Date {
  const parts = date.split("/")
  const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]))
  return isValidDate(d) ? d : null
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}


function decorateCompetitionResultWithWarnings(competition: CompetitionResult): CompetitionResult {
  for (const r of competition.results) {
    const warnings = []
    if (!r.cffNumber) {
      warnings.push({
        type: 'MISSING_CFF_NUMBER'
      })
    }
    r['warnings'] = warnings
  }
  return competition
}

function parseHeaderRows(fileContents: string) {
  const lines = fileContents.split(/\r?\n/);
  const line1Values = lines[0].split(/;/);
  const line2Values = lines[1].split(/;/);
  return { line1Values, line2Values };
}

function validateCompetition(competition: CompetitionResult) {
  const errors: string[] = []
  addMessageToErrorsListIfTestFails(errors, () => !!competition.competitionDate, "The competition date is not specified.")
  addMessageToErrorsListIfTestFails(errors, () => !!competition.weapon, "The weapon is not specified.")
  addMessageToErrorsListIfTestFails(errors, () => !!competition.gender, "The gender is not specified.")
  addMessageToErrorsListIfTestFails(errors, () => !!competition.ageCategory, "The age category is not specified.")
  addMessageToErrorsListIfTestFails(errors, () => !!competition.tournamentName, "The tournament name is not specified.")
  for (let i = 0; i < competition.results.length; i++) {
    const p = competition.results[i]
    const row = i + 1
    addMessageToErrorsListIfTestFails(errors, () => !!p.surname, `Line ${row}: Missing Surname.`)
    addMessageToErrorsListIfTestFails(errors, () => !!p.name, `Line ${row}: Missing Name.`)
    addMessageToErrorsListIfTestFails(errors, () => !!p.yearOfBirth, `Line ${row}: Missing YOB.`)
    addMessageToErrorsListIfTestFails(errors, () => !!p.gender, `Line ${row}: Missing Gender.`)
    addMessageToErrorsListIfTestFails(errors, () => !!p.country, `Line ${row}: Missing Country.`)
    addMessageToErrorsListIfTestFails(errors, () => !!p.branch, `Line ${row}: Missing Branch.`)
    addMessageToErrorsListIfTestFails(errors, () => !!p.club, `Line ${row}: Missing Club.`)
    addMessageToErrorsListIfTestFails(errors, () => !!p.rank, `Line ${row}: Missing Rank.`)
    addMessageToErrorsListIfTestFails(errors, () => !!p.validated, `Line ${row}: Missing Validated.`)
    addMessageToErrorsListIfTestFails(errors, () => {
      if (p.cffNumber && isCffNumberFormatValid(p.cffNumber)) {
        return true
      } else {
        return !p.cffNumber;
      }
    }, `Line ${row}: CFF# ${p.cffNumber} is of incorrect format.`)
  }
  const minimumNumberOfPlayersRequired = 6
  if (errors.length === 0 && competition.results.length < minimumNumberOfPlayersRequired) {
    errors.push("Not enough entrants.")
  }
  return errors
}

function addMessageToErrorsListIfTestFails(errors: string[], test: () => boolean, message: string): string[] {
  if (!test()) {
    errors.push(message)
  }
  return errors
}

async function parseResults(fileContents: string): Promise<CompetitionParticipant[]> {
  return await csv.parse(fileContents, {
    from_line: 3,
    delimiter: ';',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    on_record: (record, { lines }) => {
      const block1 = record[0].split(/,/);
      const block3 = record[2].split(/,/);
      const block4 = record[3].split(/,/);
      return {
        surname: block1[0],
        name: block1[1],
        yearOfBirth: block1[2],
        gender: block1[3],
        country: block1[4],
        cffNumber: block3[0],
        branch: block3[1],
        club: block3[2],
        rank: block4[0],
        validated: block4[1]
      }
    }
  });
}

export { parseCompetitionFileContents, decorateCompetitionResultWithWarnings };
