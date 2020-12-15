import { mockOnce } from '../../mockgoose';

const mongoose = require('mongoose');
import { savePlayers, saveCompetitionResults } from './dao';
import { MultiMessageError } from '../multi-message-error';
import { PlayerModel } from './schemas';
import { CompetitionResults } from '@cff/api-interfaces';
import * as mygoose from './mygoose';

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
          await saveCompetitionResults(fields);
          fail('should not reach here');
        } catch (err) {
          expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(Object.keys(err.errors).length).toBe(8);
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
      it('results are valid', async () => {
        mockOnce('insertOne');
        jest.spyOn(mygoose, 'findPlayerByCffNumber').mockResolvedValue({});
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
          mockOnce('insertOne');
          await saveCompetitionResults(fields);
        });
      });
    });
  });
