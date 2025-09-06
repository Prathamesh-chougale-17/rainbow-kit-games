"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});

// Helper function to upload game file to IPFS
export async function uploadGameToIPFS(gameHtml: string, metadata: any) {
  try {
    // Create a file from the HTML string
    const gameFile = new File([gameHtml], `${metadata.title || 'game'}.html`, {
      type: 'text/html',
    });

    // Upload the file to IPFS using the public API
    const { cid } = await pinata.upload.stream(gameFile.stream());
    
    // Get the public URL using the gateway
    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`;
    
    return {
      cid,
      url,
      size: gameFile.size,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload game to IPFS');
  }
}

// Helper function to upload JSON metadata to IPFS
export async function uploadMetadataToIPFS(metadata: any) {
  try {
    const metadataString = JSON.stringify(metadata, null, 2);
    const metadataFile = new File(
      [metadataString], 
      'metadata.json', 
      { type: 'application/json' }
    );

    const { cid } = await pinata.upload.stream(metadataFile.stream());
    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`;
    
    return {
      cid,
      url,
      size: metadataFile.size,
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}
