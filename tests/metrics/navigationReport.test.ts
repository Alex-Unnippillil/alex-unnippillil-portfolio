import navigationReport from '../../src/metrics/navigationReport';

describe('navigationReport', () => {
  it('aggregates session paths and drop-offs', () => {
    const sessions = [
      ['home', 'about', 'contact'],
      ['home', 'about'],
      ['home', 'blog'],
    ];

    const report = navigationReport(sessions);

    expect(report.paths['home>about>contact']).toBe(1);
    expect(report.paths['home>about']).toBe(1);
    expect(report.paths['home>blog']).toBe(1);

    expect(report.dropOffs.about).toBe(1);
    expect(report.dropOffs.contact).toBe(1);
    expect(report.dropOffs.blog).toBe(1);
  });
});
