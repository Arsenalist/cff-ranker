import * as mygoose from './mygoose';
import { createAgeCategory } from './age-category';
import { AgeCategory } from '@cff/api-interfaces';
import { mongoose } from '@typegoose/typegoose';

const ageCategory: AgeCategory = {
  _id: new mongoose.Types.ObjectId("600ae95ca9a08111903e5066"),
  code: 'senior',
  name: 'Senior',
  minimumForce: 40,
  yearOfBirth: 1980
}

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
