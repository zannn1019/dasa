# --- Build Stage ---
FROM node:24-alpine AS build

# Install build dependencies for native modules
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    python3 \
    git

WORKDIR /opt/
COPY package*.json ./
RUN npm install

WORKDIR /opt/app
COPY . .
ENV NODE_ENV=production
RUN npm run build

# --- Production Stage ---
FROM node:24-alpine

# Install runtime dependencies for sharp/vips if needed
RUN apk add --no-cache vips-dev

WORKDIR /opt/app
COPY --from=build /opt/node_modules ./node_modules
COPY --from=build /opt/app ./
ENV PATH=/opt/node_modules/.bin:$PATH
ENV NODE_ENV=production

EXPOSE 1337
CMD ["npm", "run", "start"]
