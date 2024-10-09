FROM node:22.8

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 4000
EXPOSE 3000 

CMD ["npm", "run", "start"]