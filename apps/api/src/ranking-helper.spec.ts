import { validateRankingParameters } from './ranking-helper';


describe("main.ts", ()=> {

  it("start date and end date are valid", () => {
    const startDate = '2020-05-17T19:41:00.162Z';
    const endDate = '2021-05-17T19:41:00.162Z';
    validateRankingParameters(startDate, endDate)
  });

  it("start date is valid, end date is not", () => {
    const startDate = '2020-05-17T19:41:00.162Z';
    const endDate = '20abcde';
    try {
      validateRankingParameters(startDate, endDate)
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toEqual('End date is invalid')
    }
  });

  it("start date is invalid, end date is valid", () => {
    const startDate = 'asdfasdf';
    const endDate = '2021-05-17T19:41:00.162Z';
    try {
      validateRankingParameters(startDate, endDate)
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toEqual('Start date is invalid')
    }
  });

  it("start date is invalid, end date is invalid", () => {
    const startDate = 'asdfasdf';
    const endDate = 'asdfdsf';
    try {
      validateRankingParameters(startDate, endDate)
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toEqual('Start and end date is invalid')
    }
  });


});
