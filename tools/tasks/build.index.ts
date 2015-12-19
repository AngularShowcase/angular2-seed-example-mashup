import {join, sep} from 'path';
import {APP_SRC, APP_DEST, DEPENDENCIES, ENV} from '../config';
import {transformPath, templateLocals} from '../utils';

export = function buildIndexDev(gulp, plugins) {
  return function () {
    let injectables = injectableAssetsRef();
    let target = gulp.src(injectables, { read: false });

    return gulp.src(join(PATH.src.all, 'index.html'))
      .pipe(plugins.inject(target, {
        transform: transformPath(plugins, 'dev')
      }))
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(PATH.dest.dev.all));
  };

  function inject(name?: string) {
    return plugins.inject(gulp.src(getInjectablesDependenciesRef(name), { read: false }), {
      name,
      transform: transformPath(plugins, 'dev')
    });
  }

  function getInjectablesDependenciesRef(name?: string) {
    return DEPENDENCIES
      .filter(dep => dep['inject'] && dep['inject'] === (name || true))
      .map(mapPath);
  }

  function mapPath(dep) {
    let prodPath = join(dep.dest, dep.src.split(sep).pop());
    return ('prod' === ENV ? prodPath : dep.src );
  }
};
