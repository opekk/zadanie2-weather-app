FROM ubuntu:22.04 AS builder
LABEL maintainer="Maciej Ołdakowski"
WORKDIR /app

RUN apt-get update && apt-get install -y curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --omit=dev

FROM ubuntu:22.04
LABEL org.opencontainers.image.authors="Maciej Ołdakowski"
WORKDIR /app

RUN apt-get update && apt-get install -y nodejs ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY app.js package*.json ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "app.js"]
