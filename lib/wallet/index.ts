// Wallet validation utilities
export {
  WalletAddressSchema,
  validateWalletAddress,
  isValidWalletAddress,
  normalizeWalletAddress,
} from './validation';

// Wallet context and hooks
export {
  WalletProvider,
  useWallet,
  useRequireWallet,
  withWalletRequired,
} from './wallet-context';

// Rainbow Kit configuration
export { config, supportedChains } from './rainbow-kit-client';