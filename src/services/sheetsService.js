// src/services/sheetsService.js
import { google } from "googleapis";

export const getSheetsData = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
  const range = "Sheet1!A:Z"; // Adjust range as needed

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0]; // First row contains the headers
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase()] = row[index] || ""; // Convert headers to lowercase for consistency
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error("Error fetching sheets data:", error);
    return [];
  }
};

