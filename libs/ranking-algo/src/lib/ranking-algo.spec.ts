import { calculateForce, calculatePointsForParticipant, filterCompetitionResults, rank } from './ranking-algo';
import {
  AgeCategory,
  CompetitionParticipant,
  CompetitionResult,
  CompetitionZone,
  PlayerClass,
  PlayerClassification,
  Ranking, Weapon
} from '@cff/api-interfaces';

const openAgeCategory: AgeCategory = {
  code: "open",
  name: "Open",
  minimumForce: 30,
  yearOfBirth: 1980
}

const juniorAgeCategory: AgeCategory = {
  code: "junior",
  name: "Junior",
  minimumForce: 20,
  yearOfBirth: 1978
}

const seniorAgeCategory: AgeCategory = {
  code: "senior",
  name: "Senior",
  minimumForce: 30,
  yearOfBirth: 1954
}

const mastersAgeCategory: AgeCategory = {
  code: "masters",
  name: "Masters",
  minimumForce: 20,
  yearOfBirth: 1975
}

const cadetAgeCategory: AgeCategory = {
  code: "cadet",
  name: "Cadet",
  minimumForce: 10,
  yearOfBirth: 1989
}

const veteransAgeCategory: AgeCategory = {
  code: "veteran",
  name: "Veterans",
  minimumForce: 30,
  yearOfBirth: 1970
}



describe('calculate force', () => {
  const results: CompetitionParticipant[] = [
    {cffNumber: "#1", completed: "t" },
    {cffNumber: "#2", completed: "t" },
    {cffNumber: "#3", completed: "t" },
    {cffNumber: "#4", completed: "t" },
    {cffNumber: "#5", completed: "t" },
    {cffNumber: "#6", completed: "t" }
  ]

  it('2xA, 2xB, 1xC, 1xD = 58', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#2", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#3", 'class': PlayerClass.B, weapon: "MF"},
      {cffNumber: "#4", 'class': PlayerClass.B, weapon: "MF"},
      {cffNumber: "#5", 'class': PlayerClass.C, weapon: "MF"},
      {cffNumber: "#6", 'class': PlayerClass.D, weapon: "MF"}
    ]
    expect(calculateForce(results, classification, openAgeCategory)).toEqual(58);
  });

  it('6xA = 90', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#2", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#3", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#4", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#5", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#6", 'class': PlayerClass.A, weapon: "MF"}
    ]
    expect(calculateForce(results, classification, openAgeCategory)).toEqual(90);
  });

  it('3xA, 3XB = 75', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#2", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#3", 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: "#4", 'class': PlayerClass.B, weapon: "MF"},
      {cffNumber: "#5", 'class': PlayerClass.B, weapon: "MF"},
      {cffNumber: "#6", 'class': PlayerClass.B, weapon: "MF"}
    ]
    expect(calculateForce(results, classification, openAgeCategory)).toEqual(75);
  });

  it('minimum invoked for open as 6XD < 30', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#2", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#3", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#4", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#5", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#6", 'class': PlayerClass.D, weapon: "MF"}
    ]
    expect(calculateForce(results, classification, openAgeCategory)).toEqual(30);
  });

  it('minimum invoked for masters as 6XD = 18 which is < 20', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#2", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#3", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#4", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#5", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#6", 'class': PlayerClass.D, weapon: "MF"}
    ]
    expect(calculateForce(results, classification, mastersAgeCategory)).toEqual(20);
  });

  it('minimum invoked for junior as 6XD = 18 which is < 20', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#2", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#3", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#4", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#5", 'class': PlayerClass.D, weapon: "MF"},
      {cffNumber: "#6", 'class': PlayerClass.D, weapon: "MF"}
    ]
    expect(calculateForce(results, classification, juniorAgeCategory)).toEqual(20);
  });

  it('minimum invoked for cadet as 3XD = 9 which is < 10', () => {
    const results: CompetitionParticipant[] = [
      {cffNumber: "#1", completed: "t" },
      {cffNumber: "#2", completed: "t" },
      {cffNumber: "#3", completed: "t" }
    ]
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D},
      {cffNumber: "#2", 'class': PlayerClass.D},
      {cffNumber: "#3", 'class': PlayerClass.D}
    ]
    expect(calculateForce(results, classification, cadetAgeCategory)).toEqual(10);
  });
});

describe('calculate points earned by a participant in a competition', () => {
  it('P = 5, F = 30, N = 10 => 9.2', () => {
    expect(calculatePointsForParticipant(5, 30, 10)).toBe(9.2)
  })
  it('P = 20, F = 65, N = 50 => 7.1', () => {
    expect(calculatePointsForParticipant(20, 65, 50)).toBe(15.6)
  })
  it('P = 1, F = 30, N = 10 => 30.2', () => {
    expect(calculatePointsForParticipant(1, 30, 10)).toBe(30.2)
  })
  it('P = 10, F = 30, N = 10 => 0.2', () => {
    expect(calculatePointsForParticipant(10, 30, 10)).toBe(0.2)
  })
})

describe('get competitions by zone for a player', () => {
  const competitionResults: CompetitionResult[] = [
    {
      competitionShortName: 'CFF1',
      weapon: Weapon.Fleuret,
      gender: "M",
      competition: {zone: CompetitionZone.cff},
      results: [
        {cffNumber: '123'},
        {cffNumber: '456'},
      ]
    },
    {
      competitionShortName: 'NAT1',
      competition: {zone: CompetitionZone.national}
    }
  ]
  it('gets all CFF competitions', () => {
    const player: PlayerClassification = {cffNumber: '123'}
    const actual = filterCompetitionResults(competitionResults, player, CompetitionZone.cff)
    expect(actual.length).toBe(1)
    expect(actual[0].competitionShortName).toBe('CFF1')
  })
  it('no competitions found for player', () => {
    const player: PlayerClassification = {cffNumber: '789'}
    const actual = filterCompetitionResults(competitionResults, player, CompetitionZone.cff)
    expect(actual.length).toBe(0)
  })
})

describe('calculate points for players in many tournaments', () => {
  const players: PlayerClassification[] = [
    {cffNumber: '001', 'class': PlayerClass.A, weapon: "MF"},
    {cffNumber: '002', 'class': PlayerClass.B, weapon: "MF"},
    {cffNumber: '003', 'class': PlayerClass.B, weapon: "MF"},
    {cffNumber: '004', 'class': PlayerClass.C, weapon: "MF"},
    {cffNumber: '005', 'class': PlayerClass.C, weapon: "MF"},
    {cffNumber: '006', 'class': PlayerClass.C, weapon: "MF"},
    {cffNumber: '007', 'class': PlayerClass.D, weapon: "MF"},
    {cffNumber: '008', 'class': PlayerClass.D, weapon: "MF"},
    {cffNumber: '009', 'class': PlayerClass.D, weapon: "MF"},
    {cffNumber: '010', 'class': PlayerClass.D, weapon: "MF"}
  ]
  const competitionResults: CompetitionResult[] = [
    {
      ageCategory: seniorAgeCategory,
      weapon: Weapon.Fleuret,
      gender: "M",
      competition: {zone: CompetitionZone.cff, code: 'CFF1'},
      results: [
        {cffNumber: '001', rank: 1, completed: "t"},
        {cffNumber: '002', rank: 2, completed: "t"},
        {cffNumber: '003', rank: 3, completed: "t"},
        {cffNumber: '004', rank: 4, completed: "t"},
        {cffNumber: '005', rank: 5, completed: "t"},
        {cffNumber: '006', rank: 6, completed: "t"}
      ]
    },
    {
      ageCategory: cadetAgeCategory,
      weapon: Weapon.Fleuret,
      gender: "M",
      competition: {zone: CompetitionZone.regionalEast, code: 'REG1'},
      results: [
        {cffNumber: '007', rank: 1, completed: "t"},
        {cffNumber: '008', rank: 2, completed: "t"},
        {cffNumber: '009', rank: 3, completed: "t"},
        {cffNumber: '001', rank: 4, completed: "t"},
        {cffNumber: '002', rank: 5, completed: "t"},
        {cffNumber: '003', rank: 6, completed: "t"}
      ]
    },
    {
      ageCategory: juniorAgeCategory,
      weapon: Weapon.Fleuret,
      gender: "M",
      competition: {zone: CompetitionZone.national, code: 'NAT1'},
      results: [
        {cffNumber: '001', rank: 1, completed: "t"},
        {cffNumber: '002', rank: 2, completed: "t"},
        {cffNumber: '004', rank: 3, completed: "t"},
        {cffNumber: '008', rank: 4, completed: "t"},
        {cffNumber: '009', rank: 5, completed: "t"},
        {cffNumber: '010', rank: 6, completed: "t"}
      ]
    }
  ]
  it('calculate points for multiple players in three tournaments', () => {
    const rankings: Ranking = rank(competitionResults, players)
    expect(rankings.ranks[0].player.cffNumber).toBe("001")
    expect(rankings.ranks[0].points).toBe(99.7)

    expect(rankings.ranks[1].player.cffNumber).toBe("002")
    expect(rankings.ranks[1].points).toBe(59.8)

    expect(rankings.ranks[2].player.cffNumber).toBe("007")
    expect(rankings.ranks[2].points).toBe(44.3)

    expect(rankings.ranks[3].player.cffNumber).toBe("008")
    expect(rankings.ranks[3].points).toBe(36.3)

    expect(rankings.ranks[4].player.cffNumber).toBe("004")
    expect(rankings.ranks[4].points).toBe(26.9)

    expect(rankings.ranks[5].player.cffNumber).toBe("009")
    expect(rankings.ranks[5].points).toBe(21.5)

    expect(rankings.ranks[6].player.cffNumber).toBe("003")
    expect(rankings.ranks[6].points).toBe(19.9)

    expect(rankings.ranks[7].player.cffNumber).toBe("005")
    expect(rankings.ranks[7].points).toBe(5.4)

    expect(rankings.ranks[8].player.cffNumber).toBe("006")
    expect(rankings.ranks[8].points).toBe(0.3)

    expect(rankings.ranks[9].player.cffNumber).toBe("010")
    expect(rankings.ranks[9].points).toBe(0.2)
  })
})

describe('only top five cff competitions are considered', () => {
  const players: PlayerClassification[] = [
    {cffNumber: '001', 'class': PlayerClass.A, weapon: "MF"},
    {cffNumber: '002', 'class': PlayerClass.B, weapon: "MF"},
    {cffNumber: '003', 'class': PlayerClass.B, weapon: "MF"},
    {cffNumber: '004', 'class': PlayerClass.C, weapon: "MF"},
    {cffNumber: '005', 'class': PlayerClass.C, weapon: "MF"},
    {cffNumber: '006', 'class': PlayerClass.C, weapon: "MF"}
  ]
  function createCompetitionResults(code: string, placeFor001: number): CompetitionResult {
    const competitionResult: CompetitionResult = {
      ageCategory: seniorAgeCategory,
      competition: {zone: CompetitionZone.cff, code: code},
      weapon: Weapon.Fleuret,
      gender: "M",
      results: [
        {cffNumber: '001', rank: placeFor001, completed: "t"},
        {cffNumber: '002', rank: 2, completed: "t"},
        {cffNumber: '003', rank: 3, completed: "t"},
        {cffNumber: '004', rank: 4, completed: "t"},
        {cffNumber: '005', rank: 5, completed: "t"},
        {cffNumber: '006', rank: 6, completed: "t"}
      ]
    }
    return competitionResult
  }
  it('calculate points for multiple players in three tournaments', () => {
    const competitionResults = [
      createCompetitionResults('CFF1', 1),
      createCompetitionResults('CFF2', 2),
      createCompetitionResults('CFF3', 3),
      createCompetitionResults('CFF4', 4),
      createCompetitionResults('CFF5', 5),
      createCompetitionResults('CFF6', 6),
    ]
    const rankings: Ranking = rank(competitionResults, players)
    expect(rankings.ranks[1].player.cffNumber).toBe("001")
    expect(rankings.ranks[1].points).toBe(117.9)
  })
})

describe('top five cff competitions, regional and national are grouped', () => {
  function createCompetitionResults(code: string, places: number[], zone: CompetitionZone): CompetitionResult {
    return {
      ageCategory: seniorAgeCategory,
      weapon: Weapon.Fleuret,
      gender: "M",
      competition: {zone: zone, code: code},
      results: [
        {cffNumber: '001', rank: places[0], completed: "t"},
        {cffNumber: '002', rank: places[1], completed: "t"},
        {cffNumber: '003', rank: places[2], completed: "t"},
        {cffNumber: '004', rank: places[3], completed: "t"},
        {cffNumber: '005', rank: places[4], completed: "t"},
        {cffNumber: '006', rank: places[5], completed: "t"}
      ]
    }
  }
  function validateRank(rankings: Ranking, cffNumber: string, position: number, total: number, cffTotal: number, cffCompetitions: ({ code: string; '50.3': undefined } | { code: string; points: number } | { code: string; points: number } | { code: string; points: number } | { code: string; points: number })[], regionalTotal: number, nationalTotal: number) {
    expect(rankings.ranks[position-1].player.cffNumber).toBe(cffNumber)
    expect(rankings.ranks[position-1].points).toBe(total)
    expect(rankings.ranks[position-1].cffDistribution.points).toBe(cffTotal)
    expect(rankings.ranks[position-1].regionalDistribution.points).toBe(regionalTotal)
    expect(rankings.ranks[position-1].nationalDistribution.points).toBe(nationalTotal)
    expect(rankings.ranks[position-1].cffDistribution.competitions).toStrictEqual(cffCompetitions)
  }
  it('calculate points for multiple players in three tournaments', () => {
    const players: PlayerClassification[] = [
      {cffNumber: '001', 'class': PlayerClass.A, weapon: "MF"},
      {cffNumber: '002', 'class': PlayerClass.B, weapon: "MF"},
      {cffNumber: '003', 'class': PlayerClass.B, weapon: "MF"},
      {cffNumber: '004', 'class': PlayerClass.C, weapon: "MF"},
      {cffNumber: '005', 'class': PlayerClass.C, weapon: "MF"},
      {cffNumber: '006', 'class': PlayerClass.C, weapon: "MF"}
    ]


    const competitionResults = [
      createCompetitionResults('CFF1', [1, 2, 3, 4, 5, 6], CompetitionZone.cff),
      createCompetitionResults('CFF2', [2, 1, 3, 4, 6, 5], CompetitionZone.cff),
      createCompetitionResults('CFF3', [3, 2, 1, 4, 5, 6], CompetitionZone.cff),
      createCompetitionResults('CFF4', [4, 2, 3, 1, 5, 6], CompetitionZone.cff),
      createCompetitionResults('CFF5', [5, 2, 3, 4, 1, 6], CompetitionZone.cff),
      createCompetitionResults('CFF6', [6, 2, 3, 4, 5, 1], CompetitionZone.cff),
      createCompetitionResults('REG1', [1, 3, 2, 5, 4, 6], CompetitionZone.regionalEast),
      createCompetitionResults('REG2', [6, 2, 4, 3, 5, 1], CompetitionZone.regionalWest),
      createCompetitionResults('REG3', [1, 5, 3, 4, 2, 6], CompetitionZone.regionalWest),
      createCompetitionResults('NAT1', [1, 2, 6, 4, 5, 3], CompetitionZone.national),
      createCompetitionResults('NAT2', [6, 5, 4, 3, 2, 1], CompetitionZone.national)
    ]
    const rankings: Ranking = rank(competitionResults, players)
    validateRank(rankings, "001", 1, 269.4, 117.9,
      [
        {code: "CFF1", points: 50.3},
        {code: "CFF2", points: 31},
        {code: "CFF3", points: 19.6},
        {code: "CFF4", points: 11.6},
        {code: "CFF5", points: 5.4}], 100.9, 50.6)
    validateRank(rankings, "002", 2, 266.7, 174.3,
      [
        {code: "CFF2", points: 50.3},
        {code: "CFF1", points: 31},
        {code: "CFF3", points: 31},
        {code: "CFF4", points: 31},
        {code: "CFF5", points: 31}], 56, 36.4)
    validateRank(rankings, "003", 3, 202.8, 128.7,
      [
        {code: "CFF3", points: 50.3},
        {code: "CFF1", points: 19.6},
        {code: "CFF2", points: 19.6},
        {code: "CFF4", points: 19.6},
        {code: "CFF5", points: 19.6}], 62.2, 11.9)
    validateRank(rankings, "006", 4, 177.4, 56.6,
      [
        {code: "CFF6", points: 50.3},
        {code: "CFF2", points: 5.4},
        {code: "CFF1", points: 0.3},
        {code: "CFF3", points: 0.3},
        {code: "CFF4", points: 0.3}], 50.9, 69.9)

    validateRank(rankings, "004", 5, 164.5, 96.7,
      [
        {code: "CFF4", points: 50.3},
        {code: "CFF1", points: 11.6},
        {code: "CFF2", points: 11.6},
        {code: "CFF3", points: 11.6},
        {code: "CFF5", points: 11.6}], 36.6, 31.2)

    validateRank(rankings, "005", 6, 156.3, 71.9,
      [
        {code: "CFF5", points: 50.3},
        {code: "CFF1", points: 5.4},
        {code: "CFF3", points: 5.4},
        {code: "CFF4", points: 5.4},
        {code: "CFF6", points: 5.4}], 48, 36.4)
  })
})
