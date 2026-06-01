"use client";

import { useEffect, useState } from "react";

type MoodPick = {
  id: number;
  mood: string;
  suggestion: string;
  created_at: string;
};

const moodSuggestions: Record<string, string[]> = {
  Happy: [
    "Watch a feel-good romantic comedy with your favourite snack.",
    "Rewatch a childhood movie that always makes you smile.",
    "Try a feel-good musical like Mamma Mia or La La Land.",
    "Watch a Pixar film — they're great at any age.",
    "Put on a stand-up comedy special and laugh out loud.",
    "Watch a lighthearted heist movie like Ocean's Eleven.",
    "Try a fun road-trip movie like Little Miss Sunshine.",
    "Watch a classic feel-good film like The Princess Bride.",
    "Try an animated movie with great music like Moana or Coco.",
    "Watch a buddy comedy like Superbad or Game Night.",
    "Try a sports underdog movie like Cool Runnings.",
    "Watch a quirky indie comedy like Napoleon Dynamite.",
    "Try a holiday feel-good film like Elf or Home Alone.",
    "Watch a short anthology comedy series on Netflix.",
    "Try a light romantic film like Crazy, Stupid, Love.",
    "Watch something with a great soundtrack you can sing along to.",
    "Try a feel-good documentary about people doing amazing things.",
    "Watch a cooking or travel show that makes you hungry.",
    "Try a wholesome anime like My Neighbor Totoro.",
    "Rewatch your all-time favourite movie — you deserve it.",
    "Watch a mockumentary like What We Do in the Shadows.",
    "Try a fun fantasy adventure like The Princess Diaries.",
  ],
  Tired: [
    "Watch a calm Studio Ghibli film like Spirited Away.",
    "Put on a soothing nature documentary like Planet Earth.",
    "Try a slow, cozy slice-of-life anime like Yotsuba.",
    "Watch a relaxing cooking show like The Great British Bake Off.",
    "Put on a travel documentary and drift off to beautiful places.",
    "Watch a calm animated film like Kiki's Delivery Service.",
    "Try a gentle feel-good drama that doesn't require much focus.",
    "Put on lo-fi music and watch a calming screensaver video.",
    "Watch a short episode series so you can sleep whenever.",
    "Try a quiet documentary about art, architecture, or nature.",
    "Watch a cozy mystery series like Agatha Christie adaptations.",
    "Try a slow-burn feel-good show like Ted Lasso.",
    "Watch a soothing ASMR cooking video on YouTube.",
    "Put on a classic black-and-white film at low volume.",
    "Try a calm travel vlog from a place you'd love to visit.",
    "Watch an aquarium or fireplace live stream in the background.",
    "Try a light anthology show where every episode is standalone.",
    "Watch a gentle studio documentary about how things are made.",
    "Try a cozy animated short film — Pixar has great ones.",
    "Put on a rainfall sound video and close your eyes.",
    "Watch a calm food travel show like Ugly Delicious.",
    "Try a soothing Bob Ross painting episode.",
  ],
  Adventurous: [
    "Watch a treasure-hunt thriller like National Treasure.",
    "Try a high-stakes heist film like Heat or The Italian Job.",
    "Watch an Indiana Jones film from the beginning.",
    "Try a survival thriller like 127 Hours or The Martian.",
    "Watch a spy action movie like Mission Impossible.",
    "Try a gripping true-crime documentary series.",
    "Watch an intense disaster movie like Interstellar.",
    "Try an exploration documentary about deep sea or space.",
    "Watch a war epic like Dunkirk or 1917.",
    "Try an action-adventure series like Stranger Things.",
    "Watch a jungle survival film like Apocalypto.",
    "Try a mystery thriller that keeps you guessing like Knives Out.",
    "Watch a time-travel movie like Looper or Arrival.",
    "Try a globe-trotting action film like The Bourne Identity.",
    "Watch a mythological epic like Troy or 300.",
    "Try a mind-bending thriller like Inception.",
    "Watch a historical adventure like Gladiator or Braveheart.",
    "Try a nautical adventure like Master and Commander.",
    "Watch a superhero origin story from the beginning.",
    "Try a gritty crime thriller like No Country for Old Men.",
    "Watch an extreme sports documentary on YouTube.",
    "Try a foreign-language thriller — Korean cinema is excellent.",
  ],
  Stressed: [
    "Watch a silly slapstick comedy that needs zero brainpower.",
    "Put on a comfort TV show you've already seen before.",
    "Try a feel-good baking competition with no elimination drama.",
    "Watch a funny animal compilation video on YouTube.",
    "Put on a lighthearted sitcom like The Office or Parks & Rec.",
    "Try a short animated comedy series like Bob's Burgers.",
    "Watch a ridiculous action comedy like Rush Hour.",
    "Try a cozy mystery with no gore like Midsomer Murders.",
    "Watch a stand-up comedy special from your favourite comedian.",
    "Try a light romantic comedy with a predictable happy ending.",
    "Watch a feel-good sports movie where the underdog wins.",
    "Put on a funny talk show interview compilation.",
    "Try a wholesome reality show like Queer Eye.",
    "Watch a parody movie like Shaun of the Dead.",
    "Try a fun animated series like Gravity Falls.",
    "Watch a comfort food documentary that makes you hungry.",
    "Try a lighthearted sitcom you've never seen but always meant to.",
    "Watch a funny blooper reel or behind-the-scenes compilation.",
    "Put on a nature documentary narrated in a calm voice.",
    "Try a gentle comedy film from the 90s.",
    "Watch a mockumentary like Arrested Development or Spinal Tap.",
    "Try an easy-watching travel show with no competition pressure.",
  ],
  Bored: [
    "Pick a random country and watch a film from there.",
    "Try a cult classic you've always put off watching.",
    "Watch the most critically acclaimed film from a decade you pick randomly.",
    "Try a genre you've never explored — Korean noir, Italian giallo, French New Wave.",
    "Watch a documentary about a topic you know nothing about.",
    "Try an experimental or art-house film just to say you did.",
    "Pick an actor you love and watch their least-known film.",
    "Watch a long epic you've been avoiding — Lawrence of Arabia, Magnolia.",
    "Try a foreign language film with subtitles from South America.",
    "Watch an anthology film where each segment is by a different director.",
    "Try a film school favourite like 2001: A Space Odyssey.",
    "Watch a making-of documentary about a movie you love.",
    "Try a silent film era classic just for the experience.",
    "Pick the highest-rated movie on Letterboxd you haven't seen.",
    "Watch a mockumentary that you'd mistake for a real documentary.",
    "Try an animated film aimed at adults like Persepolis or Waltz with Bashir.",
    "Watch a movie that inspired a franchise — before the sequels ruined it.",
    "Try a limited TV series you can finish in one weekend.",
    "Watch a behind-the-scenes expose documentary like The Inventor.",
    "Pick a random Criterion Collection film.",
    "Try a movie from a director you've never heard of.",
    "Watch something that was controversial when it came out.",
  ],
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
    const options = moodSuggestions[mood];
    const pickedSuggestion = options[Math.floor(Math.random() * options.length)];

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