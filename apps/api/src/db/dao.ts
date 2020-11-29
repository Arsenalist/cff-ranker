import { ValidationFileRecord } from './schemas'

async function saveValidationFileRecords(results) {
    await ValidationFileRecord.insertMany(results);
}

export { saveValidationFileRecords }
