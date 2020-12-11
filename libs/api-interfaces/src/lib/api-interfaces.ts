import * as mongoose from 'mongoose'

interface CompetitionParticipant extends mongoose.Document {
  _id?: string
  surname: string
  name: string
  yearOfBirth:string
  gender: string
  country: string
  cffNumber: string
  branch: string
  club: string
  rank: number
  validated: string
  warnings: Warning[]
}

interface Warning {
  type: string
}

interface Competition extends mongoose.Document {
  _id?: string
  creator: string
  competitionType: string
  competitionDate: string
  weapon: string
  gender: string
  ageCategory: string
  tournamentName: string
  competitionShortName: string
  results: mongoose.Types.Array<CompetitionParticipant>
}

interface Player extends mongoose.Document {
  _id: string
  surname: string
  name: string
  yearOfBirth: string
  gender: string
  club: string
  branch: string
  country: string
  cffNumber: string
  validated: string
}

export { CompetitionParticipant, Warning, Competition, Player }
