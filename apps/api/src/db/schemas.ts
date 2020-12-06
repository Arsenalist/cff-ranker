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

const participantWarning = new mongoose.Schema({
  type: {type: String, required: true},
});

const competitionParticipant = new mongoose.Schema({
  surname: {type: String, required: true},
  name: {type: String, required: true},
  yearOfBirth: {type: Number, required: true},
  gender: {type: String, enum: ['M', 'F', '']},
  country: {type: String, required: true},
  cffNumber: {type: String},
  branch: {type: String, required: true},
  club: {type: String, required: true},
  rank:  {type: Number },
  validated: {type: String, required: true},
  warnings: {type: [participantWarning]}
});

const competitionFileRecordSchema = new mongoose.Schema({
  creator: {type: String, required: true},
  competitionType: {type: String, required: true},
  competitionDate: {type: String, required: true},
  weapon: {type: String, required: true, lowercase: true, enum: ['fleuret', 'epee', 'sabre']},
  gender: {type: String, enum: ['M', 'F', '']},
  ageCategory: {type: String, required: true, lowercase: true, enum: ['cadet', 'junior', 'senior', 'veterans', 'minime', 'benjamin','pupille', 'poussin', 'u23']},
  tournamentName: {type: String, required: true},
  competitionShortName: {type: String, required: true},
  results: {type: [competitionParticipant], validate: v => Array.isArray(v) && v.length > 0, }
})

const CompetitionResults = mongoose.model('CompetitionResults', competitionFileRecordSchema);

export { ValidationFileRecord, CompetitionResults }
