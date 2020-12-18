const gulp = require('gulp')
const shell = require('gulp-shell')

let port, i = process.argv.indexOf("--port");
if(i>-1) {
    port = process.argv[i+1];
}

if(port === undefined){
	port = '80';
}
 
gulp.task('db-build', shell.task(['docker build --target mysql -t selfshare-db .']));

gulp.task('db-exit', shell.task(['docker container stop selfshare-db && docker container rm selfshare-db']));

gulp.task('db-run', shell.task(['docker run --name selfshare-db -p 3366:3306 -d selfshare-db', 'docker ps | grep selfshare']));

gulp.task('db-stop', shell.task(['docker stop selfshare-db']));

gulp.task('db-start', shell.task(['docker start selfshare-db']));

gulp.task('build', shell.task(['docker build -t selfshare .']));

gulp.task('exit', shell.task(['docker container stop selfshare && docker container rm selfshare']));

gulp.task('run', shell.task(['docker run --name selfshare -p ' + port + ':3000 -d selfshare', 'docker ps | grep selfshare']));

gulp.task('list', shell.task(['docker ps | grep selfshare']));

gulp.task('stop', shell.task(['docker stop selfshare']));

gulp.task('start', shell.task(['docker start selfshare']));
