import { savePlayers } from './player';
import { mockOnce } from '../../mockgoose';
import * as mongoose from 'mongoose';

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
