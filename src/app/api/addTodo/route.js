import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { todo } = await req.json(); // Get todo text from request body

    if (!todo) {
      return NextResponse.json({ error: "Todo text is required" }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Sheet1",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[todo, new Date().toISOString()]], // Add todo with timestamp
      },
    });

    return NextResponse.json({ message: "Todo added successfully" });
  } catch (error) {
    console.error("Error adding todo:", error);
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}
