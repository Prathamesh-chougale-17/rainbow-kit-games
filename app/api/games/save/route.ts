import { type NextRequest, NextResponse } from "next/server";
import { type Game, gameService } from "@/lib/game-service";

// Upload game HTML to IPFS using FormData approach
async function uploadToIPFS(
  htmlContent: string,
  title: string,
  walletAddress: string
) {
  try {
    // Validate input
    if (!htmlContent || htmlContent.length === 0) {
      throw new Error("HTML content is empty");
    }

    if (htmlContent.length > 50 * 1024 * 1024) {
      // 50MB limit
      throw new Error("HTML content too large (max 50MB)");
    }

    // Ensure we have a safe title for filename (fallback to timestamped name)
    const safeTitle = title?.length ? title : `game_${Date.now()}`;
    // Sanitize title for filename
    const sanitizedTitle = safeTitle
      .replace(/[^a-z0-9\-_]/gi, "_")
      .substring(0, 100);

    console.log("PINATA_JWT exists:", !!process.env.PINATA_JWT);
    console.log("GATEWAY_URL:", process.env.NEXT_PUBLIC_GATEWAY_URL);

    // Create form data for upload
    const formData = new FormData();
    const blob = new Blob([htmlContent], { type: "text/html" });
    formData.append("file", blob, `${sanitizedTitle}.html`);

    // Add metadata for better organization
    const pinataMetadata = JSON.stringify({
      name: `${sanitizedTitle}.html`,
      keyvalues: {
        type: "game",
        title,
        uploadedAt: new Date().toISOString(),
        userId: walletAddress,
      },
    });
    formData.append("pinataMetadata", pinataMetadata);

    // Add pinata options for better control
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    console.log("Making request to Pinata API...");

    // Use Pinata API directly with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000); // 60 second timeout

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    console.log("Pinata response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinata error response:", errorText);

      // Handle specific error cases
      if (response.status === 401) {
        throw new Error("Pinata authentication failed - invalid JWT token");
      }
      if (response.status === 403) {
        const errorBody = await response.text();
        if (errorBody.includes("NO_SCOPES_FOUND")) {
          throw new Error(
            "Pinata JWT token lacks required file upload permissions. Please update the token with proper scopes."
          );
        }
        throw new Error("Pinata access forbidden - check token permissions");
      }
      if (response.status === 429) {
        throw new Error("Pinata rate limit exceeded - please try again later");
      }
      if (response.status === 413) {
        throw new Error("File too large for Pinata upload");
      }
      throw new Error(
        `Pinata upload failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("Pinata upload successful. CID:", result.IpfsHash);

    // Use reliable public IPFS gateway
    const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "ipfs.io";
    const ipfsUrl = `https://${gatewayUrl}/ipfs/${result.IpfsHash}`;

    return {
      cid: result.IpfsHash,
      url: ipfsUrl,
      size: result.PinSize,
    };
  } catch (error) {
    console.error("IPFS upload error details:", error);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Upload timeout - please try again");
    }

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }

    throw new Error("Failed to upload to IPFS: Unknown error");
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Save API called");
    const { html, title, description, tags, walletAddress, gameId } =
      await request.json();

    console.log("Request data:", {
      title,
      walletAddress,
      gameId,
      hasHtml: !!html,
    });

    if (!(html && title && walletAddress)) {
      console.log("Missing required fields");
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: html, title, walletAddress",
        },
        { status: 400 }
      );
    }

    let game: Game | null = null;

    if (gameId) {
      console.log("Updating existing game:", gameId);
      // Update existing game with new version
      game = await gameService.getGameById(gameId);
      if (!game) {
        console.log("Game not found:", gameId);
        return NextResponse.json(
          { success: false, error: "Game not found" },
          { status: 404 }
        );
      }

      if (game.walletAddress !== walletAddress) {
        console.log("Unauthorized access attempt");
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      console.log("Uploading to IPFS...");
      // Upload to IPFS - now required for all games
      const ipfsResult = await uploadToIPFS(html, title, walletAddress);
      console.log("IPFS upload successful:", ipfsResult.cid);

      // Add new version with IPFS data
      const version = await gameService.addGameVersion(gameId, {
        html,
        title,
        description,
        tags,
        ipfsCid: ipfsResult.cid,
        ipfsUrl: ipfsResult.url,
      });

      console.log("Version added successfully");

      // Update top-level game title so the game metadata reflects the latest title
      try {
        await gameService.updateGame(gameId, { title });
      } catch (err) {
        console.warn("Failed to update top-level game title:", err);
      }

      // Return the fresh game object
      const updatedGame = await gameService.getGameById(gameId);
      return NextResponse.json({
        success: true,
        game: updatedGame,
        version,
        ipfs: ipfsResult,
        message: "Game saved and uploaded to IPFS successfully!",
      });
    }
    console.log("Creating new game");
    // Create new game
    game = await gameService.createGame({
      walletAddress,
      title,
      description,
      tags,
    });

    console.log("Game created:", game.gameId);

    console.log("Uploading to IPFS...");
    // Upload to IPFS - now required for all games
    const ipfsResult = await uploadToIPFS(html, title, walletAddress);
    console.log("IPFS upload successful:", ipfsResult.cid);

    // Add initial version with IPFS data
    const version = await gameService.addGameVersion(game.gameId, {
      html,
      title,
      description,
      tags,
      ipfsCid: ipfsResult.cid,
      ipfsUrl: ipfsResult.url,
    });

    console.log("Initial version added successfully");

    // Fetch the fresh game object including the newly added version
    const freshGame = await gameService.getGameById(game.gameId);
    return NextResponse.json({
      success: true,
      game: freshGame,
      version,
      ipfs: ipfsResult,
      message: "Game created and uploaded to IPFS successfully!",
    });
  } catch (error) {
    console.error("Save game error:", error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save game",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
