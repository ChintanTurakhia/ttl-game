import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-pink-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-600">
          Two Truths and a Lie
        </h1>

        <p className="text-gray-600 text-center">
          Create three statements - two truths and one lie - then challenge
          others to guess which one is the lie!
        </p>

        <div className="flex flex-col space-y-4">
          <Link
            href="/create"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg text-center"
          >
            Create Your Statements
          </Link>

          <Link
            href="/play"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg text-center"
          >
            Play the Game
          </Link>

          <Link
            href="/leaderboard"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-center"
          >
            View Leaderboard
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center pt-4">
          A Farcaster Mini-App by TTL Game
        </p>
      </div>
    </main>
  );
}
