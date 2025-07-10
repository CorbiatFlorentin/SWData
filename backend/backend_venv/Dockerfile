# Node img
FROM node:18

# Dir that has the app 
WORKDIR /app

# Copy dependancies's files
COPY package*.json ./

# Install dependancies
RUN npm install

# Copy all app's files
COPY . .

# Port exposed
EXPOSE 5000

# Start command 
CMD ["node", "server.js"]
