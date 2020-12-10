FROM node:latest

## FRONTEND
WORKDIR /app/frontend
COPY src/frontend .
RUN ls -a
RUN npm install
RUN npx ng build


## BACKEND
WORKDIR /app/backend

RUN apt-get update && apt-get install -y mysql-server
RUN service mysql start && mysql -u root -p="" -e "create database selfshare;grant all privileges on selfshare.* TO 'selfshare'@'localhost' identified by 'xs6HZKdc5YEi6';flush privileges;"

# copy configs to /app folder
COPY src/backend .

# check files list
#RUN ls -a

RUN npm install
RUN npx tslint -c tslint.json -p tsconfig.json --fix
RUN npx tsc

RUN cp -r /app-frontend/dist/ dist/

EXPOSE 3000

#CMD "ls"
CMD service mysql start ; node ./dist/app.js
