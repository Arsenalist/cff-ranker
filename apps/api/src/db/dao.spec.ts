import { mockOnce } from '../../mockgoose';

const mongoose = require('mongoose');

import {savePlayers, saveCompetitionResults} from './dao';
import { MultiMessageError } from '../multi-message-error';

describe('validation file fields are validated', () => {
  let fields;
  beforeEach(() => {
    fields = [{
        surname: 'Smith',
        name: 'Bill',
        yearOfBirth: 1980,
        club: 'ABC' ,
        branch: 'ON',
        country: 'CAN',
        cffNumber: 'ABC124',
        validated: 'y'
      }];
  });
  it('seven out of eight fields are not provided', async () => {
    try {
      await savePlayers([{"name": "Bill"}]);
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(Object.keys(err.errors).length).toBe(7)
    }
  });
  it('invalid province', async () => {
    fields[0]["branch"] = "XY";
    try {
      await savePlayers(fields);
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(Object.keys(err.errors).length).toBe(1)
    }
  });
  it('invalid validated indicator', async () => {
    fields[0]["validated"] = "m";
    try {
      await savePlayers(fields);
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(Object.keys(err.errors).length).toBe(1)
    }
  });
  it('all eight fields are provided', async () => {
    mockOnce('insertMany');
    await savePlayers(fields);
  });
});

describe('competition fields are validated', () => {
  let fields;
  beforeEach(() => {
    fields = {
      creator: "Bill Smith",
      competitionType: "individuel",
      competitionDate: "10/12/2011",
      weapon: "fleuret",
      gender: "M",
      ageCategory: "senior",
      tournamentName: "FM CHALLENGE DE LA VILLE DE LONGUEUIL",
      competitionShortName: "FM OM",
      results: [{
        surname: "TEISSEIRE",
        name: "Nicolas",
        yearOfBirth: 1986,
        gender: "M",
        country: "CAN",
        cffNumber: "C06-0516",
        branch: "QC",
        club: "OM",
        rank: 1,
        validated: "t"
      }]
    };
  });
  it('check for required fields at top level', async () => {
    try {
      await saveCompetitionResults(null);
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(Object.keys(err.errors).length).toBe(8)
    }
  });
  it('at least one result must be provided', async () => {
    fields["results"] = []
    try {
      await saveCompetitionResults(fields);
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(Object.keys(err.errors).length).toBe(1)
    }
  });
  it('results are valid', async () => {
    mockOnce('insertOne');
    await saveCompetitionResults(fields);
  });
});

describe('CFF# validation from validation file', () => {
  let fields;
  beforeEach(() => {
    fields = {
      creator: "Bill Smith",
      competitionType: "individuel",
      competitionDate: "10/12/2011",
      weapon: "fleuret",
      gender: "M",
      ageCategory: "senior",
      tournamentName: "FM CHALLENGE DE LA VILLE DE LONGUEUIL",
      competitionShortName: "FM OM",
      results: [{
        surname: "TEISSEIRE",
        name: "Nicolas",
        yearOfBirth: 1986,
        gender: "M",
        country: "CAN",
        cffNumber: "INVALID",
        branch: "QC",
        club: "OM",
        rank: 1,
        validated: "t"
      }]
    };
  });
  it('invalid record is rejected', async () => {
    jest.mock('./dao.js', () => (
      {
        ...(jest.requireActual('./dao.js')),
        findPlayerByCffNumber: jest.fn(cffNumber => false)
      }
    ))
    try {
      await saveCompetitionResults(fields);
    } catch (err) {
      expect(err).toBeInstanceOf(MultiMessageError);
      expect(err.errorMessages[0]).toBe("The CFF# INVALID was not found.")
    }
  });
});
