import { AgeCategory } from '@cff/api-interfaces';
import * as mygoose from './mygoose';
import { MultiMessageError } from '@cff/common';

export async function updateAgeCategory(ageCategory: AgeCategory) {
  await mygoose.updateAgeCategory(ageCategory);
}

export async function deleteAgeCategory(code: string) {
  await mygoose.deleteAgeCategory(code);
}

export async function createAgeCategory(ageCategory: AgeCategory) {
  const existing = await mygoose.getAgeCategoryByCode(ageCategory.code);
  if (existing) {
    throw new MultiMessageError([`Code already exists: ${ageCategory.code}`]);
  }
  await mygoose.createAgeCategory(ageCategory);
}

export async function getAgeCategories(): Promise<AgeCategory[]> {
  return mygoose.getAgeCategories();
}
