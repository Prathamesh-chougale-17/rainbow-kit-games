import { NextRequest, NextResponse } from 'next/server';
import { gameService } from '@/lib/game-service';
import { nanoid } from 'nanoid';

// Upload game HTML to IPFS using FormData approach
async function uploadToIPFS(htmlContent: string, title: string) {
  try {
    // Create form data for upload
    const formData = new FormData();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    formData.append('file', blob, `${title}.html`);
    
    // Use Pinata API directly
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    const ipfsUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${result.IpfsHash}`;

    return {
      cid: result.IpfsHash,
      url: ipfsUrl,
      size: result.PinSize,
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      html, 
      title, 
      description, 
      tags, 
      walletAddress,
      gameId 
    } = await request.json();

    if (!html || !title || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: html, title, walletAddress' },
        { status: 400 }
      );
    }

    let game;
    
    if (gameId) {
      // Update existing game with new version
      game = await gameService.getGameById(gameId);
      if (!game) {
        return NextResponse.json(
          { error: 'Game not found' },
          { status: 404 }
        );
      }

      if (game.walletAddress !== walletAddress) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      // Upload to IPFS
      const ipfsResult = await uploadToIPFS(html, title);

      // Add new version
      const version = await gameService.addGameVersion(gameId, {
        html,
        title,
        description,
        tags,
        ipfsCid: ipfsResult.cid,
        ipfsUrl: ipfsResult.url,
      });

      return NextResponse.json({
        success: true,
        game,
        version,
        ipfs: ipfsResult,
      });
    } else {
      // Create new game
      game = await gameService.createGame({
        walletAddress,
        title,
        description,
        tags,
      });

      // Upload to IPFS
      const ipfsResult = await uploadToIPFS(html, title);

      // Add initial version
      const version = await gameService.addGameVersion(game.gameId, {
        html,
        title,
        description,
        tags,
        ipfsCid: ipfsResult.cid,
        ipfsUrl: ipfsResult.url,
      });

      return NextResponse.json({
        success: true,
        game,
        version,
        ipfs: ipfsResult,
      });
    }
  } catch (error) {
    console.error('Save game error:', error);
    return NextResponse.json(
      { error: 'Failed to save game' },
      { status: 500 }
    );
  }
}
