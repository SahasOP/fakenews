import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { headline } = await request.json()

    if (!headline || typeof headline !== "string") {
      return NextResponse.json({ error: "Invalid headline provided" }, { status: 400 })
    }

    // Call the Flask backend
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ headline }),
    })

    if (!response.ok) {
      throw new Error(`Failed to analyze headline: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing headline:", error)
    return NextResponse.json({ error: "Failed to analyze headline" }, { status: 500 })
  }
}
