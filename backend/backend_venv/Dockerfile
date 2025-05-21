# Utilise une image officielle Node.js
FROM node:18

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie tous les fichiers de l'app
COPY . .

# Port exposé
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
