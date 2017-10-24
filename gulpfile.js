var
    // modules
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    gfi = require("gulp-file-insert"),
    path = require('path'),
    del = require('del'),
    Q = require('q'),
    uglify = require('gulp-uglify'),
    
    // look at merge-stream

    // development mode?
    devBuild = (process.env.NODE_ENV !== 'production'),

    // folders
    folder = {
        src: 'src/',
        build: 'build/',
        tmp: 'temp/'
    }
;


var scriptsPath = 'snippets';

var data = {
    "/* insert:snippets */": 'snippets',
    "/* insert:files */": 'files',
    "/* insert:reports */": 'reports',
    "/* insert:callbacks */": 'callbacks'
};

//function getFolders(dir) {
//    return fs.readdirSync(dir)
//      .filter(function(file) {
//        return fs.statSync(path.join(dir, file)).isDirectory();
//      });
//}

//(function(i){
//        result.push(secondFunc(data[i].item)
//        .then(function(data2) {
//            data[i].more = data2.item;
//            return data[i];
//        }));
//    })(i);

gulp.task('concat:js', function () {
    console.log("concat:js runs");
    var promises = [];
    
    for (var type in data){
        var defer = Q.defer();
        var pipeline = gulp.src(path.join(folder.src, data[type], '/*.js'))
            .pipe(concat( data[type]+'.js', {newLine: ',\n'} ))
            .pipe(gulp.dest(folder.tmp));
        
        promises.push(defer.promise);
        
        (function(pipeline, defer){
            pipeline.on('end', function () {
                defer.resolve();
            });
        })(pipeline, defer);
        
    }
    
    var all = Q.all(promises);
    console.log("promises: ", promises);
    all.then(function(){console.log('success');}, function(){console.error('error');}, function(data){console.log("progress data: ", data);});
    return all;
});

gulp.task('inject:js', function(){
    // point to temp files
    var replacements = {};
    for (var type in data){
        replacements[type] = folder.tmp + data[type] + '.js';
    }
    
    return gulp.src(folder.src+"index.html")
    .pipe(gfi(replacements))
    .pipe(gulp.dest(folder.build));
});

gulp.task('remove:tmp', function(){
    return del([folder.tmp+'*']);
});

gulp.task('default', gulp.series('concat:js', 'inject:js', 'remove:tmp'));
