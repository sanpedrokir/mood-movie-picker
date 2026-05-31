"use client";

import { useEffect, useState } from "react";

type MoodPick = {
  id: number;
  mood: string;
  suggestion: string;
  created_at: string;
};

const moodSuggestions: Record<string, string> = {
  Happy: "Watch a feel-good comedy movie with your favourite snack.",
  Tired: "Watch a calm animation or listen to relaxing music.",
  Adventurous: "Watch a mystery, action, or treasure-hunt movie.",
  Stressed: "Watch something light, funny, and not too serious.",
  Bored: "Try a random movie you would not normally choose.",
};

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [history, setHistory] = useState<MoodPick[]>([]);
  const [message, setMessage] = useState("");

  async function fetchHistory() {
    const response = await fetch("/api/moods");
    const data = await response.json();

    if (!response.ok) {
      setMessage("Could not load mood history.");
      return;
    }

    setHistory(data);
  }

  async function chooseMood(mood: string) {
    const pickedSuggestion = moodSuggestions[mood];

    setSelectedMood(mood);
    setSuggestion(pickedSuggestion);
    setMessage("");

    const response = await fetch("/api/moods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood, suggestion: pickedSuggestion }),
    });

    if (!response.ok) {
      setMessage("Could not save your mood pick.");
      return;
    }

    fetchHistory();
  }

  async function clearHistory() {
    const response = await fetch("/api/moods", {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage("Could not clear history.");
      return;
    }

    setMessage("History cleared.");
    fetchHistory();
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-4xl font-bold text-purple-800">
          Mood Movie Picker
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Choose your mood and get a fun movie idea.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.keys(moodSuggestions).map((mood) => (
            <button
              key={mood}
              onClick={() => chooseMood(mood)}
              className="rounded-2xl bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700"
            >
              {mood}
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="mt-8 rounded-2xl bg-yellow-100 p-6 text-center">
            <p className="text-lg font-semibold text-gray-800">
              You chose: {selectedMood}
            </p>
            <p className="mt-3 text-2xl font-bold text-purple-800">
              {suggestion}
            </p>
          </div>
        )}

        {message && (
          <p className="mt-4 rounded-xl bg-gray-100 p-3 text-center text-gray-700">
            {message}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Past Mood Picks
          </h2>

          <button
            onClick={clearHistory}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Clear History
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {history.length === 0 && (
            <p className="text-gray-600">No mood picks yet.</p>
          )}

          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-purple-100 bg-purple-50 p-4"
            >
              <p className="font-bold text-purple-800">{item.mood}</p>
              <p className="text-gray-700">{item.suggestion}</p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}