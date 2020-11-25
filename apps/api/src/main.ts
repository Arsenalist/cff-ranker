import { Message } from '@cff/api-interfaces';

const express = require('express');
const fileUpload = require('express-fileupload');
const csv = require('async-csv');
const fs = require('fs').promises;


// setup express
const app = express();
app.use(fileUpload())

// open up mongodb
const mongoose = require('mongoose');
openMongo(mongoose)

const validationFileSchema = new mongoose.Schema({
  name: String,
  age: Number
});
const ValidationFileRecord = mongoose.model('ValidationFileRecord', validationFileSchema);


function openMongo(mongoose) {
  mongoose.connect('mongodb+srv://web:3Juqrtx2TWVZU4Fu@cluster0.a4h6o.mongodb.net/cffranker?retryWrites=true&w=majority', {useNewUrlParser: true});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Mongoose connection open")
  })
}

function validateFileIsProvided(req) {
  return req.files && Object.keys(req.files).length !== 0;
}

async function moveFileToDisk(file) {
  return await file.mv('./' + file.name, function(err) {
    if (err) {
      console.log("Error moving file")
      return false
    } else {
      return true
    }
  })
}

async function loadCsv(file) {
  const csvString = await fs.readFile('./' + file.name, 'utf-8');
  return await csv.parse(csvString, {columns: true});
}

app.post('/api/upload-validation-file', async (req, res) => {
  if (!validateFileIsProvided(req)) {
    return res.status(400).send('No files were uploaded.');
  }
  const validationFile = req.files.validationFile;
  if (!moveFileToDisk(validationFile)) {
    res.status(500).send("Move file failed");
  }
  const results = await loadCsv(validationFile)
  await saveValidationFileRecords(mongoose, results)
});

async function saveValidationFileRecords(mongoose, results) {
  for (let result of results) {
    const validationFileRecord = new ValidationFileRecord(result);
    await validationFileRecord.save(function (err, validationFileRecord) {
      if (err) return console.error(err);
      console.log("saved ", validationFileRecord)
    });
  }
}

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);
