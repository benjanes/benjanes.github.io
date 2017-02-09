const exec = require('child_process').exec;

console.log('Start build');
exec('npm run build:content', e => {
  if (e instanceof Error) {
    console.error(e);
    throw e;
  } else {
    console.log('Successfully generated content, starting webpack build');
    exec('npm run build:webpack', e => {
      if (e instanceof Error) {
        console.error(e);
        throw e;
      } else {
        console.log('Successfully ran webpack build and replaced root-level index.html');
      }
    });
  }
});