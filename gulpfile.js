

const 
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoPrefixer = require('gulp-autoprefixer'),
  pug = require('gulp-pug'),
  beauty = require('gulp-html-beautify'),
  plumber = require('gulp-plumber'),
  notify = require("gulp-notify"),
  browserSync = require('browser-sync'),
  rename = require('gulp-rename'),
  cleanCss = require('gulp-clean-css'),
  babel = require('gulp-babel'),
  del = require('del'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream')
  svgSprite = require("gulp-svg-sprites"),
  util = require( 'gulp-util' ),
  ftp = require( 'vinyl-ftp' ),
  imageMin = require('gulp-imagemin'),
  imgCompress = require('imagemin-jpeg-recompress'),
  cache = require('gulp-cache');


/* Config */
const coreDir = {
  src: 'src',
  dist: 'build'
}

const config = {
  styles: {
    src: `${coreDir.src}/scss/*.scss`,
    dist: `${coreDir.dist}/css`,
    watch: `${coreDir.src}/scss/**/*.scss`
  },
  img: {
    src: `${coreDir.src}/img/*`,
    dist: `${coreDir.dist}/img`,
    watch: `${coreDir.src}/img/**/*`
  },
  svg: {
    src: `${coreDir.src}/svg/*`,
    dist: `${coreDir.dist}/svg`,
    watch: `${coreDir.src}/svg/**/*`
  },
  fonts: {
    src: `${coreDir.src}/fonts/*`,
    dist: `${coreDir.dist}/fonts`,
    watch: `${coreDir.src}/fonts/**/*`
  },
  scripts: {
    src: [`${coreDir.src}/js/*.js`, `!${coreDir.src}/js/vendor.js`],
    dist: `${coreDir.dist}/js`,
    watch: [`${coreDir.src}/js/**/*.js`, `!${coreDir.src}/js/vendor.js`]
  },
  scriptLibs: {
    src: `${coreDir.src}/js/vendor.js`,
    dist: `${coreDir.dist}/js`,
    watch: `${coreDir.src}/js/vendor.js`
  },
  pug: {
    src: `${coreDir.src}/pug/*.pug`,
    dist: `${coreDir.dist}/`,
    watch: `${coreDir.src}/pug/**/*.pug`
  },
  html: {
    src: `${coreDir.dist}/*.html`,
    dist: `${coreDir.dist}/`,
    watch: `${coreDir.dist}/*.html`
  }
}

/* Styles */
gulp.task('styles:dev', () => {
  return setTimeout(() => {
    gulp.src(config.styles.src)
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", notify.onError()))
      .pipe(rename({ suffix: '.min', prefix : '' }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.styles.dist))
      .pipe(browserSync.reload( { stream: true }))
  }, 150);
})

gulp.task('styles:build', () => {
  return gulp.src(config.styles.src)
      .pipe(sass().on("error", notify.onError()))
      .pipe(rename({ suffix: '.min', prefix : '' }))
      .pipe(autoPrefixer())
      .pipe(cleanCss( {level: { 1: { specialComments: 1 } } }))
      .pipe(gulp.dest(config.styles.dist))
});

/* Img */
gulp.task('img', () => {
  return gulp.src(config.img.src)
    .pipe(gulp.dest(config.img.dist))
});

/* Fonts */
gulp.task('fonts', () => {
  return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dist))
});

/* Svg */
gulp.task('svg', () => {
  return gulp.src(config.svg.src)
    .pipe(gulp.dest(config.svg.dist))
});

/* Scripts */
const webpackConfig = require('./webpack.config.js');

gulp.task('scripts:dev', () => {
  return gulp.src(config.scripts.src)
      .pipe(babel())
      .pipe(gulp.dest(config.scripts.dist))
      .pipe(browserSync.reload( { stream: true }))
});

gulp.task('scripts:build', () => {
  return gulp.src(config.scripts.src)
      .pipe(babel())
      .pipe(gulp.dest(config.scripts.dist))
});

gulp.task('script-libs', () => {
  return gulp.src(config.scriptLibs.src)
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(config.scriptLibs.dist));
});



/* PUG */
gulp.task('pug:dev', function() {
  return gulp.src(config.pug.src)
    .pipe(plumber())
    .pipe(pug().on("error", notify.onError()))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.pug.dist))
    .pipe(browserSync.reload( { stream: true }))
});

// Remove html before build
gulp.task('pug:build', ['html-del'], function() {
  return gulp.src(config.pug.src)
    .pipe(plumber())
    .pipe(pug({pretty: true}).on("error", notify.onError()))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.pug.dist))
});

gulp.task('html-del', () => {
  return del([config.html.src])
});


/* HTML */
const beautyOpts = {
  indent_size: 2,
  indent_with_tabs: true,
  end_with_newline: true,
  keep_array_indentation: true,
  unformatted: [
    'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
    'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
    'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
    'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
    'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'
  ]
}

gulp.task('html-beauty', function() {
  return gulp.src(config.html.src)
    .pipe(beauty(beautyOpts))
    .pipe(gulp.dest(config.html.dist))
});

/* Browser Sync */
gulp.task('browser-sync', () => {
  browserSync({
    server: { 
      baseDir: coreDir.dist
    }
  });
});

/* SVG Sprite */
gulp.task('svgSprite', function () {
  return gulp.src('src/sources/svg/*.svg')
    .pipe(svgSprite({
      mode: 'symbols',
    }))
    .pipe(gulp.dest("src"));
});

/* Optimize images */
gulp.task('imgOptim', function() {
  return gulp.src('src/sources/img/**/*')
  .pipe(cache(imageMin([
    imgCompress({
      loops: 4,
      min: 60,
      max: 70,
      quality: 'high'
    }),
    imageMin.gifsicle(),
    imageMin.optipng(),
    imageMin.svgo()
  ])))
  .pipe(gulp.dest('src/img'));
});

// add settings Host
const dataHost = require('./apiHost.js');

/* Deploy */
gulp.task( 'deploy', function () {

  var conn = ftp.create( {
      host:     dataHost.host,
      user:     dataHost.user,
      password: dataHost.password,
      parallel: 10,
      log:      util.log
  } );

  var globs = [
      'build/**'
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance
  return gulp.src( globs, { base: 'build', buffer: false } )
    .pipe( conn.newer( 'www/html/team-orange.ru/sites/siteName/' ) ) // only upload newer files
    .pipe( conn.dest( 'www/html/team-orange.ru/sites/siteName/' ) );

});

/* Dev */
gulp.task('watch', ['browser-sync', 'styles:dev', 'img', 'fonts', 'svg', 'pug:dev', 'scripts:dev', 'script-libs'], function() {
  gulp.watch(config.styles.watch, ['styles:dev']);
  gulp.watch(config.img.watch, ['img']);
  gulp.watch(config.img.watch, ['fonts']);
  gulp.watch(config.img.watch, ['svg']);
  gulp.watch(config.pug.watch, ['pug:dev']);
  gulp.watch(config.scripts.watch, ['scripts:dev']);
  gulp.watch(config.scriptLibs.watch, ['script-libs']);
  gulp.watch(config.html.src, browserSync.reload);
});

/* Build */
gulp.task('build', ['styles:build', 'img', 'fonts', 'svg', 'pug:build', 'scripts:build', 'script-libs'], () => {
  gulp.start('html-beauty')
});

/* Default Watch */
gulp.task('default', ['watch']);

