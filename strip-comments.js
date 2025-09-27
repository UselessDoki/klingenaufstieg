#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function stripJsComments(code){
  // remove /* */ and // comments conservatively (not perfect but fine for this codebase)
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1');
}

function stripCssComments(code){
  return code.replace(/\/\*[\s\S]*?\*\//g, '');
}

function minifyWhitespace(code){
  return code
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[\t ]{2,}/g, ' ');
}

function processFile(file){
  const ext = path.extname(file).toLowerCase();
  let code = fs.readFileSync(file, 'utf8');
  if(ext === '.js') code = minifyWhitespace(stripJsComments(code));
  if(ext === '.css') code = minifyWhitespace(stripCssComments(code));
  fs.writeFileSync(file.replace(/\.(js|css)$/i, '.min.$1'), code, 'utf8');
}

function walk(dir){
  for(const entry of fs.readdirSync(dir)){
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if(stat.isDirectory()) walk(p);
    else if(/\.(js|css)$/i.test(entry)) processFile(p);
  }
}

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
walk(root);
console.log('Minified assets written alongside originals as *.min.js/*.min.css');

