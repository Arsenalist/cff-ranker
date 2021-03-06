const validationFileSpec = require('async-csv');

async function parseValidationFileContents(fileContents) {
  const columnToFieldMapping = {
    'Surname': 'surname',
    'Name': 'name',
    'YOB': 'yearOfBirth',
    'Gender': 'gender',
    'Club': 'club',
    'Branch': 'branch',
    'Country': 'country',
    'CFF Number': 'cffNumber',
    'Validated': 'validated'
  };
  return await validationFileSpec.parse(fileContents.trim(), {
    columns: (header) => {
      return header.map(column => columnToFieldMapping[column]);
    },
    skip_empty_lines: true,
    ignore_last_delimiters: true,
    trim: true
  });
}

export { parseValidationFileContents }
