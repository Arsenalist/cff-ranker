
import { Message } from '@cff/api-interfaces';

const express = require('express');
const fileUpload = require('express-fileupload');
const csv = require('csv-parser')
const fs = require('fs')


const app = express();
app.use(fileUpload())

const greeting: Message = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

app.post('/api/upload-validation-file', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const sampleFile = req.files.validationFile;
  
  sampleFile.mv('./' + sampleFile.name, function(err) {
    if (err) {
      return res.status(500).send(err);
    } else {
      const results = [];
      fs.createReadStream('./' + sampleFile.name)
        .pipe(csv())
        .on('data', (data) => {
          results.push(data)
        })
        .on('end', () => {
          console.log(results);
          const mongoose = require('mongoose');
          mongoose.connect('mongodb+srv://web:3Juqrtx2TWVZU4Fu@cluster0.a4h6o.mongodb.net/cffranker?retryWrites=true&w=majority', {useNewUrlParser: true});
          const db = mongoose.connection;
          db.on('error', console.error.bind(console, 'connection error:'));
          db.once('open', function() {
            console.log("opened the file")
            const validationFileSchema = new mongoose.Schema({
              name: String,
              age: Number
            });
            for (let result of results) {
              console.log("in for loop")
              const ValidationFileRecord = mongoose.model('ValidationFileRecord', validationFileSchema);
              const validationFileRecord = new ValidationFileRecord(result);
              validationFileRecord.save(function (err, validationFileRecord) {
                if (err) return console.error(err); 
                console.log("saved ", validationFileRecord)
              });
            }
          });

        });
        return res.send('File uploaded!');
  }});
});



const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);
