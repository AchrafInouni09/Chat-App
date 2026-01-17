FROM node:latest

# SHELL [ "bash" ]

WORKDIR /app

COPY *.json ./

# RUN apt update -y && apt install vite npm -y

COPY . .

RUN npm install -y

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0"]

