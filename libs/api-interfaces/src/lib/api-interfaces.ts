interface CompetitionParticipant  {
  _id?: string
  surname?: string
  name?: string
  yearOfBirth?: number
  gender?: string
  country?: string
  cffNumber?: string
  branch?: string
  club?: string
  rank?: number
  validated?: string
  warnings?: Warning[]
}

interface Warning {
  type: string
}

interface CompetitionResults {

  _id?: string

  competition?: any

  creator?: string;

  competitionType?: string;

  competitionDate?: string;

  weapon?:string

  gender?:string

  ageCategory?: AgeCategory | string

  tournamentName?: string

  competitionShortName?: string

  status?: CompetitionStatus

  results?: CompetitionParticipant[]
}

interface Player {
  _id?: string
  surname?: string
  name?: string
  yearOfBirth?: string
  gender?: string
  club?: string
  branch?: string
  country?: string
  cffNumber?: string
  validated?: string
}

enum CompetitionStatus {
  approved = "approved",
  rejected = "rejected",
  pending = "pending"
}

enum CompetitionZone {
  national = "national",
  regionalEast = "regional - east",
  regionalWest = "regional - west",
  cff = "cff"
}

enum PlayerClass {
  A = "A",
  B = "B",
  C = "C",
  D = "D"
}

interface AgeCategory {
  _id?: string
  name: string
  code: string
  yearOfBirth: number
  minimumForce: number
}

interface Competition {
  _id?: any
  name?: string
  code?: string
  zone?: CompetitionZone
}

interface PlayerClassification {
  weapon?: string
  class?: PlayerClass
  lastName?: string
  firstName?: string
  cffNumber?: string
  club?: string
  province?: string
}

export interface PlayerAndCompetition {
  player: PlayerClassification,
  competition: Competition
}

export interface Rank {
  player: PlayerClassification
  points: number
}
export interface Ranking {
  ranks: Rank[]
}
export { CompetitionParticipant, Warning, CompetitionResults, Player, CompetitionStatus, Competition, PlayerClassification, CompetitionZone, AgeCategory, PlayerClass }
