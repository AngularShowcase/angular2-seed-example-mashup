import {join} from 'path';
import {BOOTSTRAP_FONTS_SRC, BOOTSTRAP_FONTS_DEST} from '../config';
var debug = require('gulp-debug');

// This is only invoked in the production build to copy the bootstrap fonts.  The dev
// build uses the node_modules\bootstrap... directly so nothing needs to be copied.  The
// bootstrap fonts must be in a sibling folder to the css folder in /dist/prod

export = function copyBootstrapFonts(gulp, plugins, option) {
  return function () {
    let fontSrc = join(BOOTSTRAP_FONTS_SRC, '**', '*.*');
    return gulp.src(fontSrc)
      .pipe(debug({title: fontSrc}))
      .pipe(gulp.dest(BOOTSTRAP_FONTS_DEST));
  };
}
