FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY dist ./dist

ENV PORT=5000
EXPOSE 5000

CMD ["node", "dist/app.js"]
