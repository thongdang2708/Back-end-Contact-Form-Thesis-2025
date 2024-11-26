
FROM node:latest

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm ci

EXPOSE 8000

CMD ["npm", "start"]
