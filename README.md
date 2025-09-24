# GameHub 🎮

GameHub is a decentralized AI-powered game development platform that democratizes game creation through blockchain technology, AI assistance, and community collaboration. Users can generate, publish, trade, and fork games while maintaining ownership through wallet authentication and IPFS storage.

## 🌟 Features

### 🤖 AI-Powered Game Generation
- **Instant Game Creation**: Describe your game idea and let AI generate complete HTML5 games
- **Smart Code Refinement**: Iteratively improve games with AI assistance
- **Multiple AI Models**: Support for Google Gemini and OpenAI GPT models
- **Prompt Enhancement**: AI helps refine and improve your game concepts

### 🔗 Blockchain Integration
- **Wallet Authentication**: Secure ownership using RainbowKit with multiple wallet support
- **Multi-Chain Support**: Avalanche, Ethereum, Polygon, Optimism, Arbitrum, Base
- **Decentralized Storage**: All games stored permanently on IPFS via Pinata
- **Version Control**: Complete game history tracked on-chain

### 🏪 Marketplace & Economy
- **Game Trading**: Buy and sell games with transparent ownership transfer
- **Flexible Pricing**: Set custom prices for your creations
- **Revenue Sharing**: Original creators benefit from forks and sales
- **Ownership History**: Complete provenance tracking

### 👥 Community Features
- **Game Forking**: Clone and improve existing games
- **Developer Collaboration**: Share games with the community for feedback
- **Play & Discover**: Browse and play community-created games
- **Social Features**: Like, share, and track game popularity

### 🛠 Advanced Development Tools
- **Monaco Code Editor**: Professional in-browser code editing
- **Live Preview**: Real-time game testing and iteration
- **Mobile-First Design**: Touch and keyboard controls for all games
- **Export Options**: Download games or share via QR codes

## 🏗 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Monaco Editor** - VS Code-powered code editing

### AI & Machine Learning
- **Vercel AI SDK** - AI model integration
- **Google Gemini 2.0 Flash** - Primary AI model
- **OpenAI GPT-4** - Alternative AI model support
- **Genkit** - AI development framework

### Blockchain & Web3
- **RainbowKit** - Wallet connection interface
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **Hardhat** - Smart contract development

### Backend & Database
- **MongoDB** - Game data storage
- **IPFS (Pinata)** - Decentralized file storage
- **Next.js API Routes** - Server-side logic

### Development Tools
- **Biome** - Fast linting and formatting
- **Ultracite** - Code quality enforcement
- **TypeScript** - Static type checking
- **Husky** - Git hooks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB database
- Pinata IPFS account
- WalletConnect project ID

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gamehub.git
   cd gamehub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```bash
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # AI Models
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
   OPENAI_API_KEY=your_openai_key
   
   # IPFS Storage
   PINATA_JWT=your_pinata_jwt_token
   
   # Wallet Connection
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   
   # Optional: Enable testnets
   NEXT_PUBLIC_ENABLE_TESTNETS=true
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Blockchain Development (Optional)

To work with smart contracts:

```bash
cd hardhat
pnpm install
npx hardhat compile
npx hardhat test
```

## 📁 Project Structure

```
gamehub/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── editor/            # Game editor interface
│   ├── marketplace/       # Game marketplace
│   ├── community/         # Community features
│   └── games/             # Game showcase
├── ai/                    # AI integration
│   ├── flows/             # AI generation workflows
│   └── config.ts          # AI model configuration
├── components/            # Reusable UI components
│   ├── canvas-forge/      # Game editor components
│   ├── rainbow-wallet/    # Wallet integration
│   └── ui/               # Base UI components
├── hardhat/              # Smart contract development
├── lib/                  # Utility functions
│   ├── game-service.ts   # Game CRUD operations
│   ├── mongodb.ts        # Database connection
│   └── actions.ts        # Server actions
└── types/                # TypeScript definitions
```

## 🎮 Core Functionality

### Game Creation Workflow
1. **Connect Wallet** - Authenticate using supported wallets
2. **Generate Game** - Describe your idea to AI
3. **Refine & Edit** - Iteratively improve with AI assistance
4. **Test & Preview** - Real-time testing in browser
5. **Save to IPFS** - Permanent decentralized storage
6. **Publish** - Share to community or marketplace

### Game Management
- **Version Control**: Every game iteration is saved
- **Fork System**: Clone and modify existing games
- **Ownership Transfer**: Buy/sell games with transparent history
- **Community Sharing**: Publish for collaboration and feedback

### Marketplace Features
- **Browse Games**: Discover community creations
- **Purchase Games**: Buy full ownership rights
- **Sell Games**: Monetize your creations
- **Revenue Tracking**: Monitor sales and popularity

## 🔧 API Endpoints

### Games
- `GET /api/games` - List user's games
- `POST /api/games/save` - Save game to IPFS
- `POST /api/games/publish` - Publish to marketplace/community
- `DELETE /api/games/delete` - Delete game
- `POST /api/games/fork` - Fork existing game

### Marketplace
- `GET /api/marketplace` - Browse marketplace games
- `POST /api/marketplace/buy` - Purchase game

### Community
- `GET /api/community` - Browse community games
- `POST /api/community/share` - Share game with community

## 🛡 Security Features

- **Wallet-Based Authentication**: No passwords, only cryptographic signatures
- **Decentralized Storage**: IPFS ensures permanent availability
- **Code Integrity**: All game versions cryptographically verified
- **Access Control**: Owner-only edit permissions
- **Audit Trail**: Complete transaction history on-chain

## 🎨 Design System

The application uses a modern design system built on:
- **Dark Theme**: Cyberpunk-inspired aesthetic
- **Accessible Components**: Full keyboard navigation support
- **Responsive Design**: Mobile-first approach
- **Animation**: Smooth micro-interactions
- **Glass Morphism**: Modern UI effects

## 🚦 Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Check code with Biome
pnpm format           # Format code with Biome
pnpm fix              # Auto-fix linting issues

# AI Development
pnpm genkit:dev       # Start Genkit development server
pnpm genkit:watch     # Watch mode for AI flows
```

## 🔮 Future Roadmap

- **Smart Contracts**: On-chain game ownership and trading
- **NFT Integration**: Mint games as NFTs
- **Governance Token**: Community-driven platform evolution
- **Plugin System**: Extend AI capabilities
- **Multiplayer Support**: Real-time collaborative gaming
- **Revenue Sharing**: Automated royalty distribution
- **Cross-Chain**: Multi-blockchain deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discord**: Join our developer community
- **Email**: support@gamehub.dev

## 🏆 Acknowledgments

- **Vercel** - Deployment and AI SDK
- **RainbowKit** - Wallet connection interface
- **Pinata** - IPFS infrastructure
- **Google AI** - Gemini model access
- **MongoDB** - Database services

---

**Built with ❤️ for the future of decentralized game development**
