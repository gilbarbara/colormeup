const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = ['js', 'json', 'jsx', 'mjs'];

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(ext =>
    fs.existsSync(resolveFn(`${filePath}.${ext}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  appPath: resolvePath('.'),
  appAssets: resolvePath('assets'),
  appBuild: resolvePath('build'),
  appHtml: resolvePath('assets/index.html'),
  appIndexJs: resolveModule(resolvePath, 'app/scripts/index'),
  appModernizr: resolvePath('app/scripts/vendor/modernizr-custom.js'),
  appModernizrrc: resolvePath('config/modernizrrc.json'),
  appPolyfills: resolvePath('config/polyfills'),
  appSrc: resolvePath('app/scripts'),
  config: resolvePath('config'),
  dotenv: resolvePath('.env'),
  nodeModules: resolvePath('node_modules'),
  packageJson: resolvePath('package.json'),
  publicPath: resolvePath('/'),
  test: resolvePath('test'),
};
