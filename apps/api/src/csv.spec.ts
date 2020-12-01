import { parseValidationFileContents, parseCompetitionFileContents } from './csv';

describe('validation file csv parsing', () => {
  beforeEach(() => {
  });
  it('parses column names for validation file correctly', async () => {
    const contents = "Surname,Name,YOB,Gender,Club,Branch,Country,CFF#,Validated\n" +
                     "Lowry,Kyle,1986,M,TOR,ON,CAN,123,y";
    const result = await parseValidationFileContents(contents);
    expect(result.length).toBe(1);
    const row = result[0];
    expect(row.surname).toBe("Lowry");
    expect(row.name).toBe("Kyle");
    expect(row.yearOfBirth).toBe("1986");
    expect(row.club).toBe("TOR");
    expect(row.branch).toBe("ON");
    expect(row.country).toBe("CAN");
    expect(row.cffNumber).toBe("123");
    expect(row.validated).toBe("y");
  });
});

describe('competition file csv parsing - format 2', () => {
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
    expect(result.level).toBe("senior")
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
    expect(result.results[0].figureThisOut).toBe("t")
  });
});
