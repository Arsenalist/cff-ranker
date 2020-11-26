import { openMongo, saveValidationFileRecords } from './db'
import { handleUpload } from './file-upload'
import { loadCsv } from './csv'

const app = require('express')();
app.use(require('express-fileupload')())
openMongo()

app.post('/api/upload-validation-file', async (req, res) => {
  const filePathOnDisk = await handleUpload(req, 'validationFile')
  const results = await loadCsv(filePathOnDisk)
  await saveValidationFileRecords(results)
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
