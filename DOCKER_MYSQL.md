## How to start an MySQL database for development in docker

1. Make sure docker is installed
2. Run ``docker pull mysql``
3. Run ``docker run --name mysql-server --restart always -p 3306:3306 -p 33060:33060 -e MYSQL_ROOT_PASSWORD=mysql -d mysql``
4. Run ``docker exec -it mysql-server bash``
5. Run ``mysql -u root -p`` and use ``mysql`` as password
6. Run ``CREATE USER 'selfshare'@'%' IDENTIFIED WITH mysql_native_password BY 'xs6HZKdc5YEi6';GRANT USAGE ON *.* TO 'selfshare'@'%';ALTER USER 'selfshare'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;CREATE DATABASE IF NOT EXISTS `selfshare`;GRANT ALL PRIVILEGES ON `selfshare`.* TO 'selfshare'@'%';``
7. Run ``flush privileges;``
8. ``exit;`` the mysql-client
9. ``exit`` the container and it should be working!

## How to start phpmyadmin in docker (if needed)

10. ``docker run --name phpmyadmin -d --link mysql-server:db -p 8080:80 phpmyadmin``
