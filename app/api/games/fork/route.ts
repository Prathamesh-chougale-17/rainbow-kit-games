import { NextRequest, NextResponse } from 'next/server';
import { gameService } from '@/lib/game-service';

// Upload forked game to IPFS
async function uploadToIPFS(htmlContent: string, title: string, walletAddress: string) {
  const formData = new FormData();
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const sanitizedTitle = title.replace(/[^a-z0-9\-_]/gi, '_').substring(0, 100);
  formData.append('file', blob, `${sanitizedTitle}_fork.html`);
  
  const pinataMetadata = JSON.stringify({
    name: `${sanitizedTitle}_fork.html`,
    keyvalues: {
      type: 'game',
      title: title,
      uploadedAt: new Date().toISOString(),
      userId: walletAddress,
      forked: 'true'
    }
  });
  formData.append('pinataMetadata', pinataMetadata);
  
  const pinataOptions = JSON.stringify({
    cidVersion: 1,
  });
  formData.append('pinataOptions', pinataOptions);
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINATA_JWT}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`IPFS upload failed: ${response.status}`);
  }
  
  const result = await response.json();
  const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'ipfs.io';
  const ipfsUrl = `https://${gatewayUrl}/ipfs/${result.IpfsHash}`;
  
  return {
    cid: result.IpfsHash,
    url: ipfsUrl,
    size: result.PinSize,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { originalGameId, walletAddress, newTitle } = await request.json();

    if (!originalGameId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: originalGameId, walletAddress' },
        { status: 400 }
      );
    }

    // Get original game
    const originalGame = await gameService.getGameById(originalGameId);
    if (!originalGame) {
      return NextResponse.json(
        { error: 'Original game not found' },
        { status: 404 }
      );
    }

    const latestVersion = originalGame.versions[originalGame.versions.length - 1];
    if (!latestVersion) {
      return NextResponse.json(
        { error: 'No versions found for original game' },
        { status: 400 }
      );
    }

    // Upload the forked game HTML to IPFS with new CID
    const forkTitle = newTitle || `${originalGame.title} (Fork)`;
    const ipfsResult = await uploadToIPFS(latestVersion.html, forkTitle, walletAddress);

    // Fork the game with new IPFS data
    const forkedGame = await gameService.forkGameWithIPFS(
      originalGameId, 
      walletAddress, 
      forkTitle,
      ipfsResult
    );

    return NextResponse.json({
      success: true,
      game: forkedGame,
      ipfs: ipfsResult,
      message: 'Game forked and uploaded to IPFS successfully!',
    });
  } catch (error) {
    console.error('Fork game error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fork game' },
      { status: 500 }
    );
  }
}
