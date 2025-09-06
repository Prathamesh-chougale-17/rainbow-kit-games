import { NextResponse } from "next/server";
import { gameService } from "@/lib/game-service";
import client from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Test MongoDB connection
    await client.connect();
    console.log("MongoDB connected successfully");

    const database = client.db("gameHub");
    await database.command({ ping: 1 });
    console.log("Database ping successful");

    // Test creating a simple game
    console.log("Testing game creation...");
    const testGame = await gameService.createGame({
      walletAddress: "test-wallet-123",
      title: `Test Game ${Date.now()}`,
      description: "Test game description",
      tags: ["test"],
    });

    console.log("Test game created:", testGame.gameId);

    // Test adding a version
    const testVersion = await gameService.addGameVersion(testGame.gameId, {
      html: "<html><body><h1>Test Game</h1></body></html>",
      title: "Test Game",
      description: "Test version",
      tags: ["test"],
      ipfsCid: "test-cid",
      ipfsUrl: "https://test.com/test-cid",
    });

    console.log("Test version added:", testVersion.versionId);

    // Clean up - delete the test game
    await database.collection("games").deleteOne({ gameId: testGame.gameId });
    await database
      .collection("gameVersions")
      .deleteOne({ versionId: testVersion.versionId });

    console.log("Test cleanup completed");

    return NextResponse.json({
      success: true,
      message: "Database and game service tests passed",
      testResults: {
        mongoConnected: true,
        gameCreated: true,
        versionAdded: true,
        cleanupCompleted: true,
      },
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Test failed",
      details: error instanceof Error ? error.stack : undefined,
    });
  }
}
