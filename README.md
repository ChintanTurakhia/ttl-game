# Two Truths and a Lie - Farcaster Mini-App

A mini-app for Farcaster users to play the classic "Two Truths and a Lie" game. Create statements about yourself (two truths and one lie), then challenge others to guess which one is the lie!

## Features

- Create sets of statements (two truths, one lie)
- Play by guessing which statements from other users are lies
- Score points for correct guesses
- View the leaderboard of top players

## Technology Stack

- Next.js
- Tailwind CSS
- Farcaster Frames V2 SDK
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ttl-game
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:

```
NEXT_PUBLIC_APP_URL=<your-deployed-url>
```

For local development, you can leave this as the default (`http://localhost:3000`).

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or AWS Amplify.

Example for Vercel:

```bash
npm install -g vercel
vercel
```

## Using the Mini-App

1. Open the mini-app in Farcaster
2. Authenticate with your Farcaster account
3. Create your two truths and one lie
4. Play by guessing which statements from other users are lies
5. Check the leaderboard to see your ranking

## License

MIT

## Credits

Created for Farcaster Frames V2
