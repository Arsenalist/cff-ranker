import { Player, PlayerClassification, ValidationFile, Weapon } from '@cff/api-interfaces';
import { decorateClassificationFileDataWithValidationFileData } from './mygoose';
import { environment } from '../environments/environment';

describe('decorateClassificationFileDataWithValidationFileData', () => {
  const classifications: PlayerClassification[] = [{
    weapon: Weapon.Fleuret,
    province: 'ON',
    cffNumber: 'CFF-10234',
    lastName: 'last name',
    firstName: 'first name',
    club: 'ARS'
  }]
  const validationRecord: Player = { branch: 'AB' }
  const validationFileMap = {[classifications[0].cffNumber]: validationRecord}

  it('flag on: branch from validation file is copied over to classification file record', () => {
    environment.show_validation_classification_mismatches_when_ranking = true
    const result = decorateClassificationFileDataWithValidationFileData(classifications, validationFileMap)

    expect(result.length).toEqual(1)
    expect(result[0].cffNumber).toEqual(classifications[0].cffNumber)
    expect(result[0].province).toEqual(validationRecord.branch)
  });

  it('flag off: branch from validation file is copied over to classification file record', () => {
    environment.show_validation_classification_mismatches_when_ranking = false
    const result = decorateClassificationFileDataWithValidationFileData(classifications, validationFileMap)

    expect(result.length).toEqual(1)
    expect(result[0].cffNumber).toEqual(classifications[0].cffNumber)
    expect(result[0].province).toEqual(validationRecord.branch)
  });

  it('flag on: errors are shown', () => {
    environment.show_validation_classification_mismatches_when_ranking = true
    try {
      decorateClassificationFileDataWithValidationFileData(classifications, {})
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toEqual(`${classifications[0].cffNumber} was not found in the validation file but exists in the classification file.`)
    }
  });

  it('flag off: errors are hidden', () => {
    environment.show_validation_classification_mismatches_when_ranking = false
    const result = decorateClassificationFileDataWithValidationFileData(classifications, {})
    expect(result.length).toEqual(1)
  });
});
