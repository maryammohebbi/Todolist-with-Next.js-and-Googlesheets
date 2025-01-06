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
  const range = "Sheet1!A:Z"; // Define your range (Sheet1 columns A to Z)

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Error fetching sheets data:", error);
    return [];
  }

  
};
