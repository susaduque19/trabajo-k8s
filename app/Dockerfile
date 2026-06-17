# --- Fase 1: Construcción (Build) ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copiar solo archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./
RUN npm ci --only=production

# Copiar el resto del código fuente
COPY server.js .

# --- Fase 2: Imagen de Producción (Ligera y Segura) ---
FROM node:20-alpine
WORKDIR /app

# Copiar desde la fase anterior solo lo estrictamente necesario
COPY --from=builder /usr/src/app ./

# Buenas prácticas de seguridad: Correr como usuario no-root
USER node

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]