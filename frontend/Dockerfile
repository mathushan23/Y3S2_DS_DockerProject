FROM node:20-alpine
WORKDIR /app
COPY package.json .
COPY vite.config.js .
COPY index.html .
COPY src ./src
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
