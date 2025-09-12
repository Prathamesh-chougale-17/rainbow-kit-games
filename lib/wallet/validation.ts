import { z } from 'zod';

/**
 * Zod schema for validating Ethereum wallet addresses
 * Validates that the address is a valid 42-character hex string starting with 0x
 */
export const WalletAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')
  .transform((addr) => addr.toLowerCase());

/**
 * Validates a wallet address string
 * @param address - The wallet address to validate
 * @returns Validation result with parsed address or error
 */
export function validateWalletAddress(address: string) {
  return WalletAddressSchema.safeParse(address);
}

/**
 * Checks if a wallet address is valid
 * @param address - The wallet address to check
 * @returns True if valid, false otherwise
 */
export function isValidWalletAddress(address: string): boolean {
  return WalletAddressSchema.safeParse(address).success;
}

/**
 * Normalizes a wallet address to lowercase
 * @param address - The wallet address to normalize
 * @returns Normalized address or throws if invalid
 */
export function normalizeWalletAddress(address: string): string {
  const result = WalletAddressSchema.safeParse(address);
  if (!result.success) {
    throw new Error(`Invalid wallet address: ${address}`);
  }
  return result.data;
}