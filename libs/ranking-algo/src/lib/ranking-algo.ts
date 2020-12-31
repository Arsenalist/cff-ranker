import { CompetitionParticipant, PlayerClassification } from '@cff/api-interfaces';

export function calculateForce(participants: CompetitionParticipant[], classification: PlayerClassification[]): number {
  const classMap = { 'A': 0, 'B': 0, 'C': 0, 'D': 0 }
  for (const p of participants) {
    const clazz = findClass(p.cffNumber, classification)
    classMap[clazz] = classMap[clazz] + 1
  }
  return 15 * classMap['A'] + 10 * classMap['B'] + 5 * classMap['C'] + 3 * classMap['D']
}

export function findClass(cffNumber: string, classifications: PlayerClassification[]): string {
  return classifications.find(c => c.cffNumber === cffNumber).class
}
