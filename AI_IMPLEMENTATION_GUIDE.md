# AI Implementation Guide

This project includes two AI implementations for game generation:

## 1. Genkit Version (Original)
- **Files**: `ai/genkit.ts`, `ai/flows/generate-game-code.ts`, `ai/flows/refine-prompt-flow.ts`, `lib/actions.ts`
- **Dependencies**: `genkit`, `@genkit-ai/googleai`
- **Features**: Firebase Genkit framework with flow-based architecture

## 2. AI SDK Version (New)
- **Files**: `ai/config.ts`, `ai/flows/generate-game-code-ai-sdk.ts`, `ai/flows/refine-prompt-ai-sdk.ts`, `lib/actions-ai-sdk.ts`
- **Dependencies**: `ai`, `@ai-sdk/google`, `@ai-sdk/openai`
- **Features**: Vercel AI SDK with modular provider support

## Setup Instructions

### Environment Variables
Create a `.env.local` file with your API keys:

```env
# For Google AI (both versions)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key

# For OpenAI (AI SDK version only)
OPENAI_API_KEY=your_openai_api_key
```

### AI SDK Version Configuration

The AI SDK version is more flexible and allows you to easily switch between different providers:

```typescript
// In ai/config.ts
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

// Use Google AI
export const aiModel = google('gemini-2.0-flash-exp');

// Or use OpenAI
// export const aiModel = openai('gpt-4o');

// Or use other providers like Anthropic, Cohere, etc.
```

## Key Differences

### 1. Architecture
- **Genkit**: Flow-based with prompt templates and schema validation
- **AI SDK**: Function-based with direct model calls and schema generation

### 2. Provider Support
- **Genkit**: Primarily Google AI, requires plugins for other providers
- **AI SDK**: Native support for multiple providers (OpenAI, Google, Anthropic, etc.)

### 3. Framework Integration
- **Genkit**: Full Firebase ecosystem integration
- **AI SDK**: Framework-agnostic, works with any JavaScript framework

### 4. Development Experience
- **Genkit**: Built-in dev tools and debugging interface
- **AI SDK**: Simpler API, easier to understand and customize

## Migration Guide

To switch from Genkit to AI SDK:

1. **Update imports in your components**:
   ```typescript
   // Old
   import { generateGame } from "@/lib/actions";
   
   // New
   import { generateGame } from "@/lib/actions-ai-sdk";
   ```

2. **Remove Genkit dependencies** (optional):
   ```bash
   pnpm remove genkit @genkit-ai/googleai genkit-cli
   ```

3. **Update package.json scripts** (optional):
   ```json
   {
     "scripts": {
       // Remove these Genkit scripts
       "genkit:dev": "genkit start -- tsx ai/dev.ts",
       "genkit:watch": "genkit start -- tsx --watch ai/dev.ts"
     }
   }
   ```

## Benefits of AI SDK Version

1. **Broader ecosystem**: Support for multiple AI providers
2. **Simpler setup**: No complex configuration files or plugins
3. **Better TypeScript support**: Native TypeScript with strong typing
4. **Framework agnostic**: Works with any framework, not tied to Firebase
5. **Smaller bundle size**: More lightweight than Genkit
6. **Active development**: Vercel AI SDK is actively maintained and updated

## Provider Options

The AI SDK version supports multiple providers out of the box:

- **Google AI**: `@ai-sdk/google` - Gemini models
- **OpenAI**: `@ai-sdk/openai` - GPT models
- **Anthropic**: `@ai-sdk/anthropic` - Claude models
- **Cohere**: `@ai-sdk/cohere` - Command models
- **Mistral**: `@ai-sdk/mistral` - Mistral models
- **And many more**: Check [Vercel AI SDK docs](https://sdk.vercel.ai/providers)

## Usage Example

```typescript
import { generateGame } from "@/lib/actions-ai-sdk";

const result = await generateGame({
  prompt: "Create a simple snake game with neon colors",
  previousHtml: undefined // or existing HTML for refinement
});

console.log(result.description); // Description of changes
console.log(result.html); // Complete game HTML
```

## Recommendation

For new projects or migrations, the **AI SDK version** is recommended due to its:
- Better provider flexibility
- Simpler architecture
- Active community and development
- Better documentation and examples
- Easier debugging and customization
