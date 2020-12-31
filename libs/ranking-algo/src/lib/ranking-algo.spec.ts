import { calculateForce } from './ranking-algo';
import { CompetitionParticipant, PlayerClassification } from '@cff/api-interfaces';

describe('calculate force', () => {
  it('2xA, 2xB, 1xC, 1xD = 58', () => {
    const results: CompetitionParticipant[] = [
      {cffNumber: "#1" },
      {cffNumber: "#2" },
      {cffNumber: "#3" },
      {cffNumber: "#4" },
      {cffNumber: "#5" },
      {cffNumber: "#6" }
    ]
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': 'A'},
      {cffNumber: "#2", 'class': 'A'},
      {cffNumber: "#3", 'class': 'B'},
      {cffNumber: "#4", 'class': 'B'},
      {cffNumber: "#5", 'class': 'C'},
      {cffNumber: "#6", 'class': 'D'}
    ]
    expect(calculateForce(results, classification)).toEqual(58);
  });

  it('6xA = 90', () => {
    const results: CompetitionParticipant[] = [
      {cffNumber: "#1" },
      {cffNumber: "#2" },
      {cffNumber: "#3" },
      {cffNumber: "#4" },
      {cffNumber: "#5" },
      {cffNumber: "#6" }
    ]
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': 'A'},
      {cffNumber: "#2", 'class': 'A'},
      {cffNumber: "#3", 'class': 'A'},
      {cffNumber: "#4", 'class': 'A'},
      {cffNumber: "#5", 'class': 'A'},
      {cffNumber: "#6", 'class': 'A'}
    ]
    expect(calculateForce(results, classification)).toEqual(90);
  });

  it('3xA, 3XB = 75', () => {
    const results: CompetitionParticipant[] = [
      {cffNumber: "#1" },
      {cffNumber: "#2" },
      {cffNumber: "#3" },
      {cffNumber: "#4" },
      {cffNumber: "#5" },
      {cffNumber: "#6" }
    ]
    const classification: PlayerClassification[] = [
      {cffNumber: "#1", 'class': 'A'},
      {cffNumber: "#2", 'class': 'A'},
      {cffNumber: "#3", 'class': 'A'},
      {cffNumber: "#4", 'class': 'B'},
      {cffNumber: "#5", 'class': 'B'},
      {cffNumber: "#6", 'class': 'B'}
    ]
    expect(calculateForce(results, classification)).toEqual(75);
  });


});
