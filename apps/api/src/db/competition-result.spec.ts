import {
  saveCompetitionResults,
  saveParticipantInCompetitionResult,
  updateCompetitionResultStatus
} from './competition-result';
import { MultiMessageError } from '@cff/common';
import { AgeCategory, CompetitionResult, CompetitionStatus, CompetitionZone } from '@cff/api-interfaces';
import * as mygoose from './mygoose';

import * as mongoose from 'mongoose';

const ageCategory: AgeCategory = {
  _id: new mongoose.Types.ObjectId("600ae95ca9a08111903e5066"),
  code: 'senior',
  name: 'Senior',
  minimumForce: 40,
  yearOfBirth: 1980
}

function aCompetitionResult(): CompetitionResult {
  return {
    creator: 'Bill Smith',
    competitionType: 'individuel',
    competitionDate: new Date(2011, 10, 12),
    weapon: 'fleuret',
    gender: 'M',
    ageCategory: 'senior',
    tournamentName: 'FM CHALLENGE DE LA VILLE DE LONGUEUIL',
    competitionShortName: 'FM OM',
    results: [{
      surname: 'TEISSEIRE',
      name: 'Nicolas',
      yearOfBirth: 1986,
      gender: 'M',
      country: 'CAN',
      cffNumber: 'C06-0009n',
      branch: 'QC',
      club: 'OM',
      rank: 1,
      completed: 't',
      warnings: []
    }]
  };
}

describe('CFF# is allowed to be blank', () => {
  it('participant with blank CFF is not rejected but competition is in approved status', async () => {
    const fields = aCompetitionResult()
    fields.results[0].cffNumber = ""
    jest.restoreAllMocks()
    jest.spyOn(mygoose, 'validateParticipant').mockResolvedValueOnce({});
    jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValueOnce(ageCategory);
    jest.spyOn(mygoose, 'getCompetition').mockResolvedValueOnce({code: 'COMP1'});
    jest.spyOn(mygoose, 'getCompetitionResultsInLastYear').mockResolvedValueOnce(null)
    const saveCompetitionResultsSpy = jest.spyOn(mygoose, 'saveCompetitionResults').mockImplementationOnce(jest.fn())
    await saveCompetitionResults(fields)
    expect(saveCompetitionResultsSpy.mock.calls[0][0].results[0].warnings[0].type).toBe("MISSING_CFF_NUMBER")
  });
});

describe('CFF# validation from validation file', () => {
  it('participant with invalid CFF# is rejected', async () => {
    const fields = aCompetitionResult()
    fields.results[0].cffNumber = "INVALID_CFFNUMBER"
    fields.results[0].name = "INVALID_NAME"
    fields.results[0].surname = "INVALID_SURNAME"
    fields.results[0].yearOfBirth = 2000
    fields.results[0].gender = "INVALID_GENDER"
    jest.restoreAllMocks()
    jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue(null);
    try {
      await saveCompetitionResults(fields)
      fail("should not get here")
    } catch (err) {
      expect(err).toBeInstanceOf(MultiMessageError);
      expect(err.errorMessages[0]).toBe(`Could not validate: ${fields.results[0].cffNumber}, ${fields.results[0].name}, ${fields.results[0].surname}, ${fields.results[0].yearOfBirth}, ${fields.results[0].gender}.`)
    }
  });
});

describe('competition fields are validated', () => {
  it('check for required fields at top level', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    try {
      fields.creator = null;
      fields.competitionType = null;
      fields.competitionDate = null;
      fields.weapon = null;
      fields.gender = null;
      fields.ageCategory = null;
      fields.tournamentName = null;
      fields.competitionShortName = null;
      jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue({});
      jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
      jest.spyOn(mygoose, 'getCompetition').mockResolvedValue({code: 'a', name: 'b', zone: CompetitionZone.cff})
      jest.spyOn(mygoose, 'getCompetitionResultsInLastYear').mockResolvedValueOnce(null)
      await saveCompetitionResults(fields);
      fail('should not reach here');
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(Object.keys(err.errors).length).toBe(7); // age category is handled separately
    }
  });
  it('age category is invalid', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue({});
    jest.spyOn(mygoose, 'getCompetition').mockResolvedValue({})
    jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(null);
    try {
      await saveCompetitionResults(fields);
      fail('should not reach here');
    } catch (err) {
      expect(err.errorMessages[0]).toBe(`Age Category is invalid: ${fields.ageCategory}`)
    }
  });
  it('competition code does not exist', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue({})
    jest.spyOn(mygoose, 'getCompetition').mockResolvedValue(null)
    jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
    try {
      await saveCompetitionResults(fields)
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toBe(`The competition code "${fields.competitionShortName}" does not exist.`)
    }
  })
  it('results are valid', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue({});
    jest.spyOn(mygoose, 'getCompetition').mockResolvedValue({code: 'a', name: 'b', zone: CompetitionZone.cff})
    jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
    jest.spyOn(mygoose, 'getCompetitionResultsInLastYear').mockResolvedValueOnce(null)
    const saveCompetitionResultsSpy = jest.spyOn(mygoose, 'saveCompetitionResults').mockImplementationOnce(jest.fn())
    await saveCompetitionResults(fields);
    expect(saveCompetitionResultsSpy.mock.calls[0][0].status).toBe(CompetitionStatus.approved)
  });
});

describe('competition results approval/rejection', () => {
  it('competition is approved', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    jest.restoreAllMocks()
    jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
    const updateCompetitionResults = jest.spyOn(mygoose, 'updateCompetitionResult').mockImplementationOnce(jest.fn())
    await updateCompetitionResultStatus(fields._id, CompetitionStatus.approved )
    expect(updateCompetitionResults).toHaveBeenCalledWith(expect.objectContaining({status: CompetitionStatus.approved}))
  });
  it('competition is rejected', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
    const updateCompetitionResults = jest.spyOn(mygoose, 'updateCompetitionResult').mockImplementationOnce(jest.fn())
    await updateCompetitionResultStatus(fields._id, CompetitionStatus.rejected )
    expect(updateCompetitionResults).toHaveBeenCalledWith(expect.objectContaining({status: CompetitionStatus.rejected}))
  });
});

describe('CFF# format is considered when saving a participant in a competition', () => {
  it('save a participant is rejected', async () => {
    jest.restoreAllMocks()
    const invalidCffNumber = "ABC"
    try {
      await saveParticipantInCompetitionResult("competitionId", "participantId", {cffNumber: invalidCffNumber} )
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toBe(`Invalid CFF# format: ${invalidCffNumber}`)
    }
  });
  it('save a participant works', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
    jest.spyOn(mygoose, 'queryListById').mockResolvedValue({ } )
    jest.spyOn(mygoose, 'save').mockResolvedValue(null)
    await saveParticipantInCompetitionResult("competitionId", "participantId", {cffNumber: "C06-0516"} )
  });
  it('saving a participant with blank CFF is rejected', async () => {
    jest.restoreAllMocks()
    const blankCffNumber = ""
    try {
      await saveParticipantInCompetitionResult("competitionId", "participantId", {cffNumber: blankCffNumber} )
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toBe(`CFF# cannot be blank`)
    }
  });
});

describe('age category / YOB', () => {
  it('invalid age category is not counted and count of participants drops below six', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    for (let i=0; i<5; i++) {
      fields.results.push({...fields.results[0], name: `${Math.random()}`})
    }
    fields.results[0].yearOfBirth = ageCategory.yearOfBirth - 1; // too young
    jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue({});
    jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
    jest.spyOn(mygoose, 'getCompetition').mockResolvedValueOnce({});
    jest.spyOn(mygoose, 'getCompetitionResultsInLastYear').mockResolvedValueOnce(null)
    try {
      await saveCompetitionResults(fields)
      fail("should not get here")
    } catch (err) {
      expect(err).toBeInstanceOf(MultiMessageError);
      expect(err.errorMessages[0]).toBe(`${fields.results[0].name} ${fields.results[0].surname} ineligible. Minimum number of players not met.`)
    }
  });
  it('invalid age category is not counted and count of participants is above six', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    const randomNames = []
    for (let i=0; i<6; i++) {
      randomNames.push(`${Math.random()}`)
      fields.results.push({...fields.results[0], name: randomNames[i]})
    }
    fields.results[0].yearOfBirth = ageCategory.yearOfBirth - 1; // too young
    jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue({});
    jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
    jest.spyOn(mygoose, 'getCompetition').mockResolvedValueOnce({code: 'COMP1'});
    jest.spyOn(mygoose, 'getCompetitionResultsInLastYear').mockResolvedValueOnce(null)
    const saveCompetitionResultsSpy = jest.spyOn(mygoose, 'saveCompetitionResults').mockImplementationOnce(jest.fn())
    await saveCompetitionResults(fields)
    expect(saveCompetitionResultsSpy.mock.calls[0][0].results[0].name).toBe(randomNames[0])
  });
});

describe('competition results already exist', () => {
  it('if competition exists overwrite the record', async () => {
    jest.restoreAllMocks()
    const fields = aCompetitionResult()
    const existing = aCompetitionResult()
    existing._id = "existing_id"
    jest.spyOn(mygoose, 'validateParticipant').mockResolvedValueOnce({});
    jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValueOnce(ageCategory);
    jest.spyOn(mygoose, 'getCompetition').mockResolvedValueOnce({code: 'COMP1'});
    jest.spyOn(mygoose, 'getCompetitionResultsInLastYear').mockResolvedValueOnce(existing);
    const deleteCompetitionResultSpy = jest.spyOn(mygoose, 'deleteCompetitionResult').mockImplementationOnce(jest.fn())
    const saveCompetitionResultsSpy = jest.spyOn(mygoose, 'saveCompetitionResults').mockImplementationOnce(jest.fn())
    await saveCompetitionResults(fields)
    expect(deleteCompetitionResultSpy.mock.calls[0][0]).toBe(existing._id)
    expect(saveCompetitionResultsSpy).toHaveBeenCalledTimes(1)
  });
});
