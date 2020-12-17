import {
  createCompetition,
  deleteCompetition,
  findCompetitionResult,
  findCompetitionResults,
  findParticipant, getCompetitions,
  saveCompetitionResults,
  saveParticipantInCompetition,
  savePlayers,
  updateCompetitionStatus
} from './db/dao';
import { handleUpload } from './file-upload';
import { decorateResultsWithWarnings, parseCompetitionFileContents, parseValidationFileContents } from '@cff/csv';
import { handleErrors } from './middleware/errors';
import { openMongo } from './db/mongo-connection';
import { readFile } from './file-io';
import {
  Competition,
  CompetitionParticipant,
  CompetitionResults,
  CompetitionStatus,
  Player
} from '@cff/api-interfaces';

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

app.get('/api/competition-results', asyncHandler(async (req, res) => {
  const contents: CompetitionResults[] = await findCompetitionResults();
  res.send(contents)
}));

app.get('/api/competition/:id', asyncHandler(async (req, res) => {
  const contents: CompetitionResults = await findCompetitionResult(req.params.id);
  res.send(contents)
}));

app.post('/api/competition/status', asyncHandler(async (req, res) => {
  await updateCompetitionStatus(req.body.competitionId, CompetitionStatus[req.body.status]);
  res.send()
}));

app.get('/api/participant/:competitionId/:participantId', asyncHandler(async (req, res) => {
  const contents: CompetitionParticipant = await findParticipant(req.params.competitionId, req.params.participantId);
  res.send(contents)
}));

app.post('/api/participant/:competitionId/:participantId', asyncHandler(async (req, res) => {
  const contents = await saveParticipantInCompetition(req.params.competitionId, req.params.participantId, req.body);
  res.send(contents)
}));

app.put('/api/competition', asyncHandler(async (req, res) => {
  await createCompetition(req.body)
  res.send()
}));

app.get('/api/competition', asyncHandler(async (req, res) => {
  const contents: Competition[] = await getCompetitions();
  res.send(contents)
}));

app.delete('/api/competition', asyncHandler(async (req, res) => {
  await deleteCompetition(req.body.code);
  res.send()
}));

const port = process.env.port || 3333;
app.use(handleErrors);
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
