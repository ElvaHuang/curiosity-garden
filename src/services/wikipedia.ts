import { CONFIG } from '../constants/config';

const cache = new Map<string, string>();

export async function fetchWikipediaContext(query: string): Promise<string | null> {
  const cacheKey = query.toLowerCase().trim();
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    // Try exact title match first
    const extract = await fetchExtract(query);
    if (extract) {
      cache.set(cacheKey, extract);
      return extract;
    }

    // Fall back to search
    const searchResult = await searchWikipedia(query);
    if (searchResult) {
      const searchExtract = await fetchExtract(searchResult);
      if (searchExtract) {
        cache.set(cacheKey, searchExtract);
        return searchExtract;
      }
    }

    return null;
  } catch (error) {
    console.warn('Wikipedia fetch failed:', error);
    return null;
  }
}

async function fetchExtract(title: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'extracts',
    exintro: 'true',
    explaintext: 'true',
    redirects: '1',
    titles: title,
    origin: '*',
  });

  const response = await fetch(`${CONFIG.wikipedia.baseUrl}?${params}`);
  const data = await response.json();
  const pages = data.query?.pages;
  if (!pages) return null;

  const page = Object.values(pages)[0] as any;
  if (page.missing !== undefined || !page.extract) return null;

  // Limit to first 500 chars to keep context manageable
  return page.extract.slice(0, 500);
}

async function searchWikipedia(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    list: 'search',
    srsearch: query,
    srlimit: '1',
    origin: '*',
  });

  const response = await fetch(`${CONFIG.wikipedia.baseUrl}?${params}`);
  const data = await response.json();
  const results = data.query?.search;
  if (!results || results.length === 0) return null;

  return results[0].title;
}
