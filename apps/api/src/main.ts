import { saveValidationFileRecords, saveCompetitionResults } from './db/dao'
import { handleUpload } from './file-upload'
import { parseValidationFileContents, parseCompetitionFileContents } from './csv'
import { handleErrors } from './middleware/errors'
import { openMongo } from './db/mongo-connection';
import { readFile } from './file-io';

const asyncHandler = require('express-async-handler');
const app = require('express')();
app.use(require('express-fileupload')());
openMongo();

app.post('/api/upload-validation-file', asyncHandler(async (req, res) => {
    const filePathOnDisk = await handleUpload(req, 'uploadedFile');
    const contents = await readFile(filePathOnDisk);
    const results = await parseValidationFileContents(contents);
    await saveValidationFileRecords(results);
    res.send({
      rowCount: results.length
    })
}));

app.post('/api/upload-competition-file', asyncHandler(async (req, res) => {
  const filePathOnDisk = await handleUpload(req, 'uploadedFile');
  const contents = await readFile(filePathOnDisk);
  const results = await parseCompetitionFileContents(contents);
  await saveCompetitionResults(results);
  res.send({
    rowCount: results.results.length
  })
}));


const port = process.env.port || 3333;
app.use(handleErrors);
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
