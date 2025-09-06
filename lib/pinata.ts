"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});

// Helper function to upload game file to IPFS using direct API
export async function uploadGameToIPFS(gameHtml: string, metadata: any) {
  try {
    // Create FormData for the upload
    const formData = new FormData();
    const gameBlob = new Blob([gameHtml], { type: "text/html" });
    formData.append("file", gameBlob, `${metadata.title || "game"}.html`);

    // Add metadata
    const pinataMetadata = JSON.stringify({
      name: `${metadata.title || "game"}.html`,
      keyvalues: {
        type: "game",
        title: metadata.title || "Untitled Game",
        wallet: metadata.wallet || "",
      },
    });
    formData.append("pinataMetadata", pinataMetadata);

    // Upload to Pinata using direct API
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

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${result.IpfsHash}`;

    return {
      cid: result.IpfsHash,
      url,
      size: result.PinSize,
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload game to IPFS");
  }
}

// Helper function to upload JSON metadata to IPFS
export async function uploadMetadataToIPFS(metadata: any) {
  try {
    // Create FormData for the upload
    const formData = new FormData();
    const metadataString = JSON.stringify(metadata, null, 2);
    const metadataBlob = new Blob([metadataString], {
      type: "application/json",
    });
    formData.append("file", metadataBlob, "metadata.json");

    // Add pinata metadata
    const pinataMetadata = JSON.stringify({
      name: "metadata.json",
      keyvalues: {
        type: "metadata",
        wallet: metadata.wallet || "",
      },
    });
    formData.append("pinataMetadata", pinataMetadata);

    // Upload to Pinata using direct API
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

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${result.IpfsHash}`;

    return {
      cid: result.IpfsHash,
      url,
      size: result.PinSize,
    };
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
}
