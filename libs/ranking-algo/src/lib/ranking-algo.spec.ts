import { calculateForce } from './ranking-algo';
import { AgeCategory, CompetitionParticipant, PlayerClassification } from '@cff/api-interfaces';

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
      {cffNumber: "#1", 'class': 'A'},
      {cffNumber: "#2", 'class': 'A'},
      {cffNumber: "#3", 'class': 'B'},
      {cffNumber: "#4", 'class': 'B'},
      {cffNumber: "#5", 'class': 'C'},
      {cffNumber: "#6", 'class': 'D'}
    ]
    expect(calculateForce(results, classification, AgeCategory.Open)).toEqual(58);
  });

  it('6xA = 90', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': 'A'},
      {cffNumber: "#2", 'class': 'A'},
      {cffNumber: "#3", 'class': 'A'},
      {cffNumber: "#4", 'class': 'A'},
      {cffNumber: "#5", 'class': 'A'},
      {cffNumber: "#6", 'class': 'A'}
    ]
    expect(calculateForce(results, classification, AgeCategory.Open)).toEqual(90);
  });

  it('3xA, 3XB = 75', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': 'A'},
      {cffNumber: "#2", 'class': 'A'},
      {cffNumber: "#3", 'class': 'A'},
      {cffNumber: "#4", 'class': 'B'},
      {cffNumber: "#5", 'class': 'B'},
      {cffNumber: "#6", 'class': 'B'}
    ]
    expect(calculateForce(results, classification, AgeCategory.Open)).toEqual(75);
  });

  it('minimum invoked for open as 6XD < 30', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': 'D'},
      {cffNumber: "#2", 'class': 'D'},
      {cffNumber: "#3", 'class': 'D'},
      {cffNumber: "#4", 'class': 'D'},
      {cffNumber: "#5", 'class': 'D'},
      {cffNumber: "#6", 'class': 'D'}
    ]
    expect(calculateForce(results, classification, AgeCategory.Open)).toEqual(30);
  });

  it('minimum invoked for masters as 6XD = 18 which is < 20', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': 'D'},
      {cffNumber: "#2", 'class': 'D'},
      {cffNumber: "#3", 'class': 'D'},
      {cffNumber: "#4", 'class': 'D'},
      {cffNumber: "#5", 'class': 'D'},
      {cffNumber: "#6", 'class': 'D'}
    ]
    expect(calculateForce(results, classification, AgeCategory.Masters)).toEqual(20);
  });

  it('minimum invoked for junior as 6XD = 18 which is < 20', () => {
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': 'D'},
      {cffNumber: "#2", 'class': 'D'},
      {cffNumber: "#3", 'class': 'D'},
      {cffNumber: "#4", 'class': 'D'},
      {cffNumber: "#5", 'class': 'D'},
      {cffNumber: "#6", 'class': 'D'}
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
      {cffNumber: "#1", 'class': 'D'},
      {cffNumber: "#2", 'class': 'D'},
      {cffNumber: "#3", 'class': 'D'}
    ]
    expect(calculateForce(results, classification, AgeCategory.Cadet)).toEqual(10);
  });
});
