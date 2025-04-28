"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DB, Score } from "@/lib/db";
import { viewProfile } from "@/lib/frame";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [userFid, setUserFid] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
          loadScores();
        }
      }, 500);

      return () => clearInterval(interval);
    } else {
      loadScores();
    }
  }, []);

  const loadScores = () => {
    try {
      // Get all scores and sort by points (highest first)
      const allScores = DB.getScores();
      const sortedScores = [...allScores].sort((a, b) => b.points - a.points);
      setScores(sortedScores);
    } catch (err) {
      console.error("Error loading scores:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-pink-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-pink-600">
          Leaderboard
        </h1>

        {loading ? (
          <div className="text-center p-4">
            <p>Loading scores...</p>
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center p-4">
            <p>No scores yet. Be the first to play!</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scores.map((score, index) => (
                  <tr
                    key={score.userFid}
                    className={score.userFid === userFid ? "bg-blue-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewProfile(score.userFid)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        User #{score.userFid}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {score.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <Link
            href="/play"
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-center"
          >
            Play More
          </Link>
          <Link
            href="/"
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg text-center"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
