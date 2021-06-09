import { Competition } from '@cff/api-interfaces';
import * as mygoose from './mygoose';
import { MultiMessageError } from '@cff/common';

export async function getCompetitionByCode(code: string): Promise<Competition> {
  const competition: Competition = await mygoose.getCompetition(code);
  if (!competition) {
    throw new MultiMessageError([`The competition code "${code}" does not exist.`]);
  }
  return competition;
}

export async function createCompetition(competition: Competition) {
  try {
    await mygoose.createCompetition(competition);
  } catch (e) {
    if (e.code && e.code === 11000) {
      throw new MultiMessageError([`Competition with code "${competition.code}" already exists.`]);
    } else {
      throw e;
    }
  }
}

export async function saveCompetition(competition: Competition) {
  const c = await mygoose.getCompetition(competition.code)
  c.name = competition.name
  await mygoose.updateCompetition(c)
}

export async function deleteCompetition(code: string) {
  await mygoose.deleteCompetition(code)
}

export async function getCompetitions(): Promise<Competition[]> {
  return await mygoose.getCompetitions();
}


