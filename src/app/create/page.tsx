"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DB } from "@/lib/db";
import Link from "next/link";

export default function CreatePage() {
  const router = useRouter();
  const [statements, setStatements] = useState(["", "", ""]);
  const [lieIndex, setLieIndex] = useState<number | null>(null);
  const [userFid, setUserFid] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is authenticated through Farcaster
    if (window.userFid) {
      console.log("CreatePage: Found initial window.userFid:", window.userFid);
      setUserFid(window.userFid);
    } else {
      console.log(
        "CreatePage: window.userFid not found initially, starting poll."
      );
      // Poll for userFid as it might be set after frame initialization
      const intervalId = setInterval(() => {
        if (window.userFid) {
          console.log(
            "CreatePage: Found window.userFid via poll:",
            window.userFid
          );
          setUserFid(window.userFid);
          clearInterval(intervalId);
        } else {
          console.log("CreatePage: Polling... window.userFid still not found.");
        }
      }, 200); // Poll more frequently initially

      // Stop polling after a certain time to avoid infinite loops
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        if (!window.userFid) {
          console.warn("CreatePage: Timed out waiting for window.userFid.");
          // Optionally set an error state here
        }
      }, 5000); // Stop after 5 seconds

      return () => {
        console.log("CreatePage: Cleaning up interval and timeout.");
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  const handleStatementChange = (index: number, value: string) => {
    const newStatements = [...statements];
    newStatements[index] = value;
    setStatements(newStatements);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userFid) {
      setError("Not authenticated with Farcaster");
      return;
    }

    if (statements.some((s) => s.trim() === "")) {
      setError("Please fill in all three statements");
      return;
    }

    if (lieIndex === null) {
      setError("Please select which statement is the lie");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a unique ID
      const id = Math.random().toString(36).substring(2, 15);

      // Add to database
      DB.addStatement({
        id,
        userFid,
        username: window.username,
        statements: [statements[0], statements[1], statements[2]],
        lieIndex,
        createdAt: Date.now(),
      });

      // Redirect to play page
      router.push("/play");
    } catch (err) {
      setError("Failed to save your statements");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-pink-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-pink-600">
          Create Your Statements
        </h1>

        <p className="text-gray-600 text-center text-sm">
          Enter two true statements and one lie about yourself. Others will try
          to guess which one is the lie!
        </p>

        {!userFid && (
          <div className="bg-yellow-100 p-3 rounded-lg text-yellow-800 text-sm">
            Loading Farcaster authentication...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center">
                <label
                  htmlFor={`statement-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Statement {index + 1}
                </label>
                <div className="ml-auto">
                  <input
                    type="radio"
                    id={`lie-${index}`}
                    name="lie"
                    className="mr-1"
                    checked={lieIndex === index}
                    onChange={() => setLieIndex(index)}
                  />
                  <label
                    htmlFor={`lie-${index}`}
                    className="text-xs text-gray-500"
                  >
                    This is the lie
                  </label>
                </div>
              </div>
              <input
                id={`statement-${index}`}
                type="text"
                value={statements[index]}
                onChange={(e) => handleStatementChange(index, e.target.value)}
                placeholder={`Enter statement ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
          ))}

          {error && (
            <div className="bg-red-100 p-3 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <Link
              href="/"
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !userFid}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
