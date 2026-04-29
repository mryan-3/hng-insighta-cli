import http from 'http';
import axios from 'axios';
import open from 'open';
import ora from 'ora';
import chalk from 'chalk';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '../utils/crypto';
import { tokenManager } from '../utils/storage';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'placeholder_id'; // Needs to match backend

export async function login() {
  const spinner = ora('Starting authentication...').start();

  try {
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    const state = generateState();
    const port = 3000; // Requirement implies a fixed or detectable port
    const redirectUri = `http://localhost:${port}/callback`;

    // 1. Create temporary server to catch the callback
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url!, `http://localhost:${port}`);
      
      if (url.pathname === '/callback') {
        const code = url.searchParams.get('code');
        const returnedState = url.searchParams.get('state');

        if (returnedState !== state) {
          res.end('Invalid state. Authentication failed.');
          server.close();
          return;
        }

        if (code) {
          res.end('Authentication successful! You can close this window.');
          server.close();
          
          spinner.text = 'Exchanging code for tokens...';
          
          try {
            const response = await axios.get(`${BACKEND_URL}/auth/github/callback`, {
              params: { code, code_verifier: verifier }
            });

            if (response.data.status === 'success') {
              const { access_token, refresh_token } = response.data.data;
              
              // We could fetch user info here or in a separate call
              tokenManager.saveTokens({ access_token, refresh_token });
              spinner.succeed(chalk.green(' Login successful!'));
              console.log(chalk.blue(' Welcome back! You are now authenticated.'));
            } else {
              spinner.fail('Authentication failed at backend.');
            }
          } catch (error: any) {
            spinner.fail(`Backend error: ${error.message}`);
          }
        }
      }
    });

    server.listen(port, () => {
      // 2. Construct GitHub URL and Open Browser
      // We skip the backend redirect for CLI to ensure we catch the code locally
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}&scope=user:email`;
      
      spinner.text = 'Please log in via your browser...';
      open(authUrl);
    });

  } catch (error: any) {
    spinner.fail(`Login process failed: ${error.message}`);
  }
}

export async function logout() {
  const tokens = tokenManager.getTokens();
  if (tokens) {
    try {
      await axios.post(`${BACKEND_URL}/auth/logout`, {
        refresh_token: tokens.refresh_token
      });
    } catch (e) {
      // Ignore network errors on logout, just clear local
    }
  }
  tokenManager.clear();
  console.log(chalk.green('Logged out successfully. Local credentials cleared.'));
}

export function whoami() {
  const tokens = tokenManager.getTokens();
  if (!tokens) {
    console.log(chalk.red('You are not logged in.'));
    return;
  }
  console.log(chalk.blue('Logged in as ') + chalk.green(`@${tokens.username || 'user'}`));
}
