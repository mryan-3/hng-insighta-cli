# Insighta CLI Tool

The official command-line interface for Insighta Labs+.

## Installation

Ensure you have Node.js (v20+) and pnpm installed.

```bash
cd stage3/cli
pnpm install
pnpm run build
pnpm link --global
```

Now you can use the `insighta` command from any directory.

## Configuration

Set your backend URL and GitHub Client ID:
```bash
export BACKEND_URL=http://your-backend-ip
export GITHUB_CLIENT_ID=your-github-client-id
```

## Commands

### Authentication
- `insighta login`: Start the secure GitHub OAuth + PKCE flow.
- `insighta logout`: Clear local credentials.
- `insighta whoami`: Check current authentication status.

### Profiles
- `insighta profiles list`: List all profiles (supports `--gender`, `--country`, `--min-age`, etc.).
- `insighta profiles search "query"`: Natural language search.
- `insighta profiles get <id>`: Get detailed information.
- `insighta profiles create --name "Name"`: (Admin only) Create a new profile.
- `insighta profiles export --format csv`: Export filtered data to a CSV file.

## Token Handling
Tokens are stored securely in `~/.insighta/credentials.json`. The CLI handles automatic token refreshing using the refresh token.
