FROM node:20-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build


EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
