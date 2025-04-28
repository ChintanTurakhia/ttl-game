"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DB, Statement } from "@/lib/db";
import { viewProfile } from "@/lib/frame";

export default function PlayPage() {
  const [userFid, setUserFid] = useState<number | null>(null);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState<number | null>(null);
  const [isGuessing, setIsGuessing] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [noStatementsToPlay, setNoStatementsToPlay] = useState(false);

  useEffect(() => {
    // Check if user is authenticated through Farcaster
    const checkAuth = () => {
      if (window.userFid) {
        setUserFid(window.userFid);
        return true;
      }
      return false;
    };

    if (!checkAuth()) {
      // Poll for userFid as it might be set after frame initialization
      const interval = setInterval(() => {
        if (checkAuth()) {
          clearInterval(interval);
          loadStatements();
        }
      }, 500);

      return () => clearInterval(interval);
    } else {
      loadStatements();
    }
  }, []);

  const loadStatements = () => {
    if (!window.userFid) return;

    const statementsToPlay = DB.getStatementsToPlay(window.userFid);

    if (statementsToPlay.length === 0) {
      setNoStatementsToPlay(true);
    } else {
      // Shuffle the statements
      const shuffled = [...statementsToPlay].sort(() => 0.5 - Math.random());
      setStatements(shuffled);

      // Get user score
      setUserScore(DB.getUserScore(window.userFid));
    }
  };

  const handleGuess = () => {
    if (selectedGuess === null || !userFid) return;

    setIsGuessing(true);

    const currentStatement = statements[currentIndex];
    const isCorrect = selectedGuess === currentStatement.lieIndex;

    // Update scores
    if (isCorrect) {
      DB.updateScore(userFid, 1); // Add point to guesser
      setUserScore((prev) => prev + 1);
      setResult("correct");
    } else {
      DB.updateScore(currentStatement.userFid, 1); // Add point to statement creator
      setResult("incorrect");
    }

    setIsGuessing(false);
  };

  const handleNext = () => {
    setSelectedGuess(null);
    setResult(null);

    if (currentIndex < statements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of available statements
      setNoStatementsToPlay(true);
    }
  };

  const currentStatement = statements[currentIndex];

  if (!userFid) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-pink-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-pink-600">
            Loading...
          </h1>
          <p className="text-center text-gray-600">
            Waiting for Farcaster authentication
          </p>
        </div>
      </main>
    );
  }

  if (noStatementsToPlay) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-pink-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-pink-600">
            No Statements to Play
          </h1>
          <p className="text-center text-gray-600">
            There are no statements available to play right now. Be the first to
            add some!
          </p>
          <div className="flex flex-col space-y-4">
            <Link
              href="/create"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg text-center"
            >
              Create Your Statements
            </Link>
            <Link
              href="/"
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-pink-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">
            Two Truths and a Lie
          </h1>
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            Your Score: {userScore}
          </span>
        </div>

        {currentStatement && (
          <>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">
                  Statements by:
                  <button
                    onClick={() =>
                      currentStatement.userFid &&
                      viewProfile(currentStatement.userFid)
                    }
                    className="ml-1 text-blue-500 hover:underline"
                  >
                    {currentStatement.username ||
                      `User #${currentStatement.userFid}`}
                  </button>
                </p>
                <span className="text-xs text-gray-400">
                  #{currentIndex + 1}/{statements.length}
                </span>
              </div>

              <p className="text-center text-gray-600 font-semibold">
                Which statement is the lie?
              </p>

              <div className="space-y-3">
                {currentStatement.statements.map((statement, index) => (
                  <button
                    key={index}
                    onClick={() => !result && setSelectedGuess(index)}
                    disabled={!!result}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      selectedGuess === index
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    } ${
                      result && index === currentStatement.lieIndex
                        ? "bg-red-100 border-2 border-red-500"
                        : ""
                    } ${
                      result &&
                      selectedGuess === index &&
                      selectedGuess !== currentStatement.lieIndex
                        ? "bg-red-50 border-2 border-red-300"
                        : ""
                    }`}
                  >
                    {statement}
                  </button>
                ))}
              </div>

              {result && (
                <div
                  className={`p-3 rounded-lg ${
                    result === "correct"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {result === "correct"
                    ? "✅ Correct! You earned 1 point."
                    : "❌ Wrong! The author earned 1 point."}
                </div>
              )}

              {!result ? (
                <button
                  onClick={handleGuess}
                  disabled={selectedGuess === null || isGuessing}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {isGuessing ? "Submitting..." : "Submit Guess"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Next Statement
                </button>
              )}
            </div>
          </>
        )}

        <div className="pt-2">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
