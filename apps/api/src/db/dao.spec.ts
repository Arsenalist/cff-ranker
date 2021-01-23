import { mockOnce } from '../../mockgoose';
import {
  saveClassifications,
  saveCompetitionResults, saveParticipantInCompetitionResults,
  updateCompetitionResultsStatus
} from './dao';
import { MultiMessageError } from '@cff/common';
import { PlayerModel } from './schemas';
import {
  AgeCategory,
  CompetitionResults,
  CompetitionStatus,
  CompetitionZone,
  PlayerClass,
  PlayerClassification
} from '@cff/api-interfaces';
import * as mygoose from './mygoose';
import { savePlayers } from './player';

const mongoose = require('mongoose');

const ageCategory: AgeCategory = {
  _id: new mongoose.Types.ObjectId("600ae95ca9a08111903e5066"),
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
          jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue({});
          jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
          jest.spyOn(mygoose, 'getCompetition').mockResolvedValue({code: 'a', name: 'b', zone: CompetitionZone.cff})

          await saveCompetitionResults(fields);
          fail('should not reach here');
        } catch (err) {
          console.log(err)
          expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(Object.keys(err.errors).length).toBe(7); // age category is handled separately
        }
      });
      it('age category is invalid', async () => {
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
        mockOnce('insertOne');
        jest.spyOn(mygoose, 'validateParticipant').mockResolvedValue({});
        jest.spyOn(mygoose, 'getCompetition').mockResolvedValue({code: 'a', name: 'b', zone: CompetitionZone.cff})
        jest.spyOn(mygoose, 'getAgeCategoryByCode').mockResolvedValue(ageCategory);
        const saveCompetitionResultsSpy = jest.spyOn(mygoose, 'saveCompetitionResults').mockImplementation(jest.fn())
        await saveCompetitionResults(fields);
        expect(saveCompetitionResultsSpy.mock.calls[0][0].status).toBe(CompetitionStatus.approved)
      });
      describe('CFF# validation from validation file', () => {
        it('participant with invalid CFF# is rejected', async () => {
          PlayerModel.findOne = jest.fn((params) => null);
          fields.results[0].cffNumber = "INVALID_CFFNUMBER"
          fields.results[0].name = "INVALID_NAME"
          fields.results[0].surname = "INVALID_SURNAME"
          fields.results[0].yearOfBirth = 2000
          fields.results[0].gender = "INVALID_GENDER"
          jest.resetAllMocks()
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
      describe('competition results approval/rejection', () => {
        it('competition is approved', async () => {
          jest.resetAllMocks()
          jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
          const updateCompetitionResults = jest.spyOn(mygoose, 'updateCompetitionResults').mockImplementationOnce(jest.fn())
          await updateCompetitionResultsStatus(fields._id, CompetitionStatus.approved )
          expect(updateCompetitionResults).toHaveBeenCalledWith(expect.objectContaining({status: CompetitionStatus.approved}))
        });
        it('competition is rejected', async () => {
          jest.resetAllMocks()
          jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
          const updateCompetitionResults = jest.spyOn(mygoose, 'updateCompetitionResults').mockImplementationOnce(jest.fn())
          await updateCompetitionResultsStatus(fields._id, CompetitionStatus.rejected )
          expect(updateCompetitionResults).toHaveBeenCalledWith(expect.objectContaining({status: CompetitionStatus.rejected}))
        });
      });
      describe('CFF# format is considered when saving a participant in a competition', () => {
        it('save a participant is rejected', async () => {
          const invalidCffNumber = "ABC"
          try {
            await saveParticipantInCompetitionResults("competitionId", "participantId", {cffNumber: invalidCffNumber} )
            fail("should not get here")
          } catch (e) {
            expect(e.errorMessages[0]).toBe(`Invalid CFF# format: ${invalidCffNumber}`)
          }
        });
        it('save a participant works', async () => {
          jest.spyOn(mygoose, 'findCompetitionResult').mockResolvedValue(fields)
          jest.spyOn(mygoose, 'queryListById').mockResolvedValue({ } )
          jest.spyOn(mygoose, 'save').mockResolvedValue(null)
          await saveParticipantInCompetitionResults("competitionId", "participantId", {cffNumber: "C06-0516"} )
        });
      });
    });
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

