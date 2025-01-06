import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { todo } = await req.json(); // Get the todo to delete from request body

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

    // Fetch current data to find the row index of the todo to delete
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Sheet1!A:Z",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === todo);

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Delete the row using Google Sheets API
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Adjust this if your sheet ID is different
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
