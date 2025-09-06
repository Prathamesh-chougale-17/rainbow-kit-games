import { NextRequest, NextResponse } from 'next/server';
import { gameService } from '@/lib/game-service';

export async function POST(request: NextRequest) {
  try {
    const { originalGameId, walletAddress, newTitle } = await request.json();

    if (!originalGameId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: originalGameId, walletAddress' },
        { status: 400 }
      );
    }

    const forkedGame = await gameService.forkGame(originalGameId, walletAddress, newTitle);

    return NextResponse.json({
      success: true,
      game: forkedGame,
    });
  } catch (error) {
    console.error('Fork game error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fork game' },
      { status: 500 }
    );
  }
}
