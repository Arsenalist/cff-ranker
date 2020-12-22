import { parseClassificationFileContents } from './classification-file';

describe('Classification File', () => {
  it('Parses classification file', async () => {
    const contents = 'Wpn ,Class,Lastname,Firstname,CFF Licence,Club,Prov\n' +
      'ME,A,BOISVERT-SIMARD,Hugues,C06-0559,STH,QC\n' +
      'ME,A,BRINCK-CROTEAU,Maxime,C06-0427,VGO,ON';
    const result = await parseClassificationFileContents(contents);
    expect(result.length).toBe(2);
    const row = result[0];
    expect(row.weapon).toBe('ME');
    expect(row.lastName).toBe('BOISVERT-SIMARD');
    expect(row.firstName).toBe('Hugues');
    expect(row.cffNumber).toBe('C06-0559');
    expect(row.club).toBe('STH');
    expect(row.province).toBe('QC');
  });
});
