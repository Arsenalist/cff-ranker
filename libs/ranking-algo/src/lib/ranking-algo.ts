import {
  AgeCategory,
  CompetitionParticipant,
  CompetitionResult,
  CompetitionZone,
  PlayerClass,
  PlayerClassification, Rank, Ranking
} from '@cff/api-interfaces';
var hash = require('object-hash');

export function calculateForce(participants: CompetitionParticipant[], classification: PlayerClassification[], ageCategory: AgeCategory): number {
  const classMap = emptyPlayerClassCountMap();
  for (const p of participants) {
    const clazz = findClass(p.cffNumber, classification)
    classMap[clazz] = classMap[clazz] + 1
  }
  const force = 15 * classMap[PlayerClass.A] + 10 * classMap[PlayerClass.B] + 5 * classMap[PlayerClass.C] + 3 * classMap[PlayerClass.D]
  return Math.max(force, ageCategory.minimumForce)
}

export function calculatePointsForParticipant(place: number, force: number, numberOfParticipants: number): number {
  const actual =  force * (1.006 - (Math.log10(place) / Math.log10(numberOfParticipants)))
  return roundToOneDecimal(actual)
}

export function filterCompetitionResults(competitionResults: CompetitionResult[], player: PlayerClassification, zone: CompetitionZone): CompetitionResult[] {
  return competitionResults.filter(v => v.competition.zone === zone &&
    v.results.filter(p => p.cffNumber === player.cffNumber).length !== 0)
}

export function rank(competitionResults: CompetitionResult[], players: PlayerClassification[]): Ranking {
  const forceMap = createForceMap(competitionResults, players)
  let allPlayersPointsMap = new Map<string, number>()
  const ranks: Rank[] = []
  for (const p of players) {
    allPlayersPointsMap = new Map([...allPlayersPointsMap, ...createPlayerPointsMap(competitionResults, p, forceMap)])
    const points = roundToOneDecimal(collectPoints(p, competitionResults, allPlayersPointsMap));
    if (points != 0) {
      ranks.push({
        points: points,
        player: p
      })
    }
  }
  ranks.sort((a, b) => b.points - a.points)
  return {ranks: ranks}
}

function collectPoints(player: PlayerClassification,
                       results: CompetitionResult[],
                       playerPointsMap: Map<string, number>): number {
  return results.reduce( (acc, value) => {
     const points = playerPointsMap.get(player.cffNumber + value.competition.code);
    // not every player participates in every competition
    return points ? acc + points : acc
  }, 0)
}

function createForceMap(competitionResults: CompetitionResult[], players: PlayerClassification[]): Map<string, number> {
  const forceMap = new Map<string, number>()
  for (const c of competitionResults) {
    forceMap[c.competition.code] = calculateForce(c.results, players, c.ageCategory as AgeCategory)
  }
  return forceMap
}

function sortCompetitionsByPointsInDescendingOrder(cffCompetitionPoints: { code: string; points: number }[]) {
  cffCompetitionPoints.sort((a, b) => b.points - a.points);
}

function takeTopCompetitions(cffCompetitionPoints: { code: string; points: number }[]) {
  const maximumCffCompetitionsToConsiderPerPlayer = 5
  if (cffCompetitionPoints.length > maximumCffCompetitionsToConsiderPerPlayer) {
    cffCompetitionPoints = cffCompetitionPoints.slice(0, maximumCffCompetitionsToConsiderPerPlayer);
  }
  return cffCompetitionPoints;
}

function createPlayerPointsMap(competitionResults: CompetitionResult[], player: PlayerClassification, forceMap): Map<string, number> {
  const map = new Map<string, number>()
  let cffCompetitionPoints: {code: string, points: number}[] = []
  for(const c of competitionResults) {
    const placeForPlayer = getPlaceForPlayer(player, c.results);
    // not every player participates in every competition
    if (placeForPlayer) {
      const points = calculatePointsForParticipant(placeForPlayer, forceMap[c.competition.code], c.results.length);
      if (c.competition.zone == CompetitionZone.cff) {
        cffCompetitionPoints.push({code: c.competition.code, points: points})
      } else {
        map.set(player.cffNumber + c.competition.code, points)
      }
    }
  }
  sortCompetitionsByPointsInDescendingOrder(cffCompetitionPoints);
  cffCompetitionPoints = takeTopCompetitions(cffCompetitionPoints);
  for (const c of cffCompetitionPoints) {
    map.set(player.cffNumber + c.code, c.points)
  }
  return map
}

function getPlaceForPlayer(player: PlayerClassification, results: CompetitionParticipant[]): number {
  const p = results.filter(r => r.cffNumber === player.cffNumber)
  return p.length > 0 ? p[0].rank : null
}

function emptyPlayerClassCountMap() {
  return Object.values(PlayerClass).reduce((accumulator, currentValue) => {
    return { ...accumulator, [currentValue]: 0 };
  }, {});
}

function roundToOneDecimal(x: number): number {
  return Math.round(x * 10) / 10
}

function findClass(cffNumber: string, classifications: PlayerClassification[]): string {
  // TODO: Don't just return a default like this
  const player = classifications.find(c => c.cffNumber === cffNumber)
  return player == null ? PlayerClass.A : player.class
}
