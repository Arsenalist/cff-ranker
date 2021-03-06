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
  completed?: string
  warnings?: Warning[]
}

interface Warning {
  type: string
}

interface CompetitionResult {

  _id?: string

  competition?: Competition

  creator?: string;

  competitionType?: string;

  competitionDate?: Date;

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
  yearOfBirth?: number
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
  _id?: any
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
  _id?: string
  weapon?: string
  class?: PlayerClass
  lastName?: string
  firstName?: string
  cffNumber?: string
  club?: string
  province?: string
}

export enum Weapon {
  Epee = "epee",
  Fleuret = "fleuret",
  Sabre = "sabre"
}

export interface PlayerAndCompetition {
  player: PlayerClassification,
  competition: Competition
}

export type ZoneDistribution = {
  points?: number,
  competitions?: {
    code?: string,
    points?: number
  }[]
};

export interface Rank {
  position?: number
  player?: PlayerClassification
  points?: number
  cffDistribution?: ZoneDistribution
  regionalDistribution?: ZoneDistribution
  nationalDistribution?: ZoneDistribution
}

export interface Ranking {
  _id?: string
  ranks: Rank[]
  weapon?: Weapon
  ageCategory?: AgeCategory
  gender?: string
}

export interface RankingJob {
  _id?: string
  user: string
  dateGenerated: Date,
  startDate: Date,
  endDate: Date
}

export interface ValidationFile {
  players: Player[]
  dateGenerated: Date
}

export interface ClassificationFile {
  classifications: PlayerClassification[]
  dateGenerated: Date
}

export { CompetitionParticipant, Warning, CompetitionResult, Player, CompetitionStatus, Competition, PlayerClassification, CompetitionZone, AgeCategory, PlayerClass }
