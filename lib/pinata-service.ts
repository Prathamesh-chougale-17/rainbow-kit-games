"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});

// Helper function to upload game file to IPFS
export async function uploadGameToIPFS(gameHtml: string, metadata: any) {
  try {
    // Create a Blob from the HTML string
    const gameBlob = new Blob([gameHtml], { type: 'text/html' });
    
    // Upload using the blob
    const upload = await pinata.upload.blob(gameBlob).addMetadata({
      name: `${metadata.title || 'game'}.html`,
      keyvalues: {
        type: 'game',
        title: metadata.title || 'Untitled Game',
        wallet: metadata.wallet || '',
      }
    });
    
    // Get the public URL using the gateway
    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${upload.cid}`;
    
    return {
      cid: upload.cid,
      url,
      size: gameBlob.size,
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
    const metadataBlob = new Blob([metadataString], { type: 'application/json' });

    const upload = await pinata.upload.blob(metadataBlob).addMetadata({
      name: 'metadata.json',
      keyvalues: {
        type: 'metadata',
        wallet: metadata.wallet || '',
      }
    });
    
    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${upload.cid}`;
    
    return {
      cid: upload.cid,
      url,
      size: metadataBlob.size,
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}
