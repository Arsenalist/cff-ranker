import { saveValidationFileRecords } from './db'
import { handleUpload } from './file-upload'
import { loadValidationFile } from './csv'
import { handleErrors } from './errors'
import { openMongo } from './db/mongo-connection';
const asyncHandler = require('express-async-handler');


const app = require('express')();
app.use(require('express-fileupload')());
openMongo();

app.post('/api/upload-validation-file', asyncHandler(async (req, res) => {
    const filePathOnDisk = await handleUpload(req, 'validationFile');
    const results = await loadValidationFile(filePathOnDisk);
    await saveValidationFileRecords(results);
    res.send("ok")
}));

const port = process.env.port || 3333;
app.use(handleErrors);
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
