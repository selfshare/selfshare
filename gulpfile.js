const gulp = require('gulp')
const shell = require('gulp-shell')
 
gulp.task('db-build', shell.task(['docker build --target mysql -t selfshare-db .']));

gulp.task('db-exit', shell.task(['docker container stop selfshare-db && docker container rm selfshare-db']));

gulp.task('db-run', shell.task(['docker run --name selfshare-db -p 3366:3306 -d selfshare-db', 'docker ps | grep selfshare']));

gulp.task('build', shell.task(['docker build -t selfshare .']));

gulp.task('exit', shell.task(['docker container stop selfshare && docker container rm selfshare']));

gulp.task('run', shell.task(['docker run --name selfshare -p 80:3000 -d selfshare', 'docker ps | grep selfshare']));
