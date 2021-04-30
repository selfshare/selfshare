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
ENV db_host="2.56.99.180"
ENV db_pw="D=RD&An[{vjW`N}pfDe%.+82tbyUnkLYx+Se?4?+3*e9pFh*ny>M=WYKYc#.5#qD"
ENV db_port=3366
ENV activate_swagger=false

WORKDIR /app
COPY --from=build_backend /app/backend/package*.json ./
COPY --from=build_backend /app/backend/swagger.yaml ./
COPY --from=build_backend /app/backend/dist/src ./dist
COPY --from=build_frontend /app/frontend/dist/frontend/ dist/public
RUN npm install --prod

EXPOSE 3000
CMD node ./dist/app.js
