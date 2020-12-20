### STAGE 0: Mysql server
FROM mysql as mysql
ENV MYSQL_RANDOM_ROOT_PASSWORD=yes
EXPOSE 3306
COPY ./src/mysql/ /docker-entrypoint-initdb.d/


### STAGE 1: Build frontend ###
FROM node AS build_frontend

WORKDIR /app/frontend
COPY src/frontend .
RUN ls -a
RUN npm install
RUN npx ng build --prod


### STAGE 2: Build Backend
FROM node as build_backend

WORKDIR /app/backend
COPY src/backend .

RUN npm install
RUN npx tslint -c tslint.json -p tsconfig.json --fix
RUN npx tsc


### STAGE 3: Run with mysql database
FROM node as run

# ENV VARS
ENV npm_package_name=selfshare
ENV npm_package_version=1.0.1
ENV backend_path="/api"
ENV db_host="docker"
ENV db_port=3366
ENV activate_swagger=true

WORKDIR /app
COPY --from=build_backend /app/backend/package*.json ./
COPY --from=build_backend /app/backend/swagger.yaml ./
COPY --from=build_backend /app/backend/dist/src ./dist
COPY --from=build_frontend /app/frontend/dist/frontend/ dist/public
RUN npm install --prod

#RUN apt-get update && apt-get install -y mysql-server
#RUN service mysql start && mysql -u root -p="" -e "create database selfshare;grant all privileges on selfshare.* TO 'selfshare'@'localhost' identified by 'xs6HZKdc5YEi6';flush privileges;"


EXPOSE 3000
CMD node ./dist/app.js
