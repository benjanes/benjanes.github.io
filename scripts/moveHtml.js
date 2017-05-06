const path = require('path');
const rimraf = require('rimraf');
const copy = require('copy');
const replace = require('replace');

const src = path.join(__dirname, '/../dist/*.html');
const compiled = path.join(__dirname, '/../index.html');
const dest = path.join(__dirname, '/../');

rimraf(compiled, {}, () => {
  copy(src, dest, (err, file) => {
    if (err) return console.error(err);
    replace({
      regex: '="./',
      replacement: '="/dist/',
      paths: [compiled]
    });
  });
});
