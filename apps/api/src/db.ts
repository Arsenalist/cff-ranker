import { ValidationFileRecord } from './db/schemas'

async function saveValidationFileRecords(results) {
    await ValidationFileRecord.insertMany(results);
}

export { saveValidationFileRecords }
