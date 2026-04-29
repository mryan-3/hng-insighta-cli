import crypto from 'crypto';

/**
 * Proof Key for Code Exchange (PKCE) Utilities
 * This provides the "Secret Handshake" for the CLI.
 */

export function generateCodeVerifier(): string {
  // Generates a random string of 64 characters
  return crypto.randomBytes(32).toString('hex');
}

export function generateCodeChallenge(verifier: string): string {
  // Hashes the verifier using SHA-256 and encodes it to Base64URL
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateState(): string {
  // Generates a random state to prevent CSRF attacks
  return crypto.randomBytes(16).toString('hex');
}
