var
    // modules
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    merge = require('merge-stream'),
    gfi = require("gulp-file-insert"),
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

gulp.task('js', function(){
//    gulp.src(folder.src + '*.js')
//    .pipe(concat('test.js', {newLine: ','}))
//    .pipe(gulp.dest(folder.tmp));
  
    var x = {
        "/* insert:snippets */": [folder.src + 'snippets/*.js', 'snippets.js'],
        "/* insert:files */": [folder.src + 'files/*.js', 'files.js'],
        "/* insert:reports */": [folder.src + 'reports/*.js', 'reports.js'],
        "/* insert:callbacks */": [folder.src + 'callbacks/*.js', 'callbacks.js']
    };
    
    
    var files = gulp.src(folder.src + 'snippets/*.js')
                .pipe(concat('snippets.js', {newLine: ',\n'}))
                .pipe(gulp.dest(folder.tmp));
    
    console.log("gulp src: ", gulp.src(folder.src + 'snippets/*.js'));
    
    gulp.src(folder.src + 'index.html')
    .pipe(gfi({
        "/* insert:snippets */": folder.tmp+'snippets.js' //files //folder.src + "1.js"
    }))
    .pipe(gulp.dest(folder.build));
});

function concatJSONInsert(data){
    var x = {};
    for (var collection in data){
        gulp.src(data[collection][0])
            .pipe(concat(data[collection][1], {newLine: ',\n'}))
            .pipe(gulp.dest(folder.tmp));
        x[collection] = folder.tmp+data[collection][1];
    }
    
    for (var collection in data){
        return gulp.src(target)
        .pipe(gfi({
            replaceString: tmpName 
        }))
        .pipe(gulp.dest(folder.build));
    }
    
    
}

gulp.task('default', ['js']);

//return gulp.src(folder.src + 'index.html')
//.pipe(inject(
//    gulp.src('index/base3.html'), {
//         starttag: '<!-- inject:base3:html -->',
//         transform: function(filepath, file) {
//           return file.contents.toString();
//         }
//      })
//)

//gulp.task('test', function() {
//  var bootstrap = gulp.src('bootstrap/js/*.js')
//    .pipe(gulp.dest('public/bootstrap'));
//
//  var jquery = gulp.src('jquery.cookie/jquery.cookie.js')
//    .pipe(gulp.dest('public/jquery'));
//
//  return merge(bootstrap, jquery);
//});