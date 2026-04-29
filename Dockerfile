FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the project (creates dist/index.js)
RUN pnpm run build

# Set the backend URL as an environment variable
ENV BACKEND_URL=http://165.245.212.63

# Define the entrypoint so you can run 'docker run <image> <args>'
ENTRYPOINT ["node", "/app/dist/index.js"]
