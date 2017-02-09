const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const fs = require('fs');
const mm = require('marky-mark');
const posts = [];
const projects = [];

const generatedContentPath = path.join(__dirname, '/../src/content');
const postsPath = path.join(__dirname, '/../_posts');
const generatedPostsPath = path.join(__dirname, '/../src/content/posts');
const projectsPath = path.join(__dirname, '/../_projects');
const generatedProjectsPath = path.join(__dirname, '/../src/content/projects');

console.log('Start assembling content');
rimraf(generatedContentPath, {}, () => {
  mkdirp(generatedPostsPath, () => {
    fs.readdir(postsPath, (err, fileList) => {
      if (err) return console.error(err);
      
      fileList.map(file => {
        const obj = {};
        const data = mm.parseFileSync(`${postsPath}/${file}`);
        obj.content = data.content;
        obj.meta = data.meta;
        posts.push(data.meta);
        fs.writeFile(`${generatedPostsPath}/${data.filename}.json`, JSON.stringify(obj), 'utf8', err => {
          if (err) console.log(err);
        });
      });
      
      fs.writeFile(`${generatedPostsPath}/posts.json`, JSON.stringify(posts.reverse()), 'utf8', err => {
        if (err) console.log(err);
      });
    });
  });

  mkdirp(generatedProjectsPath, () => {
    fs.readdir(projectsPath, (err, fileList) => {
      if (err) return console.error(err);
      
      fileList.map(file => {
        const data = mm.parseFileSync(`${projectsPath}/${file}`);
        projects.push(data.meta);
      });
      
      fs.writeFile(`${generatedProjectsPath}/projects.json`, JSON.stringify(projects), 'utf8', err => {
        if (err) console.log(err);
      });
    });
  });
});


