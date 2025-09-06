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

    // Upload the file to IPFS
    const { cid } = await pinata.upload.file(gameFile);
    
    // Get the public URL
    const url = await pinata.gateways.createSignedURL({
      cid,
      expires: 86400 * 365, // 1 year
    });
    
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
    const metadataFile = new File(
      [JSON.stringify(metadata, null, 2)], 
      'metadata.json', 
      { type: 'application/json' }
    );

    const { cid } = await pinata.upload.file(metadataFile);
    const url = await pinata.gateways.createSignedURL({
      cid,
      expires: 86400 * 365, // 1 year
    });
    
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

// Helper function to upload JSON metadata to IPFS
export async function uploadMetadataToIPFS(metadata: any) {
  try {
    const metadataFile = new File(
      [JSON.stringify(metadata, null, 2)], 
      'metadata.json', 
      { type: 'application/json' }
    );

    const upload = await pinata.upload.file(metadataFile);
    const url = await pinata.gateways.convert(upload.IpfsHash);
    
    return {
      cid: upload.IpfsHash,
      url,
      size: upload.PinSize,
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}
