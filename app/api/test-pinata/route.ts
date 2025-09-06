import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing Pinata connection...");
    console.log("PINATA_JWT exists:", !!process.env.PINATA_JWT);
    console.log("PINATA_JWT length:", process.env.PINATA_JWT?.length);

    // Test Pinata API connection
    const response = await fetch(
      "https://api.pinata.cloud/data/testAuthentication",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      },
    );

    console.log("Pinata test response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinata authentication failed:", errorText);
      return NextResponse.json({
        success: false,
        error: `Pinata authentication failed: ${response.status} ${response.statusText}`,
        details: errorText,
      });
    }

    const result = await response.json();
    console.log("Pinata test result:", result);

    return NextResponse.json({
      success: true,
      message: "Pinata connection successful",
      result,
    });
  } catch (error) {
    console.error("Pinata test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Test failed",
    });
  }
}
