const csv = require('async-csv');
const fs = require('fs').promises;

async function loadValidationFile(fileName) {
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
  return await csv.parse(await readFile(fileName),{
    columns: (header) => {
      console.log("header is ", header);
      return header.map(column => columnToFieldMapping[column]);
    }
  });
}

async function readFile(fileName) {
  return await fs.readFile(fileName, 'utf-8');
}



export { loadValidationFile }
