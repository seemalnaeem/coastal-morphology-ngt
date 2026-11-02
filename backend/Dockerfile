FROM node:20-alpine

WORKDIR /app

# Install deps first for layer caching. shared is mounted at /shared in compose.
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3046
CMD ["npm", "run", "dev"]
