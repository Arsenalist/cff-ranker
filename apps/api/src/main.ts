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
  saveClassifications
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
import { calculateForce, calculatePointsForParticipant, filterCompetitionResults } from '@cff/ranking-algo';

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
  const forceMap = {}
  for (const c of allCompetitionResults) {
    forceMap[c.competitionShortName] = calculateForce(c.results, playerClassifications, c.ageCategory)
  }
  console.log("FFF is ", forceMap)
  for (const p of playerClassifications) {
    const cff = filterCompetitionResults(allCompetitionResults, p, CompetitionZone.cff)
    const regionalEast = filterCompetitionResults(allCompetitionResults, p, CompetitionZone.regionalEast)
    const regionalWest = filterCompetitionResults(allCompetitionResults, p, CompetitionZone.regionalWest)
    const national = filterCompetitionResults(allCompetitionResults, p, CompetitionZone.national)
    const all = cff.concat(regionalEast).concat(regionalWest).concat(national)
    const playerPointsMap = pointsMap(p, forceMap, all)
/*    console.log(`regional west points for ${p.cffNumber}`, collectPoints(p, regionalWest, playerPointsMap))
    console.log(`regional east points for ${p.cffNumber}`, collectPoints(p, regionalEast, playerPointsMap))
    console.log(`cff points for ${p.cffNumber}`, collectPoints(p, cff, playerPointsMap))
    console.log(`national points for ${p.cffNumber}`, collectPoints(p, national, playerPointsMap))*/
  }
  res.send(forceMap)
}));

function collectPoints(player: PlayerClassification, results: CompetitionResults[], playerPointsMap): number {
  return results.reduce((acc, value) => {
    return acc + playerPointsMap[player.cffNumber + value.competitionShortName]
  }, 0)
}

function pointsMap(player: PlayerClassification, forceMap, competitionResults: CompetitionResults[]) {
  const map = {}
  for(const c of competitionResults) {
    map[c.competitionShortName + player.cffNumber] = calculatePointsForParticipant(player, getPlaceForPlayer(player, c.results), forceMap[c.competitionShortName], c.results.length)
  }
  return map
}

function getPlaceForPlayer(player: PlayerClassification, results: CompetitionParticipant[]): number {
  const p = results.filter(r => r.cffNumber === player.cffNumber)
  return p.length > 0 ? p[0].rank : null
}


const port = process.env.port || 3333;
app.use(handleErrors);
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
