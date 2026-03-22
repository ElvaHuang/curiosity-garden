import { classifyQuestion } from '../../src/services/claude';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { question } = body as { question: string };

    const category = await classifyQuestion(question);

    return Response.json({ category });
  } catch (error: any) {
    console.error('Classify API error:', error);
    return Response.json(
      { error: error.message || 'Classification failed' },
      { status: 500 }
    );
  }
}
