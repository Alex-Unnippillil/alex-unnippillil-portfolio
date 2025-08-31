export interface NavigationReport {
  /**
   * Aggregated counts of full session paths.
   * The key is a path joined by '>' characters.
   */
  paths: Record<string, number>;
  /**
   * Number of times users dropped off on a particular page.
   * Key is the last page of a session.
   */
  dropOffs: Record<string, number>;
}

/**
 * Build a navigation report from a list of session paths.
 *
 * @param sessions - array of session path arrays
 * @returns aggregated navigation report
 */
export default function navigationReport(sessions: string[][]): NavigationReport {
  const report: NavigationReport = {
    paths: {},
    dropOffs: {},
  };

  sessions.forEach((session) => {
    if (session.length === 0) {
      return;
    }

    const pathKey = session.join('>');
    report.paths[pathKey] = (report.paths[pathKey] || 0) + 1;

    const last = session[session.length - 1];
    report.dropOffs[last] = (report.dropOffs[last] || 0) + 1;
  });

  return report;
}
