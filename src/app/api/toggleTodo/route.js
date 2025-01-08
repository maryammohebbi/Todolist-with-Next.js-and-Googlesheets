import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
      const { id, completed } = await req.json();
  
      if (id === undefined || completed === undefined) {
        return NextResponse.json({ error: "ID and completed status are required" }, { status: 400 });
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
      const headers = rows[0];
      const idIndex = headers.indexOf("ID");
      const completedIndex = headers.indexOf("Completed");
  
      if (idIndex === -1 || completedIndex === -1) {
        return NextResponse.json({ error: "Invalid sheet format" }, { status: 400 });
      }
  
      const rowIndex = rows.findIndex((row) => row[idIndex] === id);
  
      if (rowIndex === -1) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
      }
  
      const updatedValues = rows[rowIndex];
      updatedValues[completedIndex] = completed ? true : false; // Ensure boolean value
      console.log("Updated Values:", updatedValues); // Check the updated row data before sending to Google Sheets
  
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: `Sheet1!A${rowIndex + 1}:Z${rowIndex + 1}`,
        valueInputOption: "RAW",
        requestBody: { values: [updatedValues] },
      });
  
      return NextResponse.json({ message: "Todo updated successfully" });
    } catch (error) {
      console.error("Error in updating todo:", error);
      return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
    }
  }
  
