'use server';

import { generateGameCode, type GenerateGameCodeInput, type GenerateGameCodeOutput } from '@/ai/flows/generate-game-code';
import {z} from 'zod';

const GenerateGameCodeInputSchema = z.object({
  prompt: z.string().describe('A description of the game concept.'),
  previousHtml: z.string().optional(),
});

export async function generateGame(input: GenerateGameCodeInput): Promise<GenerateGameCodeOutput> {
    const validatedInput = GenerateGameCodeInputSchema.parse(input);
    try {
        const result = await generateGameCode(validatedInput);
        return result;
    } catch (error) {
        console.error("Error generating game code:", error);
        throw new Error("Failed to generate game. The AI model might be unavailable.");
    }
}
