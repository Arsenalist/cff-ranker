import { Competition, CompetitionZone } from '@cff/api-interfaces';
import { mockOnce } from '../../mockgoose';
import * as mygoose from './mygoose';
import { createCompetition, deleteCompetition, getCompetitions, saveCompetition } from './competition';

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
  it('saves competition name only', async() => {
    const existingCompetition: Competition = {name: "oldName", code: "oldCode"}
    const newCompetition: Competition = {name: "newName", code: "newCode"}
    jest.spyOn(mygoose, 'getCompetition').mockResolvedValueOnce(existingCompetition)
    const updateCompetitionMock = jest.spyOn(mygoose, 'updateCompetition').mockImplementation(jest.fn())
    await saveCompetition(newCompetition)
    expect(updateCompetitionMock).toHaveBeenCalledWith(
      {name: newCompetition.name, code: existingCompetition.code}
    )
  })
})
