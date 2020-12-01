const csv = require('async-csv');

async function parseValidationFileContents(fileContents) {
  const columnToFieldMapping = {
    'Surname': 'surname',
    'Name': 'name',
    'YOB': 'yearOfBirth',
    'Gender': 'gender',
    'Club': 'club',
    'Branch': 'branch',
    'Country': 'country',
    'CFF#': 'cffNumber',
    'Validated': 'validated'
  };
  return await csv.parse(fileContents, {
    columns: (header) => {
      return header.map(column => columnToFieldMapping[column]);
    }
  });
}

async function parseCompetitionFileContents(fileContents) {
  const { line1Values, line2Values } = parseHeaderRows(fileContents);
  const records = await parseResults(fileContents);

  return (
    {
      creator: line1Values[3],
      competitionType: line1Values[4],
      competitionDate: line2Values[0],
      weapon: line2Values[1],
      gender: line2Values[2],
      level: line2Values[3],
      tournamentName: line2Values[4],
      competitionShortName: line2Values[5],
      results: records
    }
  )
}

function parseHeaderRows(fileContents) {
  const lines = fileContents.split(/\r?\n/);
  const line1Values = lines[0].split(/;/);
  const line2Values = lines[1].split(/;/);
  return { line1Values, line2Values };
}

async function parseResults(fileContents) {
  const records = await csv.parse(fileContents, {
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
      };
    }
  });
  return records;
}

export { parseValidationFileContents, parseCompetitionFileContents }
