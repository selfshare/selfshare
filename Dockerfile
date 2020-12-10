FROM node:latest

# ENV VARS
ENV npm_package_name=selfshare
ENV npm_package_version=1.0.1
ENV backend_path="/api"

## FRONTEND
WORKDIR /app/frontend
COPY src/frontend .
RUN ls -a
RUN npm install
RUN npx ng build --prod


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

## COPY FRONTEND FILES TO BACKEND
RUN cp -r /app/frontend/dist/frontend/ /app/backend/dist/public

EXPOSE 3000

CMD service mysql start ; node ./dist/app.js
