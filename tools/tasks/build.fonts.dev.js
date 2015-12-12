"use strict";

var PATH = require('../workflow.config').PATH;

module.exports = function (gulp, plugins) {
  return function () {
    console.log("Copying fonts to " + PATH.dest.dev.fonts);
    return gulp.src('./node_modules/bootstrap/dist/fonts/**/*.*')
      .pipe(plugins.print())
      .pipe(gulp.dest(PATH.dest.dev.fonts));
  };
};