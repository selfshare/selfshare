FROM node:latest
WORKDIR /usr/src/app

COPY src/backend/package*.json ./

RUN npm install --only=prod

COPY . .


EXPOSE 8080
CMD [ "node", "src/backend/src/app.ts" ]

