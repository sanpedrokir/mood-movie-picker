import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "select * from mood_picks order by created_at desc"
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/moods error:", error);

    return NextResponse.json(
      { error: "Failed to fetch mood history" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { mood, suggestion } = body;

    if (!mood || !suggestion) {
      return NextResponse.json(
        { error: "Mood and suggestion are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "insert into mood_picks (mood, suggestion) values ($1, $2) returning *",
      [mood, suggestion]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/moods error:", error);

    return NextResponse.json(
      { error: "Failed to save mood" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await pool.query("delete from mood_picks");

    return NextResponse.json({ message: "History cleared" });
  } catch (error) {
    console.error("DELETE /api/moods error:", error);

    return NextResponse.json(
      { error: "Failed to clear history" },
      { status: 500 }
    );
  }
}