import { getSheetsData } from "../../../services/sheetsService"

export async function GET() {
  try {
    const data = await getSheetsData();
    // console.log("Fetched data from Sheets API:", data)
    
    if (data.length === 0) {
      return new Response(JSON.stringify({ data: [] }), { status: 200 })
    }
    
    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (error) {
    console.error("Error fetching todos:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch todos" }), { status: 500 })
  }
}
