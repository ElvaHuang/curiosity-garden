export const CONFIG = {
  claude: {
    model: 'claude-sonnet-4-20250514',
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
