import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { id } = await req.json(); // Get the todo ID from the request body

    if (!id) {
      return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
    const range = "Sheet1!A:Z";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range,
    });

    const rows = response.data.values || [];
    const headers = rows[0]; // Assume first row contains headers
    const idIndex = headers.indexOf("ID"); // Find the index of the 'ID' column

    if (idIndex === -1) {
      return NextResponse.json({ error: "Invalid sheet format" }, { status: 400 });
    }

    const rowIndex = rows.findIndex((row) => row[idIndex] === id); // Find the row with matching ID

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Delete the row by clearing its content
    await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `Sheet1!A${rowIndex + 1}:Z${rowIndex + 1}`,
    });

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}

