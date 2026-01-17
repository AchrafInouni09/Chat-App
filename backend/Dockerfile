FROM node:latest

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -y

# Copy source code
COPY . .

EXPOSE 3000

# Start backend with Node
CMD ["npm", "start"]

