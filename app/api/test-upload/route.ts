import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("Testing minimal Pinata upload...");

    // Create a simple test HTML file
    const testHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Test Game</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a test game file.</p>
</body>
</html>`;

    console.log("Test HTML length:", testHtml.length);

    // Create form data
    const formData = new FormData();
    const blob = new Blob([testHtml], { type: "text/html" });
    formData.append("file", blob, "test-game.html");

    // Add metadata
    const pinataMetadata = JSON.stringify({
      name: "test-game.html",
      keyvalues: {
        type: "test",
        uploadedAt: new Date().toISOString(),
      },
    });
    formData.append("pinataMetadata", pinataMetadata);

    console.log("Making Pinata upload request...");

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: formData,
      },
    );

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      return NextResponse.json({
        success: false,
        error: `Upload failed: ${response.status} ${response.statusText}`,
        details: errorText,
      });
    }

    const result = await response.json();
    console.log("Upload successful:", result);

    const ipfsUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${result.IpfsHash}`;

    return NextResponse.json({
      success: true,
      message: "Test upload successful",
      result: {
        cid: result.IpfsHash,
        url: ipfsUrl,
        size: result.PinSize,
      },
    });
  } catch (error) {
    console.error("Test upload error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Test failed",
      details: error instanceof Error ? error.stack : undefined,
    });
  }
}
