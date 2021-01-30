import {
  findCompetitionResult,
  findCompetitionResults,
  findParticipant,
  saveCompetitionResults,
  saveParticipantInCompetitionResult,
  updateCompetitionResultStatus
} from './db/competition-result';
import { handleUpload } from './file-upload';
import { parseClassificationFileContents, parseCompetitionFileContents, parseValidationFileContents } from '@cff/csv';
import { handleErrors } from './middleware/errors';
import { openMongo } from './db/mongodb/mongo-connection';
import { readFile } from './file-io';
import {
  Competition,
  CompetitionParticipant,
  CompetitionResult,
  CompetitionStatus,
  Player,
  PlayerClassification,
  Weapon
} from '@cff/api-interfaces';
import { getCompetitionResultsInLast12Months, getPlayerClassifications } from './db/mygoose';
import { rank } from '@cff/ranking-algo';
import { createAgeCategory, deleteAgeCategory, getAgeCategories, updateAgeCategory } from './db/age-category';
import { createCompetition, deleteCompetition, getCompetitions } from './db/competition';
import { savePlayers } from './db/player';
import { savePlayerClassifications } from './db/player-classification';
import { AgeCategoryModel } from './db/schemas/age-category';
import { RankingJobModel } from './db/schemas/ranking-job';
import { RankingModel } from './db/schemas/ranking';

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const express = require('express')

const asyncHandler = require('express-async-handler');
const app = express();
app.use(require('express-fileupload')());
app.use(express.json());
app.use(express.urlencoded());

app.use(jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://cff.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://localhost:3000/api',
  issuer: 'https://cff.us.auth0.com/',
  algorithms: ['RS256']
}));

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
  const results: CompetitionResult = await parseCompetitionFileContents(contents);
  if (req.body && !req.body.code) {
    throw new Error("Competition code is required.")
  }
  results.competitionShortName = req.body.code
  res.send({
    rowCount: results.results.length,
    competition: await saveCompetitionResults(results)
  })
}));

app.post('/api/upload-classification-file', asyncHandler(async (req, res) => {
  const filePathOnDisk = await handleUpload(req, 'uploadedFile');
  const contents = await readFile(filePathOnDisk);
  const results: PlayerClassification[] = await parseClassificationFileContents(contents);
  await savePlayerClassifications(results);
  res.send({
    rowCount: results.length
  })
}));

app.get('/api/competition-results', asyncHandler(async (req, res) => {
  const contents: CompetitionResult[] = await findCompetitionResults();
  res.send(contents)
}));

app.get('/api/competition/:id', asyncHandler(async (req, res) => {
  const contents: CompetitionResult = await findCompetitionResult(req.params.id);
  res.send(contents)
}));

app.post('/api/competition/status', asyncHandler(async (req, res) => {
  await updateCompetitionResultStatus(req.body.competitionId, CompetitionStatus[req.body.status]);
  res.send()
}));

app.get('/api/participant/:competitionId/:participantId', asyncHandler(async (req, res) => {
  const contents: CompetitionParticipant = await findParticipant(req.params.competitionId, req.params.participantId);
  res.send(contents)
}));

app.post('/api/participant/:competitionId/:participantId', asyncHandler(async (req, res) => {
  const contents = await saveParticipantInCompetitionResult(req.params.competitionId, req.params.participantId, req.body);
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

app.delete('/api/competition',  asyncHandler(async (req, res) => {
  await deleteCompetition(req.body.code);
  res.send()
}));

app.get('/api/rankings/jobs', asyncHandler(async (req, res) => {
  res.send(await RankingJobModel.find({}).sort('-dateGenerated'))
}));

app.get('/api/rankings/jobs/:id', asyncHandler(async (req, res) => {
  res.send(await RankingModel.find({rankingJob: req.params.id}).populate("ageCategory").select("weapon ageCategory"))
}));

app.get('/api/rankings/ranking/:id', asyncHandler(async (req, res) => {
  res.send(await RankingModel.findById(req.params.id))
}));


app.get('/api/rank', asyncHandler(async (req, res) => {
  const playerClassifications = await getPlayerClassifications()
  const rankingJobModel = await new RankingJobModel({
    user: "zarar",
    dateGenerated: Date.now()
  }).save()

  const ageCategories = await AgeCategoryModel.find({})
  for (const key of Object.keys(Weapon)) {
    for(const ageCategory of ageCategories) {
      const allCompetitionResults = await getCompetitionResultsInLast12Months(Weapon[key])
      const ranking = rank(allCompetitionResults, playerClassifications);
      ranking.weapon = Weapon[key];
      ranking.ageCategory = ageCategory
      await new RankingModel({...ranking, rankingJob: rankingJobModel}).save()
    }
  }

  res.send({
    id: rankingJobModel._id
  })
}));

app.get('/api/age-category', asyncHandler(async (req, res) => {
  res.send(await getAgeCategories())
}));

app.put('/api/age-category', asyncHandler(async (req, res) => {
  await createAgeCategory(req.body)
  res.send()
}));

app.post('/api/age-category', asyncHandler(async (req, res) => {
  await updateAgeCategory(req.body)
  res.send()
}));

app.delete('/api/age-category', asyncHandler(async (req, res) => {
  await deleteAgeCategory(req.body._id)
  res.send()
}));


const port = process.env.port || 3333;
app.use(handleErrors);
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
