import { decorateCompetitionResultWithWarnings, parseCompetitionFileContents } from '@cff/csv';

const validCsvContents = "FFF;WIN;competition;sylvie clement;individuel\n" +
  "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
  "TEISSEIRE,Nicolas,1986,M,CAN,,;,,;C06-0516,QC,OM,,;1,t\n" +
  "VANHAASTER,Maximilien,1992,M,CAN,,;,,;C06-0019,QC,CRA,,;2,t\n" +
  "BRODEUR,Marc-Antoine,1993,M,CAN,,;,,;C06-0999,QC,OM,,;3,t\n" +
  "DAVID,Francois-Olivier,1994,M,CAN,,;,,;C06-1004,QC,OM,,;3,t\n" +
  "BONTEMS,Pierre-Olivier,1988,M,CAN,,;,,;C10-0065,QC,OM,,;5,t\n" +
  "PROVENCHER,Francois,1994,M,CAN,,;,,;C06-0446,ON,OTT,,;6,t"

describe('competition file csv parsing', () => {

  it('parse headers', async () => {
    const result = await parseCompetitionFileContents(validCsvContents);
    expect(result.creator).toBe("sylvie clement")
    expect(result.competitionType).toBe("individuel")
    expect(result.competitionDate.getDate()).toBe(10)
    expect(result.competitionDate.getMonth()).toBe(11)
    expect(result.competitionDate.getFullYear()).toBe(2011)
    expect(result.weapon).toBe("fleuret")
    expect(result.gender).toBe("M")
    expect(result.ageCategory).toBe("senior")
    expect(result.tournamentName).toBe("FM CHALLENGE DE LA VILLE DE LONGUEUIL")
    expect(result.competitionShortName).toBe("FM OM")
  });
  it ('weapon is not provided', async() => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM"
    try {
      await parseCompetitionFileContents(csv);
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toBe("The weapon is not specified.")
    }
  })
  it ('other header fields are not provided', async() => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      ";;;;;FM OM"
    try {
      await parseCompetitionFileContents(csv);
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toBe("The competition date is not specified.")
      expect(e.errorMessages[1]).toBe("The weapon is not specified.")
      expect(e.errorMessages[2]).toBe("The gender is not specified.")
      expect(e.errorMessages[3]).toBe("The age category is not specified.")
      expect(e.errorMessages[4]).toBe("The tournament name is not specified.")

    }
  })
  it ('header and results are not able to be validated', async() => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
    "TEISSEIRE,Nicolas,,M,CAN,,;,,;C06-0516,QC,OM,,;1,t";
    try {
      await parseCompetitionFileContents(csv);
      fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toBe("The weapon is not specified.")
      expect(e.errorMessages[1]).toBe("Line 1: Missing YOB.")
    }
  })
  it('all results are valid, but not enough entrants', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      "TEISSEIRE,Nicolas,1986,M,CAN,,;,,;C06-0516,QC,OM,,;1,t\n" +
      "VANHAASTER,Maximilien,1992,M,CAN,,;,,;C06-0019,QC,CRA,,;2,t\n" +
      "BRODEUR,Marc-Antoine,1993,M,CAN,,;,,;C06-0999,QC,OM,,;3,t\n" +
      "DAVID,Francois-Olivier,1994,M,CAN,,;,,;C06-1004,QC,OM,,;3,t"
    try {
       await parseCompetitionFileContents(csv);
       fail("should not get here")
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Not enough entrants.")
    }
  });
  it('all results are valid', async () => {
    const result = await parseCompetitionFileContents(validCsvContents);
    expect(result.results.length).toBe(6)
    expect(result.results[0].surname).toBe("TEISSEIRE")
    expect(result.results[0].name).toBe("Nicolas")
    expect(result.results[0].yearOfBirth).toBe("1986")
    expect(result.results[0].gender).toBe("M")
    expect(result.results[0].country).toBe("CAN")
    expect(result.results[0].cffNumber).toBe("C06-0516")
    expect(result.results[0].branch).toBe("QC")
    expect(result.results[0].club).toBe("OM")
    expect(result.results[0].rank).toBe("1")
    expect(result.results[0].completed).toBe("t")
  });
  it('Year of Birth can also be of m/d/yyyy format', async () => {
    const validCsvContents = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      "TEISSEIRE,Nicolas,1/1/1986,M,CAN,,;,,;C06-0516,QC,OM,,;1,t\n" +
      "VANHAASTER,Maximilien,1992,M,CAN,,;,,;C06-0019,QC,CRA,,;2,t\n" +
      "BRODEUR,Marc-Antoine,1/2/1993,M,CAN,,;,,;C06-0999,QC,OM,,;3,t\n" +
      "DAVID,Francois-Olivier,3/5/1994,M,CAN,,;,,;C06-1004,QC,OM,,;3,t\n" +
      "BONTEMS,Pierre-Olivier,1988,M,CAN,,;,,;C10-0065,QC,OM,,;5,t\n" +
      "PROVENCHER,Francois,1994,M,CAN,,;,,;C06-0446,ON,OTT,,;6,t"
    const result = await parseCompetitionFileContents(validCsvContents);
    expect(result.results.length).toBe(6)
    expect(result.results[0].yearOfBirth).toBe("1986")
    expect(result.results[1].yearOfBirth).toBe("1992")
    expect(result.results[2].yearOfBirth).toBe("1993")
    expect(result.results[3].yearOfBirth).toBe("1994")
    expect(result.results[4].yearOfBirth).toBe("1988")
    expect(result.results[5].yearOfBirth).toBe("1994")
  });
});

describe('competition file errors', () => {

  it('year of birth is missing', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      "TEISSEIRE,Nicolas,,M,CAN,,;,,;C06-0516,QC,OM,,;1,t";
    try {
      await parseCompetitionFileContents(csv);
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Line 1: Missing YOB.")
    }
  });
  it('year of birth and surname are missing', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      ",Nicolas,,M,CAN,,;,,;C06-0516,QC,OM,,;1,t";
    try {
      await parseCompetitionFileContents(csv);
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Line 1: Missing Surname.")
      expect(e.errorMessages[1]).toBe("Line 1: Missing YOB.")
    }
  });
  it('all fields are missing', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      ",,,,,,;,,;,,,,;,";
    try {
      await parseCompetitionFileContents(csv);
      fail('it should not reach here');
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Line 1: Missing Surname.")
      expect(e.errorMessages[1]).toBe("Line 1: Missing Name.")
      expect(e.errorMessages[2]).toBe("Line 1: Missing YOB.")
      expect(e.errorMessages[3]).toBe("Line 1: Missing Gender.")
      expect(e.errorMessages[4]).toBe("Line 1: Missing Country.")
      expect(e.errorMessages[5]).toBe("Line 1: Missing Branch.")
      expect(e.errorMessages[6]).toBe("Line 1: Missing Club.")
      expect(e.errorMessages[7]).toBe("Line 1: Missing Rank.")
      expect(e.errorMessages[8]).toBe("Line 1: Missing Completed.")
    }
  });
  it('all fields missing in one line, some in the other', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      ",,,,,,;,,;,,,,;,\n" +
      "TEISSEIRE,,1986,M,CAN,,;,,;,QC,OM,,;1,t";
    try {
      await parseCompetitionFileContents(csv);
      fail('it should not reach here');
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Line 1: Missing Surname.")
      expect(e.errorMessages[1]).toBe("Line 1: Missing Name.")
      expect(e.errorMessages[2]).toBe("Line 1: Missing YOB.")
      expect(e.errorMessages[3]).toBe("Line 1: Missing Gender.")
      expect(e.errorMessages[4]).toBe("Line 1: Missing Country.")
      expect(e.errorMessages[5]).toBe("Line 1: Missing Branch.")
      expect(e.errorMessages[6]).toBe("Line 1: Missing Club.")
      expect(e.errorMessages[7]).toBe("Line 1: Missing Rank.")
      expect(e.errorMessages[8]).toBe("Line 1: Missing Completed.")
      expect(e.errorMessages[9]).toBe("Line 2: Missing Name.")
    }
  });
  it('Incorrect CFF# (all letters)', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      "TEISSEIRE,Nicolas,1986,M,CAN,,;,,;LETTERS,QC,OM,,;1,t"
    try {
      await parseCompetitionFileContents(csv);
      fail('it should not reach here');
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Line 1: CFF# LETTERS is of incorrect format.")
    }
  });
  it('Incorrect CFF# (two letters to start)', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      "TEISSEIRE,Nicolas,1986,M,CAN,,;,,;CC12-123,QC,OM,,;1,t"
    try {
      await parseCompetitionFileContents(csv);
      fail('it should not reach here');
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Line 1: CFF# CC12-123 is of incorrect format.")
    }
  });
  it('Incorrect CFF# (no dash)', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      "TEISSEIRE,Nicolas,1986,M,CAN,,;,,;C12123,QC,OM,,;1,t"
    try {
      await parseCompetitionFileContents(csv);
      fail('it should not reach here');
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Line 1: CFF# C12123 is of incorrect format.")
    }
  });
  it('Incorrect CFF# (not enough trailing digits)', async () => {
    const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
      "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
      "TEISSEIRE,Nicolas,1986,M,CAN,,;,,;C12-123,QC,OM,,;1,t"
    try {
      await parseCompetitionFileContents(csv);
      fail('it should not reach here');
    } catch (e) {
      expect(e.errorMessages[0]).toBe("Line 1: CFF# C12-123 is of incorrect format.")
    }
  });
  it('Correct CFF# format', async () => {
    await parseCompetitionFileContents(validCsvContents);
  });
});

describe('decorate competition results with warnings', () => {
  it('CFF#', async () => {
    const competiton = {
      weapon: 'fleuret',
      gender: 'M',
      ageCategory: 'senior',
      tournamentName: 'FM OM',
      competitionShortName: 'FM OM',
      results: [{
        name: 'johnny',
        surname: 'smith',
        gender: 'M',
        cffNumber: '',
        country: 'CAN',
        branch: 'ON',
        club: 'CL',
        yearOfBirth: 1980,
        rank: 1,
        validated: 'y',
        warnings: []
      }]
    }
    const decorated = decorateCompetitionResultWithWarnings(competiton)
    expect(decorated.results[0].warnings.length).toBe(1)
    expect(decorated.results[0].warnings[0].type).toBe('MISSING_CFF_NUMBER')
  });
});
