/*eslint-disable no-console */
const path = require('path');
const exec = require('child_process').exec;
const del = require('del');
const Rsync = require('rsync');

const args = process.argv.slice(2);

if (!args[0]) {
  console.log(`Valid arguments:
  • publish (publish to colormeup.co)
  • deploy (build & publish)
  • docs (rebuild documentation)`
  );
}

function publish() {
  console.log('Publishing...');
  const rsync = Rsync.build({
    exclude: ['.DS_Store'],
    progress: true,
    source: path.join(__dirname, 'dist/'),
    flags: 'avz',
    destination: 'colormeup@colormeup.co:/home/colormeup/public_html'
  });

  rsync.execute((error, stdout, stderr) => {
    if (error) {
      console.log(error);
    }
  });
}

if (args[0] === 'deploy') {
  const start = Date.now();
  console.log('Bundling...');
  exec('npm run build', {maxBuffer: 1024 * 500}, (errBuild) => {
    if (errBuild) {
      console.log(errBuild);
      return;
    }

    console.log(`Bundled in ${(Date.now() - start) / 1000} s`);
    publish();
  });
}

if (args[0] === 'publish') {
  publish();
}

if (args[0] === 'docs') {
  del(['./docs/*'])
    .then(() => {
      console.log('Generating documentation...');
      return exec('jsdoc -c .jsdoc.json -R README.md');
    });
}
