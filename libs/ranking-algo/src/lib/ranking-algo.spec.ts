import { calculateForce, calculatePointsForParticipant, getCompetitionResultsByZone } from './ranking-algo';
import {
  AgeCategory,
  CompetitionParticipant,
  CompetitionResults,
  CompetitionZone,
  PlayerClass,
  PlayerClassification
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

describe('get competitions by zone', () => {
  it('gets all CFF competitions', () => {
    const competitionResults: CompetitionResults[] = [
      {
        competitionShortName: 'CFF1',
        competition: {zone: CompetitionZone.cff}
      },
      {
        competitionShortName: 'NAT1',
        competition: {zone: CompetitionZone.national}
      }
    ]
    const actual = getCompetitionResultsByZone(competitionResults, CompetitionZone.cff)
    expect(actual.length).toBe(1)
    expect(actual[0].competitionShortName).toBe('CFF1')
  })
})
