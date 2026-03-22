# Curiosity Garden 🌱

An AI-powered educational app that nurtures children's curiosity through Socratic dialogue. Every question a child asks becomes a seed planted in their personal garden — and as they explore deeper, their plants grow.

## The Idea

Kids are naturally curious, but they don't always have the right environment to explore their questions deeply. Curiosity Garden catches those moments. Instead of giving answers, it guides children to think through problems themselves using the Socratic method — asking questions, providing just enough information when they're stuck, and celebrating their thinking.

**Target audience:** Primary school students (ages 6–12)

## How It Works

1. **Plant a Seed** — Ask any question: "Why don't we have eight legs?" or "How do computers think?"
2. **Grow Through Dialogue** — An AI companion named Sprout guides exploration through questions, not answers. When you're stuck, Sprout gives you a small hint to keep going.
3. **Watch Your Garden Grow** — Each question becomes a plant. The deeper you explore, the more it grows:
   - 🫘 **Seed** → just planted
   - 🌱 **Sprout** → 2–4 thoughtful exchanges
   - 🌼 **Blossom** → 5–8 exchanges
   - 🌻 **Fruit** → 9+ exchanges, fully explored!
4. **Explore Connections** — Browse all your questions, search by topic, and see patterns in what you're curious about.

## Plant Types

Questions are automatically classified into categories, each with its own plant species:

| Category | Plant | Topics |
|----------|-------|--------|
| 🌻 Sunflower | Nature | Science, animals, weather, space |
| 🌵 Crystal Cactus | Numbers | Math, patterns, shapes |
| 🌳 Story Tree | Stories | History, books, mythology |
| 🌿 Gear Vine | How Things Work | Machines, technology, inventions |
| 🫐 Berry Bush | People | Cultures, feelings, society |
| 🍄 Wonder Mushroom | Wonder | Philosophy, imagination, "why" questions |

## Tech Stack

- **Frontend:** React Native + Expo (cross-platform: iOS, Android, Web)
- **AI:** Claude API (Anthropic) via Zenmux gateway
- **Knowledge:** Simple English Wikipedia API for age-appropriate factual grounding
- **Storage:** AsyncStorage (local-first, no account needed)
- **Navigation:** Expo Router (file-based routing)

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- An Anthropic API key (or Zenmux key)

### Setup

```bash
git clone https://github.com/ElvaHuang/curiosity-garden.git
cd curiosity-garden
npm install
```

Create a `.env` file:

```
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_api_key_here
EXPO_PUBLIC_ANTHROPIC_BASE_URL=https://zenmux.ai/api/anthropic
```

### Run

```bash
npm start
```

Scan the QR code with Expo Go (iOS/Android) or press `w` to open in browser.

## Project Structure

```
app/                    # Screens & API routes (Expo Router)
  (tabs)/               # Tab screens: Garden, Explore, Profile
  ask/[seedId].tsx      # Socratic chat screen
  new-question.tsx      # Plant a new seed
  api/                  # Serverless API routes
src/
  components/           # Reusable UI components
  contexts/             # React contexts (Garden, Chat state)
  db/                   # AsyncStorage persistence layer
  services/             # Claude API client, Wikipedia fetcher
  prompts/              # System prompts for Socratic tutor
  constants/            # Theme, plant definitions, config
  utils/                # Growth stage logic, garden layout
```

## Key Design Decisions

- **Socratic method over Q&A** — The AI never gives direct answers. It asks guiding questions and only provides hints when the child is stuck.
- **Curated knowledge** — Uses Simple English Wikipedia (280k+ articles written for children/ESL learners) to ground responses in accurate, age-appropriate content.
- **Local-first** — No accounts, no cloud database. Everything persists on-device for privacy and simplicity.
- **Garden metaphor** — Gamification through growth, not points or scores. The reward is seeing your curiosity bloom.

## License

MIT
