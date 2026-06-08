FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN yarn install --frozen-lockfile --ignore-engines

COPY client ./client
COPY server ./server

RUN yarn build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/directory.db
ENV CLIENT_DIST_PATH=/app/client/dist
ENV AUTO_SEED=true

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
COPY server/package.json ./server/

RUN yarn install --frozen-lockfile --ignore-engines --production \
  && cd server && npm rebuild better-sqlite3

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "server/dist/index.js"]
