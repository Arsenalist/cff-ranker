const csv = require('async-csv');
const fs = require('fs').promises; 


async function loadCsv(fileName) {
    const csvString = await fs.readFile(fileName, 'utf-8');
    return await csv.parse(csvString, {columns: true});
}

export { loadCsv } 