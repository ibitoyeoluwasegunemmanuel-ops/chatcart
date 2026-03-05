FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend
COPY frontend ./frontend
COPY database ./database

ENV NODE_ENV=production
EXPOSE 4000

WORKDIR /app/backend
CMD ["node", "server.js"]
