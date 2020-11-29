const fs = require('fs').promises;

async function readFile(fileName) {
  return await fs.readFile(fileName, 'utf-8');
}

export { readFile }
