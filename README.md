# Autor: Maciej Ołdakowski

# Część obowiązkowa

Aplikacja pogoda napisana korzystając z Node.js i Express. 
API jest pozyskiwne z OpenWeatherMap

```dockerfile

FROM node:20-slim AS builder
LABEL maintainer="Maciej Ołdakowski"
WORKDIR /app

COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --omit=dev

FROM node:20-slim
LABEL org.opencontainers.image.authors="Maciej Ołdakowski"
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY app.js package*.json ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "app.js"]
```

### 1. Budowanie opracowanego obrazu kontenera i uruchomienie kontenera na podstawie zbudowanego obrazu
```bash
docker build -t weather-app .
```

```bash
docker run -d -p 3000:3000 -e WEATHER_API_KEY=API_KEY --name weather weather-app
```

![screen z budowania i uruchomienia obrazu](screens/screen1.png)

### 2. Uzyskanie informacji z logów, które wygenerowała aplikacja, sprawdzenie ilości wartsw i rozmiaru obrazu

```bash
docker image inspect weather-app --format='Liczba warstw: {{len .RootFS.Layers}}'
```

```bash
docker image inspect weather-app --format='{{.Size}}' | awk '{printf "Rozmiar: %.2f MB\n", $1 / (1024*1024)}'
```

![screen z logów, wielkosci i ilości wartsw](screens/screen2.png)

# Zadanie 2

###


