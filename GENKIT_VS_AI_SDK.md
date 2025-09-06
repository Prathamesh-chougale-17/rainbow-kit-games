# Genkit vs AI SDK: Code Comparison

This document shows side-by-side comparisons of implementing the same functionality using both Genkit and Vercel AI SDK.

## 1. Basic Setup

### Genkit Approach
```typescript
// ai/genkit.ts
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

export const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.0-flash",
});
```

### AI SDK Approach
```typescript
// ai/config.ts
import { google } from '@ai-sdk/google';

export const aiModel = google('gemini-2.0-flash-exp');

export const aiConfig = {
  model: aiModel,
  temperature: 0.7,
};
```

## 2. Schema Definition

### Genkit Approach
```typescript
import { z } from "genkit";

const OutputSchema = z.object({
  html: z.string().describe("Game HTML code"),
  description: z.string().describe("Description of changes"),
});
```

### AI SDK Approach
```typescript
import { z } from 'zod';

const OutputSchema = z.object({
  html: z.string().describe("Game HTML code"),
  description: z.string().describe("Description of changes"),
});
```

## 3. Prompt Definition and Flow

### Genkit Approach
```typescript
const prompt = ai.definePrompt({
  name: "generateGameCode",
  input: { schema: InputSchema },
  output: { schema: OutputSchema },
  prompt: `You are a game developer...
  
  {{#if previousHtml}}
  Previous code: {{{previousHtml}}}
  Feedback: "{{{prompt}}}"
  {{else}}
  Create a game: "{{{prompt}}}"
  {{/if}}
  
  Output format:
  Description: {{output.description}}
  HTML: {{output.html}}`,
});

const generateGameCodeFlow = ai.defineFlow(
  {
    name: "generateGameCodeFlow",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
```

### AI SDK Approach
```typescript
import { generateObject } from 'ai';
import { aiModel } from '@/ai/config';

function createPrompt(input: Input): string {
  const basePrompt = "You are a game developer...";
  
  if (input.previousHtml) {
    return `${basePrompt}
    
    Previous code: ${input.previousHtml}
    Feedback: "${input.prompt}"`;
  } else {
    return `${basePrompt}
    
    Create a game: "${input.prompt}"`;
  }
}

export async function generateGameCode(input: Input): Promise<Output> {
  const prompt = createPrompt(input);
  
  const { object } = await generateObject({
    model: aiModel,
    schema: OutputSchema,
    prompt,
    temperature: 0.7,
  });
  
  return object;
}
```

## 4. Error Handling

### Genkit Approach
```typescript
export async function generateGame(input: Input): Promise<Output> {
  try {
    const result = await generateGameCodeFlow(input);
    return result;
  } catch (error) {
    console.error("Genkit error:", error);
    throw new Error("AI generation failed");
  }
}
```

### AI SDK Approach
```typescript
export async function generateGame(input: Input): Promise<Output> {
  try {
    const result = await generateGameCode(input);
    return result;
  } catch (error) {
    console.error("AI SDK error:", error);
    throw new Error("AI generation failed");
  }
}
```

## 5. Development Tools

### Genkit Approach
```json
{
  "scripts": {
    "genkit:dev": "genkit start -- tsx ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch ai/dev.ts"
  }
}
```
- Built-in development interface
- Flow visualization and debugging
- Integrated testing tools

### AI SDK Approach
```typescript
// No special dev tools required
// Use standard debugging and logging
console.log('AI response:', result);
```
- Uses standard development tools
- Simpler debugging with console/debugger
- Framework-agnostic approach

## 6. Multi-Provider Support

### Genkit Approach
```typescript
// Requires plugins for each provider
import { googleAI } from "@genkit-ai/googleai";
import { openAI } from "@genkit-ai/openai"; // If available

export const ai = genkit({
  plugins: [googleAI(), openAI()],
  model: "googleai/gemini-2.0-flash", // Fixed at initialization
});
```

### AI SDK Approach
```typescript
// Native support for multiple providers
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// Easy switching between providers
export const aiModel = google('gemini-2.0-flash-exp');
// export const aiModel = openai('gpt-4o');
// export const aiModel = anthropic('claude-3-5-sonnet-20241022');
```

## 7. Streaming Support

### Genkit Approach
```typescript
// Streaming requires special flow setup
const streamingFlow = ai.defineStreamingFlow(
  { /* config */ },
  async (input, streamingCallback) => {
    // Complex streaming implementation
  }
);
```

### AI SDK Approach
```typescript
import { streamText } from 'ai';

export async function generateGameStream(prompt: string) {
  const result = await streamText({
    model: aiModel,
    prompt,
  });
  
  return result.textStream; // Simple streaming
}
```

## 8. Advanced Features

### Genkit Approach
```typescript
// Requires additional configuration for advanced features
// Tool usage, function calling, etc. need specific setup
```

### AI SDK Approach
```typescript
import { generateObject, tool } from 'ai';

// Built-in support for tools, function calling, etc.
const result = await generateObject({
  model: aiModel,
  schema: mySchema,
  tools: {
    calculator: tool({
      description: 'Calculate mathematical expressions',
      parameters: z.object({
        expression: z.string(),
      }),
      execute: async ({ expression }) => {
        return eval(expression);
      },
    }),
  },
  prompt: 'Create a game with score calculation',
});
```

## Summary

| Feature | Genkit | AI SDK |
|---------|--------|---------|
| **Setup Complexity** | High (plugins, flows) | Low (direct imports) |
| **Provider Support** | Plugin-based | Native multi-provider |
| **Development Tools** | Excellent built-in tools | Standard dev tools |
| **Learning Curve** | Steep | Gentle |
| **Flexibility** | Framework-specific | Framework-agnostic |
| **Bundle Size** | Larger | Smaller |
| **Streaming** | Complex setup | Simple built-in |
| **TypeScript Support** | Good | Excellent |
| **Community** | Google/Firebase focused | Broader JavaScript community |
| **Documentation** | Firebase ecosystem | Comprehensive and clear |

## Recommendation

- **Use Genkit if**: You're heavily invested in the Firebase ecosystem and need the advanced development tools
- **Use AI SDK if**: You want flexibility, simplicity, and broader provider support

For most projects, **AI SDK is recommended** due to its simplicity, flexibility, and active development.
