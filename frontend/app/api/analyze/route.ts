import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { headline } = await request.json()

    if (!headline || typeof headline !== "string") {
      return NextResponse.json({ error: "Invalid headline provided" }, { status: 400 })
    }
    
    console.log("Sending request to Flask API with headline:", headline.substring(0, 30) + "...")
    
    // Try with IPv4 address explicitly instead of localhost
    try {
      // Call the Flask backend
      const response = await fetch("https://fakenews-backend-9ub2.onrender.com/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: headline }),
      })

      if (!response.ok) {
        throw new Error(`Flask API returned error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Received response from Flask API:", result.prediction)
      return NextResponse.json(result)
    } catch (fetchError) {
      console.error("Fetch error details:", fetchError)
      throw new Error(`Connection to Flask API failed: ${fetchError.message}. Make sure the Flask server is running on port 5000.`)
    }
  } catch (error) {
    console.error("Error analyzing headline:", error)
    return NextResponse.json({ 
      error: "Failed to analyze headline", 
      details: error.message 
    }, { status: 500 })
  }
}
