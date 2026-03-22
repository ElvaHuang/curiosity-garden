import { sendSocraticMessage } from '../../src/services/claude';
import { fetchWikipediaContext } from '../../src/services/wikipedia';
import { ConversationMessage } from '../../src/types';
import { calculateDepth, getGrowthStage } from '../../src/utils/growthStages';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { messages, question } = body as {
      messages: ConversationMessage[];
      question: string;
    };

    // Fetch Wikipedia context on first message or if only 1-2 messages
    let wikipediaContext: string | null = null;
    if (messages.length <= 2) {
      wikipediaContext = await fetchWikipediaContext(question);
    }

    const assistantResponse = await sendSocraticMessage(messages, wikipediaContext);

    const depth = calculateDepth(messages);
    const growthStage = getGrowthStage(depth);

    return Response.json({
      response: assistantResponse,
      depth,
      growthStage,
      hasWikipediaContext: !!wikipediaContext,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
