import {
  AgeCategory,
  CompetitionParticipant,
  CompetitionResult,
  CompetitionZone,
  PlayerClass,
  PlayerClassification,
  Rank,
  Ranking,
  ZoneDistribution
} from '@cff/api-interfaces';

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

export function decorateRanksWithPositions(ranks: Rank[]) {
  let position = 0
  for (let i=0; i<ranks.length; i++) {
    position = position + 1
    if (ranks[i].position === undefined && i === 0) {
      ranks[i].position = position
    } else if (ranks[i].points === ranks[i-1].points) {
      ranks[i].position = ranks[i-1].position
    } else if (ranks[i].points !== ranks[i-1].points) {
      ranks[i].position = position
    }
  }
}

export function rank(competitionResults: CompetitionResult[], players: PlayerClassification[]): Ranking {
  const forceMap = createForceMap(competitionResults, players)
  const ranks: Rank[] = []
  for (const p of players) {
    const rank: Rank = createRankForPlayer(competitionResults, p, forceMap)
    const points = roundToOneDecimal(rank.cffDistribution.points + rank.regionalDistribution.points + rank.nationalDistribution.points);
    if (points != 0) {
      rank.points = points
      ranks.push(rank)
    }
  }
  ranks.sort((a, b) => b.points - a.points)
  decorateRanksWithPositions(ranks)
  return {ranks: ranks}
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

function isProvinceInCompetitionZone(zone: CompetitionZone.regionalEast | CompetitionZone.regionalWest, province: string) {
  if (zone == CompetitionZone.regionalWest) {
    return province === "BC" || province ===  "AB" || province === "SK" || province === "MB"
  } else if (zone == CompetitionZone.regionalEast) {
    return province === "ON" || province ===  "QC" || province ===  "NS" || province ===  "NB" || province ===  "PE" || province ===  "NL"
  }
}

function isRegional(zone: CompetitionZone) {
  return zone == CompetitionZone.regionalEast || zone == CompetitionZone.regionalWest
}

function createRankForPlayer(competitionResults: CompetitionResult[], player: PlayerClassification, forceMap): Rank {
  const rank: Rank = { player: player, points: 0 }
  let cffCompetitionPoints: {code: string, points: number}[] = []
  const regionalPoints: {code: string, points: number}[] = []
  const nationalPoints: {code: string, points: number}[] = []
  for(const c of competitionResults) {
    const placeForPlayer = getPlaceForPlayer(player, c);
    // not every player participates in every competition
    if (placeForPlayer) {
      const points = calculatePointsForParticipant(placeForPlayer, forceMap[c.competition.code], c.results.length);
      if (c.competition.zone == CompetitionZone.cff) {
        cffCompetitionPoints.push({ code: c.competition.code, points: points })
      } else if (c.competition.zone == CompetitionZone.national) {
        nationalPoints.push({ code: c.competition.code, points: points })
      } else if (isRegional(c.competition.zone) && isProvinceInCompetitionZone(c.competition.zone, player.province)) {
        regionalPoints.push({ code: c.competition.code, points: points })
      } else {
        cffCompetitionPoints.push({ code: c.competition.code, points: points })
      }
    }
  }
  sortCompetitionsByPointsInDescendingOrder(cffCompetitionPoints);
  sortCompetitionsByPointsInDescendingOrder(regionalPoints);
  sortCompetitionsByPointsInDescendingOrder(nationalPoints);
  cffCompetitionPoints = takeTopCompetitions(cffCompetitionPoints);
  rank.cffDistribution = zoneDistribution(cffCompetitionPoints)
  rank.regionalDistribution = zoneDistribution(regionalPoints)
  rank.nationalDistribution = zoneDistribution(nationalPoints)
  return rank

}

function zoneDistribution(competitions: { code: string; points: number }[]) : ZoneDistribution {
  let total = 0
  for (const p of competitions) {
    total += p.points
  }
  return {points: roundToOneDecimal(total), competitions: competitions}
}

function getPlaceForPlayer(player: PlayerClassification, result: CompetitionResult): number {
  if (isPlayerEligibleForCompetition(player, result)) {
    const p = result.results.filter(r => r.cffNumber === player.cffNumber && r.completed === "t")
    return p.length > 0 ? p[0].rank : null
  } else {
    return null
  }
}

function isPlayerEligibleForCompetition(player: PlayerClassification, result: CompetitionResult) {
  const competitionInfo = (result.gender === "M" ? "M" : "W") + result.weapon.substring(0, 1).toUpperCase()
  return player.weapon === competitionInfo
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
