import { savePlayers, saveCompetitionResults, findCompetitionResults, findCompetitionResult, findParticipant, saveParticipantInCompetition } from './db/dao'
import { handleUpload } from './file-upload'
import { parseValidationFileContents} from '@cff/csv'
import { handleErrors } from './middleware/errors'
import { openMongo } from './db/mongo-connection';
import { readFile } from './file-io';
import { parseCompetitionFileContents, decorateResultsWithWarnings } from '@cff/csv';
import { CompetitionResults, CompetitionParticipant, Player } from '@cff/api-interfaces';
const express = require('express')

const asyncHandler = require('express-async-handler');
const app = express();
app.use(require('express-fileupload')());
app.use(express.json());
app.use(express.urlencoded());
openMongo();

app.post('/api/upload-validation-file', asyncHandler(async (req, res) => {
    const filePathOnDisk = await handleUpload(req, 'uploadedFile');
    const contents = await readFile(filePathOnDisk);
    const results: Player[] = await parseValidationFileContents(contents);
    await savePlayers(results);
    res.send({
      rowCount: results.length
    })
}));

app.post('/api/upload-competition-file', asyncHandler(async (req, res) => {
  const filePathOnDisk = await handleUpload(req, 'uploadedFile');
  const contents = await readFile(filePathOnDisk);
  const results: CompetitionResults = await parseCompetitionFileContents(contents);
  const decoratedResults: CompetitionResults = decorateResultsWithWarnings(results);
  await saveCompetitionResults(decoratedResults);
  res.send({
    rowCount: results.results.length,
    competition: results
  })
}));

app.get('/api/competition', asyncHandler(async (req, res) => {
  const contents: CompetitionResults[] = await findCompetitionResults();
  res.send(contents)
}));

app.get('/api/competition/:id', asyncHandler(async (req, res) => {
  const contents: CompetitionResults = await findCompetitionResult(req.params.id);
  res.send(contents)
}));

app.get('/api/participant/:competitionId/:participantId', asyncHandler(async (req, res) => {
  const contents: CompetitionParticipant = await findParticipant(req.params.competitionId, req.params.participantId);
  res.send(contents)
}));

app.post('/api/participant/:competitionId/:participantId', asyncHandler(async (req, res) => {
  const contents = await saveParticipantInCompetition(req.params.competitionId, req.params.participantId, req.body);
  res.send(contents)
}));


const port = process.env.port || 3333;
app.use(handleErrors);
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
