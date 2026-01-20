FROM node:latest

WORKDIR /app

COPY *.json ./


COPY . .

RUN npm install -y

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0"]

