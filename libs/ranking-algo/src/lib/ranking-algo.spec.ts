import { calculateForce, calculatePointsForParticipant, filterCompetitionResults, rank } from './ranking-algo';
import {
  AgeCategory,
  CompetitionParticipant,
  CompetitionResults,
  CompetitionZone,
  PlayerClass,
  PlayerClassification,
  Ranking
} from '@cff/api-interfaces';

describe('calculate force', () => {
  const results: CompetitionParticipant[] = [
    {cffNumber: "#1" },
    {cffNumber: "#2" },
    {cffNumber: "#3" },
    {cffNumber: "#4" },
    {cffNumber: "#5" },
    {cffNumber: "#6" }
  ]

  it('2xA, 2xB, 1xC, 1xD = 58', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.A},
      {cffNumber: "#2", 'class': PlayerClass.A},
      {cffNumber: "#3", 'class': PlayerClass.B},
      {cffNumber: "#4", 'class': PlayerClass.B},
      {cffNumber: "#5", 'class': PlayerClass.C},
      {cffNumber: "#6", 'class': PlayerClass.D}
    ]
    expect(calculateForce(results, classification, AgeCategory.Open)).toEqual(58);
  });

  it('6xA = 90', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.A},
      {cffNumber: "#2", 'class': PlayerClass.A},
      {cffNumber: "#3", 'class': PlayerClass.A},
      {cffNumber: "#4", 'class': PlayerClass.A},
      {cffNumber: "#5", 'class': PlayerClass.A},
      {cffNumber: "#6", 'class': PlayerClass.A}
    ]
    expect(calculateForce(results, classification, AgeCategory.Open)).toEqual(90);
  });

  it('3xA, 3XB = 75', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.A},
      {cffNumber: "#2", 'class': PlayerClass.A},
      {cffNumber: "#3", 'class': PlayerClass.A},
      {cffNumber: "#4", 'class': PlayerClass.B},
      {cffNumber: "#5", 'class': PlayerClass.B},
      {cffNumber: "#6", 'class': PlayerClass.B}
    ]
    expect(calculateForce(results, classification, AgeCategory.Open)).toEqual(75);
  });

  it('minimum invoked for open as 6XD < 30', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D},
      {cffNumber: "#2", 'class': PlayerClass.D},
      {cffNumber: "#3", 'class': PlayerClass.D},
      {cffNumber: "#4", 'class': PlayerClass.D},
      {cffNumber: "#5", 'class': PlayerClass.D},
      {cffNumber: "#6", 'class': PlayerClass.D}
    ]
    expect(calculateForce(results, classification, AgeCategory.Open)).toEqual(30);
  });

  it('minimum invoked for masters as 6XD = 18 which is < 20', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D},
      {cffNumber: "#2", 'class': PlayerClass.D},
      {cffNumber: "#3", 'class': PlayerClass.D},
      {cffNumber: "#4", 'class': PlayerClass.D},
      {cffNumber: "#5", 'class': PlayerClass.D},
      {cffNumber: "#6", 'class': PlayerClass.D}
    ]
    expect(calculateForce(results, classification, AgeCategory.Masters)).toEqual(20);
  });

  it('minimum invoked for junior as 6XD = 18 which is < 20', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D},
      {cffNumber: "#2", 'class': PlayerClass.D},
      {cffNumber: "#3", 'class': PlayerClass.D},
      {cffNumber: "#4", 'class': PlayerClass.D},
      {cffNumber: "#5", 'class': PlayerClass.D},
      {cffNumber: "#6", 'class': PlayerClass.D}
    ]
    expect(calculateForce(results, classification, AgeCategory.Junior)).toEqual(20);
  });

  it('minimum invoked for cadet as 3XD = 9 which is < 10', () => {
    const results: CompetitionParticipant[] = [
      {cffNumber: "#1" },
      {cffNumber: "#2" },
      {cffNumber: "#3" }
    ]
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D},
      {cffNumber: "#2", 'class': PlayerClass.D},
      {cffNumber: "#3", 'class': PlayerClass.D}
    ]
    expect(calculateForce(results, classification, AgeCategory.Cadet)).toEqual(10);
  });
  it('default minimum invoked for an age category which does not have a minimum defined', () => {
    const results: CompetitionParticipant[] = [
      {cffNumber: "#1" },
      {cffNumber: "#2" },
      {cffNumber: "#3" }
    ]
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': PlayerClass.D},
      {cffNumber: "#2", 'class': PlayerClass.D},
      {cffNumber: "#3", 'class': PlayerClass.D}
    ]
    expect(calculateForce(results, classification, AgeCategory.Veterans)).toEqual(25);
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
  const competitionResults: CompetitionResults[] = [
    {
      competitionShortName: 'CFF1',
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
    {cffNumber: '001', 'class': PlayerClass.A},
    {cffNumber: '002', 'class': PlayerClass.B},
    {cffNumber: '003', 'class': PlayerClass.B},
    {cffNumber: '004', 'class': PlayerClass.C},
    {cffNumber: '005', 'class': PlayerClass.C},
    {cffNumber: '006', 'class': PlayerClass.C},
    {cffNumber: '007', 'class': PlayerClass.D},
    {cffNumber: '008', 'class': PlayerClass.D},
    {cffNumber: '009', 'class': PlayerClass.D},
    {cffNumber: '010', 'class': PlayerClass.D}
  ]
  const competitionResults: CompetitionResults[] = [
    {
      competitionShortName: 'CFF1',
      ageCategory: AgeCategory.Senior,
      competition: {zone: CompetitionZone.cff},
      results: [
        {cffNumber: '001', rank: 1},
        {cffNumber: '002', rank: 2},
        {cffNumber: '003', rank: 3},
        {cffNumber: '004', rank: 4},
        {cffNumber: '005', rank: 5},
        {cffNumber: '006', rank: 6}
      ]
    },
    {
      competitionShortName: 'REG1',
      ageCategory: AgeCategory.Cadet,
      competition: {zone: CompetitionZone.regionalEast},
      results: [
        {cffNumber: '007', rank: 1},
        {cffNumber: '008', rank: 2},
        {cffNumber: '009', rank: 3},
        {cffNumber: '001', rank: 4},
        {cffNumber: '002', rank: 5},
        {cffNumber: '003', rank: 6}
      ]
    },
    {
      competitionShortName: 'NAT1',
      ageCategory: AgeCategory.Junior,
      competition: {zone: CompetitionZone.national},
      results: [
        {cffNumber: '001', rank: 1},
        {cffNumber: '002', rank: 2},
        {cffNumber: '004', rank: 3},
        {cffNumber: '008', rank: 4},
        {cffNumber: '009', rank: 5},
        {cffNumber: '010', rank: 6}
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
