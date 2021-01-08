import {
  createCompetition,
  deleteCompetition,
  findCompetitionResult,
  findCompetitionResults,
  findParticipant, getCompetitions,
  saveCompetitionResults,
  saveParticipantInCompetition,
  savePlayers,
  updateCompetitionStatus,
  saveClassifications, getAgeCategories, updateAgeCategory, deleteAgeCategory, createAgeCategory
} from './db/dao';
import { handleUpload } from './file-upload';
import { decorateResultsWithWarnings, parseCompetitionFileContents, parseValidationFileContents, parseClassificationFileContents } from '@cff/csv';
import { handleErrors } from './middleware/errors';
import { openMongo } from './db/mongo-connection';
import { readFile } from './file-io';
import {
  Competition,
  CompetitionParticipant,
  CompetitionResults,
  CompetitionStatus, CompetitionZone,
  Player,
  PlayerClassification
} from '@cff/api-interfaces';
import { getCompetitionResultsInLast12Months, getPlayerClassifications } from './db/mygoose';
import { rank } from '@cff/ranking-algo';

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const express = require('express')

const asyncHandler = require('express-async-handler');
const app = express();
app.use(require('express-fileupload')());
app.use(express.json());
app.use(express.urlencoded());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://cff.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://localhost:3000/api',
  issuer: 'https://cff.us.auth0.com/',
  algorithms: ['RS256']
});

openMongo();

app.post('/api/upload-validation-file', checkJwt, asyncHandler(async (req, res) => {
    const filePathOnDisk = await handleUpload(req, 'uploadedFile');
    const contents = await readFile(filePathOnDisk);
    const results: Player[] = await parseValidationFileContents(contents);
    await savePlayers(results);
    res.send({
      rowCount: results.length
    })
}));

app.post('/api/upload-competition-file', checkJwt, asyncHandler(async (req, res) => {
  const filePathOnDisk = await handleUpload(req, 'uploadedFile');
  const contents = await readFile(filePathOnDisk);
  const results: CompetitionResults = await parseCompetitionFileContents(contents);
  const decoratedResults: CompetitionResults = decorateResultsWithWarnings(results);
  if (req.body && !req.body.code) {
    throw new Error("Competition code is required.")
  }
  results.competitionShortName = req.body.code
  await saveCompetitionResults(decoratedResults);
  res.send({
    rowCount: results.results.length,
    competition: results
  })
}));

app.post('/api/upload-classification-file', checkJwt, asyncHandler(async (req, res) => {
  const filePathOnDisk = await handleUpload(req, 'uploadedFile');
  const contents = await readFile(filePathOnDisk);
  const results: PlayerClassification[] = await parseClassificationFileContents(contents);
  await saveClassifications(results);
  res.send({
    rowCount: results.length
  })
}));

app.get('/api/competition-results', checkJwt, asyncHandler(async (req, res) => {
  const contents: CompetitionResults[] = await findCompetitionResults();
  res.send(contents)
}));

app.get('/api/competition/:id', checkJwt, asyncHandler(async (req, res) => {
  const contents: CompetitionResults = await findCompetitionResult(req.params.id);
  res.send(contents)
}));

app.post('/api/competition/status', checkJwt, asyncHandler(async (req, res) => {
  await updateCompetitionStatus(req.body.competitionId, CompetitionStatus[req.body.status]);
  res.send()
}));

app.get('/api/participant/:competitionId/:participantId', checkJwt, asyncHandler(async (req, res) => {
  const contents: CompetitionParticipant = await findParticipant(req.params.competitionId, req.params.participantId);
  res.send(contents)
}));

app.post('/api/participant/:competitionId/:participantId', checkJwt, asyncHandler(async (req, res) => {
  const contents = await saveParticipantInCompetition(req.params.competitionId, req.params.participantId, req.body);
  res.send(contents)
}));

app.put('/api/competition', checkJwt, asyncHandler(async (req, res) => {
  await createCompetition(req.body)
  res.send()
}));

app.get('/api/competition', checkJwt, asyncHandler(async (req, res) => {
  const contents: Competition[] = await getCompetitions();
  res.send(contents)
}));

app.delete('/api/competition', checkJwt,  asyncHandler(async (req, res) => {
  await deleteCompetition(req.body.code);
  res.send()
}));

app.get('/api/rank', asyncHandler(async (req, res) => {
  const playerClassifications = await getPlayerClassifications()
  const allCompetitionResults = await getCompetitionResultsInLast12Months()
  res.send(rank(allCompetitionResults, playerClassifications))
}));

app.get('/api/age-category',  asyncHandler(async (req, res) => {
  res.send(await getAgeCategories())
}));

app.put('/api/age-category', checkJwt, asyncHandler(async (req, res) => {
  await createAgeCategory(req.body)
  res.send()
}));

app.post('/api/age-category', checkJwt, asyncHandler(async (req, res) => {
  await updateAgeCategory(req.body)
  res.send()
}));

app.delete('/api/age-category', checkJwt, asyncHandler(async (req, res) => {
  await deleteAgeCategory(req.body._id)
  res.send()
}));


const port = process.env.port || 3333;
app.use(handleErrors);
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
