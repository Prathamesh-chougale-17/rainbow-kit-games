import { type NextRequest, NextResponse } from "next/server";
import {
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_PAYLOAD_TOO_LARGE,
  HTTP_STATUS_TOO_MANY_REQUESTS,
  HTTP_STATUS_UNAUTHORIZED,
  IPFS_UPLOAD_TIMEOUT_MS,
  MAX_FILENAME_LENGTH,
  MAX_HTML_SIZE_BYTES,
  PINATA_API_URL,
} from "@/lib/constants";
import { gameService } from "@/lib/game-service";

// Upload game HTML to IPFS using FormData approach
function validateHtmlContent(htmlContent: string) {
  if (!htmlContent || htmlContent.length === 0) {
    throw new Error("HTML content is empty");
  }

  if (htmlContent.length > MAX_HTML_SIZE_BYTES) {
    // 50MB limit
    throw new Error("HTML content too large (max 50MB)");
  }
}

function sanitizeTitle(title: string) {
  const safeTitle = title?.length ? title : `game_${Date.now()}`;
  return safeTitle
    .replace(/[^a-z0-9\-_]/gi, "_")
    .substring(0, MAX_FILENAME_LENGTH);
}

function buildFormData(
  htmlContent: string,
  title: string,
  walletAddress: string
) {
  const sanitizedTitle = sanitizeTitle(title);

  const formData = new FormData();
  const blob = new Blob([htmlContent], { type: "text/html" });
  formData.append("file", blob, `${sanitizedTitle}.html`);

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

  const pinataOptions = JSON.stringify({
    cidVersion: 1,
  });
  formData.append("pinataOptions", pinataOptions);

  return formData;
}

async function postToPinata(formData: FormData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    IPFS_UPLOAD_TIMEOUT_MS
  ); // 60 second timeout

  try {
    const response = await fetch(PINATA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parsePinataResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === HTTP_STATUS_UNAUTHORIZED) {
      throw new Error("Pinata authentication failed - invalid JWT token");
    }
    if (response.status === HTTP_STATUS_FORBIDDEN) {
      if (errorText.includes("NO_SCOPES_FOUND")) {
        throw new Error(
          "Pinata JWT token lacks required file upload permissions. Please update the token with proper scopes."
        );
      }
      throw new Error("Pinata access forbidden - check token permissions");
    }
    if (response.status === HTTP_STATUS_TOO_MANY_REQUESTS) {
      throw new Error("Pinata rate limit exceeded - please try again later");
    }
    if (response.status === HTTP_STATUS_PAYLOAD_TOO_LARGE) {
      throw new Error("File too large for Pinata upload");
    }
    throw new Error(
      `Pinata upload failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const result = await response.json();

  // Use reliable public IPFS gateway
  const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "ipfs.io";
  const ipfsUrl = `https://${gatewayUrl}/ipfs/${result.IpfsHash}`;

  return {
    cid: result.IpfsHash,
    url: ipfsUrl,
    size: result.PinSize,
  };
}

async function uploadToIPFS(
  htmlContent: string,
  title: string,
  walletAddress: string
) {
  try {
    await validateHtmlContent(htmlContent);

    const formData = buildFormData(htmlContent, title, walletAddress);

    const response = await postToPinata(formData);

    return await parsePinataResponse(response);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "DOMException")
    ) {
      throw new Error("Upload timeout - please try again");
    }

    if (error instanceof Error) {
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }

    throw new Error("Failed to upload to IPFS: Unknown error");
  }
}

async function updateFlow({
  gameId,
  html,
  title,
  description,
  tags,
  walletAddress,
}: {
  gameId: string;
  html: string;
  title: string;
  description?: string;
  tags?: string[];
  walletAddress: string;
}) {
  const game = await gameService.getGameById(gameId);
  if (!game) {
    return NextResponse.json(
      { success: false, error: "Game not found" },
      { status: 404 }
    );
  }

  if (game.walletAddress !== walletAddress) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const ipfsResult = await uploadToIPFS(html, title, walletAddress);

  const version = await gameService.addGameVersion(gameId, {
    html,
    title,
    description,
    tags,
    ipfsCid: ipfsResult.cid,
    ipfsUrl: ipfsResult.url,
  });

  try {
    await gameService.updateGame(gameId, { title });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update game title: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }

  const updatedGame = await gameService.getGameById(gameId);
  return NextResponse.json({
    success: true,
    game: updatedGame,
    version,
    ipfs: ipfsResult,
    message: "Game saved and uploaded to IPFS successfully!",
  });
}

async function createFlow({
  html,
  title,
  description,
  tags,
  walletAddress,
}: {
  html: string;
  title: string;
  description?: string;
  tags?: string[];
  walletAddress: string;
}) {
  const game = await gameService.createGame({
    walletAddress,
    title,
    description,
    tags,
  });

  const ipfsResult = await uploadToIPFS(html, title, walletAddress);

  const version = await gameService.addGameVersion(game.gameId, {
    html,
    title,
    description,
    tags,
    ipfsCid: ipfsResult.cid,
    ipfsUrl: ipfsResult.url,
  });

  const freshGame = await gameService.getGameById(game.gameId);
  return NextResponse.json({
    success: true,
    game: freshGame,
    version,
    ipfs: ipfsResult,
    message: "Game created and uploaded to IPFS successfully!",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { html, title, description, tags, walletAddress, gameId } =
      await request.json();

    if (!(html && title && walletAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: html, title, walletAddress",
        },
        { status: 400 }
      );
    }

    if (gameId) {
      return await updateFlow({
        gameId,
        html,
        title,
        description,
        tags,
        walletAddress,
      });
    }

    return await createFlow({
      html,
      title,
      description,
      tags,
      walletAddress,
    });
  } catch (error) {
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
