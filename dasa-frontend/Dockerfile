FROM node:24-alpine AS builder

WORKDIR /app

# Enable modern fast package building capabilities
RUN corepack enable

COPY package*.json ./
RUN npm install

COPY . .

# Request a heavy production nitro build compilation
RUN npm run build

# --- Lean Production Image ---
FROM node:24-alpine

WORKDIR /app

# We only need the compiled Nitro `.output` environment
COPY --from=builder /app/.output ./.output

# Required environmental overrides inside isolated containers
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Execute server bootup
CMD ["node", ".output/server/index.mjs"]
