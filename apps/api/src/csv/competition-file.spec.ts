import { decorateResultsWithWarnings, parseCompetitionFileContents } from './competition-file';

describe('competition file csv parsing', () => {
  const csv = "FFF;WIN;competition;sylvie clement;individuel\n" +
    "10/12/2011;fleuret;M;senior;FM CHALLENGE DE LA VILLE DE LONGUEUIL;FM OM\n" +
    "TEISSEIRE,Nicolas,1986,M,CAN,,;,,;C06-0516,QC,OM,,;1,t\n" +
    "VANHAASTER,Maximilien,1992,M,CAN,,;,,;C06-0019,QC,CRA,,;2,t\n" +
    "BRODEUR,Marc-Antoine,1993,M,CAN,,;,,;C06-0999,QC,OM,,;3,t"

  it('parse headers', async () => {
    const result = await parseCompetitionFileContents(csv);
    expect(result.creator).toBe("sylvie clement")
    expect(result.competitionType).toBe("individuel")
    expect(result.competitionDate).toBe("10/12/2011")
    expect(result.weapon).toBe("fleuret")
    expect(result.gender).toBe("M")
    expect(result.ageCategory).toBe("senior")
    expect(result.tournamentName).toBe("FM CHALLENGE DE LA VILLE DE LONGUEUIL")
    expect(result.competitionShortName).toBe("FM OM")
  });
  it('parse player results', async () => {
    const result = await parseCompetitionFileContents(csv);
    expect(result.results[0].surname).toBe("TEISSEIRE")
    expect(result.results[0].name).toBe("Nicolas")
    expect(result.results[0].yearOfBirth).toBe("1986")
    expect(result.results[0].gender).toBe("M")
    expect(result.results[0].country).toBe("CAN")
    expect(result.results[0].cffNumber).toBe("C06-0516")
    expect(result.results[0].branch).toBe("QC")
    expect(result.results[0].club).toBe("OM")
    expect(result.results[0].rank).toBe("1")
    expect(result.results[0].validated).toBe("t")
  });
  it('all results are read', async () => {
    const result = await parseCompetitionFileContents(csv);
    expect(result.results.length).toBe(3)
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
      expect(e.errorMessages[8]).toBe("Line 1: Missing Validated.")
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
      expect(e.errorMessages[8]).toBe("Line 1: Missing Validated.")
      expect(e.errorMessages[9]).toBe("Line 2: Missing Name.")
    }
  });
});

describe('decorate competition results with warnings', () => {
  it('CFF#', async () => {
    const competiton = {
      results: [{
        name: 'johnny'
      }]
    }
    const decorated = decorateResultsWithWarnings(competiton)
    expect(decorated.results[0].warnings.length).toBe(1)
    expect(decorated.results[0].warnings[0].type).toBe('MISSING_CFF_NUMBER')
  });
});
