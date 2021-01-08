import { mockOnce } from '../../mockgoose';
import {
  createAgeCategory,
  createCompetition,
  deleteCompetition,
  getCompetitions,
  saveClassifications,
  saveCompetitionResults, saveParticipantInCompetition,
  savePlayers,
  updateCompetitionStatus
} from './dao';
import { MultiMessageError } from '@cff/common';
import { PlayerModel } from './schemas';
import {
  AgeCategory,
  Competition,
  CompetitionResults,
  CompetitionStatus,
  CompetitionZone,
  PlayerClass,
  PlayerClassification
} from '@cff/api-interfaces';
import * as mygoose from './mygoose';

const mongoose = require('mongoose');

const ageCategory: AgeCategory = {
  code: 'senior',
  name: 'Senior',
  minimumForce: 40,
  yearOfBirth: 1980
}

describe('dao.ts', () => {
  let fields: CompetitionResults;
    beforeEach(() => {
      fields = {
        creator: 'Bill Smith',
        competitionType: 'individuel',
        competitionDate: '10/12/2011',
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
          validated: 't',
          warnings: []
        }]
      };
    });
    describe('validation file fields are validated', () => {
      let fields;
      beforeEach(() => {
        fields = [{
          surname: 'Smith',
          name: 'Bill',
          yearOfBirth: 1980,
          club: 'ABC',
          branch: 'ON',
          country: 'CAN',
          cffNumber: 'ABC124',
          validated: 'y'
        }];
      });
      it('seven out of eight fields are not provided', async () => {
        try {
          await savePlayers([{ 'name': 'Bill' }]);
        } catch (err) {
          expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(Object.keys(err.errors).length).toBe(7);
        }
      });
      it('invalid province', async () => {
        fields[0]['branch'] = 'XY';
        try {
          await savePlayers(fields);
          fail('should not reach here');
        } catch (err) {
          expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(Object.keys(err.errors).length).toBe(1);
        }
      });
      it('invalid validated indicator', async () => {
        fields[0]['validated'] = 'm';
        try {
          await savePlayers(fields);
        } catch (err) {
          expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(Object.keys(err.errors).length).toBe(1);
        }
      });
      it('all eight fields are provided', async () => {
        mockOnce('insertMany');
        await savePlayers(fields);
      });
    });
    describe('competition fields are validated', () => {
      it('check for required fields at top level', async () => {
        try {
          fields.creator = null;
          fields.competitionType = null;
          fields.competitionDate = null;
          fields.weapon = null;
          fields.gender = null;
          fields.ageCategory = null;
          fields.tournamentName = null;
          fields.competitionShortName = null;
          jest.spyOn(mygoose, 'findPlayerByCffNumber').mockResolvedValue({});
          jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
          jest.spyOn(mygoose, 'getCompetition').mockResolvedValue({code: 'a', name: 'b', zone: CompetitionZone.cff})
          await saveCompetitionResults(fields);
          fail('should not reach here');
        } catch (err) {
          expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(Object.keys(err.errors).length).toBe(7); // age category is handled separately
        }
      });
      it('at least one result must be provided', async () => {
        fields['results'] = [];
        jest.spyOn(mygoose, 'findPlayerByCffNumber').mockResolvedValue({});
        try {
          await saveCompetitionResults(fields);
          fail('should not reach here');
        } catch (err) {
          expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(Object.keys(err.errors).length).toBe(1);
        }
      });
      it('age category is invalid', async () => {
        jest.spyOn(mygoose, 'findPlayerByCffNumber').mockResolvedValue({});
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
        jest.spyOn(mygoose, 'findPlayerByCffNumber').mockResolvedValue({})
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
        mockOnce('insertOne');
        jest.spyOn(mygoose, 'findPlayerByCffNumber').mockResolvedValue({});
        jest.spyOn(mygoose, 'getCompetition').mockResolvedValue({code: 'a', name: 'b', zone: CompetitionZone.cff})
        jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
        await saveCompetitionResults(fields);
      });
      describe('CFF# validation from validation file', () => {
        it('participant with invalid CFF# is rejected', async () => {
          PlayerModel.findOne = jest.fn((params) => null);
          fields.results[0].cffNumber = "INVALID"
          jest.resetAllMocks()
          jest.spyOn(mygoose, 'findPlayerByCffNumber').mockResolvedValue(null);
          try {
            await saveCompetitionResults(fields)
            fail("should not get here")
          } catch (err) {
            expect(err).toBeInstanceOf(MultiMessageError);
            expect(err.errorMessages[0]).toBe("The CFF# INVALID was not found.")
          }
        });
        it('blank CFF# is not rejected', async () => {
          fields.results[0].cffNumber = '';
          PlayerModel.findOne = jest.fn((params) => null);
          jest.spyOn(mygoose, 'getCompetition').mockResolvedValue({code: 'a', name: 'b', zone: CompetitionZone.cff})
          jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
          mockOnce('insertOne');
          await saveCompetitionResults(fields);
        });
      });
      describe('competition results approval/rejection', () => {
        it('competition is approved', async () => {
          jest.resetAllMocks()
          jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
          const updateCompetitionResults = jest.spyOn(mygoose, 'updateCompetitionResults').mockImplementationOnce(jest.fn())
          await updateCompetitionStatus(fields._id, CompetitionStatus.approved )
          expect(updateCompetitionResults).toHaveBeenCalledWith(expect.objectContaining({status: CompetitionStatus.approved}))
        });
        it('competition is rejected', async () => {
          jest.resetAllMocks()
          jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
          const updateCompetitionResults = jest.spyOn(mygoose, 'updateCompetitionResults').mockImplementationOnce(jest.fn())
          await updateCompetitionStatus(fields._id, CompetitionStatus.rejected )
          expect(updateCompetitionResults).toHaveBeenCalledWith(expect.objectContaining({status: CompetitionStatus.rejected}))
        });
      });
      describe('CFF# format is considered when saving a participant in a competition', () => {
        it('save a participant is rejected', async () => {
          const invalidCffNumber = "ABC"
          try {
            await saveParticipantInCompetition("competitionId", "participantId", {cffNumber: invalidCffNumber} )
            fail("should not get here")
          } catch (e) {
            expect(e.errorMessages[0]).toBe(`Invalid CFF# format: ${invalidCffNumber}`)
          }
        });
        it('save a participant works', async () => {
          jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
          jest.spyOn(mygoose, 'queryListById').mockResolvedValue({ } )
          jest.spyOn(mygoose, 'save').mockResolvedValue(null)
          await saveParticipantInCompetition("competitionId", "participantId", {cffNumber: "C06-0516"} )
        });
      });
    });
    describe ('manage competitions', () => {
      const competition: Competition = {
        name: 'competition name',
        code: 'COMP_CODE',
        zone: CompetitionZone.cff
      }
      it('adds a competition successfully', async() => {
        mockOnce('insertOne');
        const createCompetitionMock = jest.spyOn(mygoose, 'createCompetition')
        await createCompetition(competition)
        expect(createCompetitionMock).toHaveBeenCalledWith(competition)
      })
      it('fails to add a competition as code already exists', async() => {
        jest.spyOn(mygoose, 'createCompetition').mockImplementation(() => {throw {code: 11000}})
        try {
          await createCompetition(competition)
          fail("should not get here")
        } catch(e) {
          expect(e.errorMessages[0]).toBe(`Competition with code "${competition.code}" already exists.`)
        }
      })
      it('fails to add for a reason other than competition code existing', async() => {
        jest.spyOn(mygoose, 'createCompetition').mockImplementation(() => {throw new Error("hi")} )
        try {
          await createCompetition(competition)
          fail("should not get here")
        } catch(e) {
          expect(e.message).toBe("hi")
        }
      })
      it('deletes competition successfully', async() => {
        mockOnce('deleteOne');
        const code = "myCompetitionCode"
        const deleteCompetitionMock = jest.spyOn(mygoose, 'deleteCompetition')
        await deleteCompetition(code)
        expect(deleteCompetitionMock).toHaveBeenCalledWith(code)
      })
      it('lists all competitions', async() => {
        const getCompetitionsMock = jest.spyOn(mygoose, 'getCompetitions').mockImplementation()
        await getCompetitions()
        expect(getCompetitionsMock).toHaveBeenCalledWith()
      })
    })
    describe('save classification file', () => {
    it('classification record saving is successful', async () => {
      mockOnce('insertMany');
      const classifications: PlayerClassification[] = [
        {weapon: 'ME', class: PlayerClass.A, lastName: 'Jones', firstName: 'Jim', cffNumber: 'C06-1234', club: 'ABC', province: 'ON'}
      ]
      await saveClassifications(classifications);
    });
  });
});

describe('age categories', () => {
  it('code already exists', async () => {
    jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory)
    try {
      await createAgeCategory(ageCategory)
      fail("should not get here")
    } catch(e) {
      expect(e.errorMessages[0]).toBe(`Code already exists: ${ageCategory.code}`)
    }
  });
})
