FROM node:18.18.2-alpine3.18

WORKDIR /jedha
COPY . .
RUN npm install

CMD ["npm run start:pm2"]
