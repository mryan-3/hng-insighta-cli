import Conf from 'conf';

export interface TokenData {
  access_token: string;
  refresh_token: string;
  username?: string;
}

/**
 * Token Manager
 * Securely stores and retrieves JWTs in ~/.insighta/credentials.json
 */
const config = new Conf({
  projectName: 'insighta',
  configName: 'credentials',
});

export const tokenManager = {
  saveTokens(tokens: TokenData) {
    config.set('access_token', tokens.access_token);
    config.set('refresh_token', tokens.refresh_token);
    if (tokens.username) {
      config.set('username', tokens.username);
    }
  },

  getTokens(): TokenData | null {
    const access = config.get('access_token') as string;
    const refresh = config.get('refresh_token') as string;
    const username = config.get('username') as string;

    if (!access || !refresh) return null;

    return { access_token: access, refresh_token: refresh, username };
  },

  clear() {
    config.clear();
  }
};
