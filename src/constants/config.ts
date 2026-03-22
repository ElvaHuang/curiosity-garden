export const CONFIG = {
  claude: {
    model: 'anthropic/claude-sonnet-4.5',
    // Set your API key here for the hackathon demo.
    // In production, this should NEVER be in client code.
    apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
    baseURL: process.env.EXPO_PUBLIC_ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
  },
  wikipedia: {
    baseUrl: 'https://simple.wikipedia.org/w/api.php',
  },
  garden: {
    columns: 3,
    cellWidth: 120,
    cellHeight: 140,
  },
} as const;
