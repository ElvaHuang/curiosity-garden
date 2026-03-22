import { fetchWikipediaContext } from '../../src/services/wikipedia';

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return Response.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    const context = await fetchWikipediaContext(query);

    return Response.json({ context });
  } catch (error: any) {
    console.error('Wikipedia API error:', error);
    return Response.json(
      { error: error.message || 'Wikipedia fetch failed' },
      { status: 500 }
    );
  }
}
