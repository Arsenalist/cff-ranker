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
    'CFF#': 'cffNumber',
    'Validated': 'validated'
  };
  return await validationFileSpec.parse(fileContents, {
    columns: (header) => {
      return header.map(column => columnToFieldMapping[column]);
    }
  });
}

export { parseValidationFileContents }
