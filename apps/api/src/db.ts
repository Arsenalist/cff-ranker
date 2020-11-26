const mongoose = require('mongoose');
const validationFileSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const ValidationFileRecord = mongoose.model('ValidationFileRecord', validationFileSchema);

export function openMongo() {
  mongoose.connect('mongodb+srv://web:3Juqrtx2TWVZU4Fu@cluster0.a4h6o.mongodb.net/cffranker?retryWrites=true&w=majority', {useNewUrlParser: true});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Mongoose connection open")
  })
}


export async function saveValidationFileRecords(results) {
    for (let result of results) {
      const validationFileRecord = new ValidationFileRecord(result);
      await validationFileRecord.save(function (err, validationFileRecord) {
        if (err) return console.error(err);
        console.log("saved ", validationFileRecord)
      });
    }
  }