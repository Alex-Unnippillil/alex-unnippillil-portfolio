import stem from '../search/stemmer';
import logZeroResult from '../metrics/searchTelemetry';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const synonyms: Record<string, string[]> = require('../../data/search/synonyms.json');

export interface SearchResponse {
  results: string[];
  suggestion: string | null;
}

export function suggestCorrection(query: string): string | null {
  const stemmed = stem(query);
  for (const [canonical, syns] of Object.entries(synonyms)) {
    if (canonical === stemmed || syns.includes(stemmed)) {
      return canonical;
    }
  }
  return null;
}

export function searchWithSuggestions(
  query: string,
  searchFn: (q: string) => string[],
): SearchResponse {
  const suggestion = suggestCorrection(query);
  const toSearch = suggestion ?? query;
  const results = searchFn(toSearch);

  if (results.length === 0) {
    logZeroResult(query);
  }

  return { results, suggestion };
}
