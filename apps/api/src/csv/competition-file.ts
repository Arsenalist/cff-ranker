import { MultiMessageError } from '../multi-message-error';
const csv = require('async-csv');

async function parseCompetitionFileContents(fileContents) {
  const { line1Values, line2Values } = parseHeaderRows(fileContents);
  const records = await parseResults(fileContents);
  const competition = {
    creator: line1Values[3],
    competitionType: line1Values[4],
    competitionDate: line2Values[0],
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

function decorateResultsWithWarnings(competition) {
  for (const r of competition.results) {
    const warnings = []
    if (!r.cffNumber) {
      warnings.push({
        type: 'MISSING_CFF_NUMBER'
      })
      r['warnings'] = warnings
    }
  }
  return competition
}

function parseHeaderRows(fileContents) {
  const lines = fileContents.split(/\r?\n/);
  const line1Values = lines[0].split(/;/);
  const line2Values = lines[1].split(/;/);
  return { line1Values, line2Values };
}

function validateCompetition(competition) {
  const errors: string[] = []
  for (let i = 0; i < competition.results.length; i++) {
    const p = competition.results[i]
    const row = i + 1
    if (!p.surname) {
      errors.push(`Line ${row}: Missing Surname.`)
    }
    if (!p.name) {
      errors.push(`Line ${row}: Missing Name.`)
    }
    if (!p.yearOfBirth) {
      errors.push(`Line ${row}: Missing YOB.`)
    }
    if (!p.gender) {
      errors.push(`Line ${row}: Missing Gender.`)
    }
    if (!p.country) {
      errors.push(`Line ${row}: Missing Country.`)
    }
    if (!p.branch) {
      errors.push(`Line ${row}: Missing Branch.`)
    }
    if (!p.club) {
      errors.push(`Line ${row}: Missing Club.`)
    }
    if (!p.rank) {
      errors.push(`Line ${row}: Missing Rank.`)
    }
    if (!p.rank) {
      errors.push(`Line ${row}: Missing Validated.`)
    }
  }
  return errors
}

async function parseResults(fileContents) {
  return await csv.parse(fileContents, {
    from_line: 3,
    delimiter: ';',
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

export { parseCompetitionFileContents, decorateResultsWithWarnings };
