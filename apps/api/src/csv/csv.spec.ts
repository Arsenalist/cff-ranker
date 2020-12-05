import { parseValidationFileContents} from './csv';


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

