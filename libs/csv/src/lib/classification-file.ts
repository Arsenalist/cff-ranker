const asyncCsv = require('async-csv');
import { PlayerClassification } from '@cff/api-interfaces';

export async function parseClassificationFileContents(fileContents: string): Promise<PlayerClassification[]> {
  const columnToFieldMapping = {
    'Wpn ': 'weapon',
    'Class': 'class',
    'Lastname': 'lastName',
    'Firstname': 'firstName',
    'Club': 'club',
    'CFF Licence': 'cffNumber',
    'Prov': 'province'
  };
  return await asyncCsv.parse(fileContents, {
    columns: (header) => {
      return header.map(column => columnToFieldMapping[column]);
    },
    skip_empty_lines: true,
    ignore_last_delimiters: true,
    trim: true
  });

}
