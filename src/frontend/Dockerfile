FROM node:latest

WORKDIR /app
COPY . .
#RUN ls -a
RUN npm install
RUN npx ng build
RUN ls -a
