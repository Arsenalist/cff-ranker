const mongoose = require('mongoose');

const validationFileRecordSchema = new mongoose.Schema({
  surname: {type: String, required: true},
  name: {type: String, required: true},
  yearOfBirth: {type: Number, required: true},
  gender: {type: String, enum: ['M', 'F', '']},
  club: {type: String, required: true},
  branch: {type: String, required: true, enum: ['ON', 'QC', 'SK', 'BC', 'MB', 'AB', 'NL', 'NT', 'NS', 'NU', 'NB', 'PE']},
  country: {type: String, required: true},
  cffNumber: {type: String, required: true},
  validated: {type: String, required: true, enum: ['y', 'n']}
});

const ValidationFileRecord = mongoose.model('ValidationFileRecord', validationFileRecordSchema);

export { ValidationFileRecord }
