import { AgeCategory, CompetitionParticipant, PlayerClass, PlayerClassification } from '@cff/api-interfaces';

export function calculateForce(participants: CompetitionParticipant[], classification: PlayerClassification[], ageCategory: AgeCategory): number {
  const classMap = emptyPlayerClassCountMap();
  for (const p of participants) {
    const clazz = findClass(p.cffNumber, classification)
    classMap[clazz] = classMap[clazz] + 1
  }
  const force = 15 * classMap[PlayerClass.A] + 10 * classMap[PlayerClass.B] + 5 * classMap[PlayerClass.C] + 3 * classMap[PlayerClass.D]
  return Math.max(force, minimumForce(ageCategory))
}

export function calculatePointsForParticipant(place: number, force: number, numberOfParticipants: number): number {
  const actual =  force * (1.006 - (Math.log10(place) / Math.log10(numberOfParticipants)))
  return roundToOneDecimal(actual)
}

function minimumForce(ageCategory: AgeCategory) {
  const minimums = {
    [AgeCategory.Open]: 30,
    [AgeCategory.Masters]: 20,
    [AgeCategory.Junior]: 20,
    [AgeCategory.Cadet]: 10
  }
  return minimums[ageCategory]
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
  return classifications.find(c => c.cffNumber === cffNumber).class
}
