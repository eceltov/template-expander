const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function typeValid(type) {
  return type === 'person' || type === 'object';
}

function log(...tokens) {
  console.log(banner);
  console.log(...tokens);
  console.log(banner);
}

const tags = JSON.parse(fs.readFileSync('tags/tags.json'), 'utf8');
const banner = '-------------------------------';

readline.on('line', processInput);
readline.on('close', exit);

function processInput(input) {
  const tokens = input.split(' ');
  if (tokens[0] === 'list' && tokens.length === 1) {
    list();
  }
  else if (tokens[0] === 'get' && tokens.length === 2) {
    get(tokens[1]);
  }
  else if (tokens[0] === 'add' && tokens.length === 4) {
    add(tokens[1], tokens[2], tokens[3]);
  }
  else if (tokens[0] === 'remove' && tokens.length === 2) {
    remove(tokens[1]);
  }
  else if (tokens[0] === 'rename' && tokens.length === 3) {
    rename(tokens[1], tokens[2]);
  }
  else if (tokens[0] === 'retag' && tokens.length === 3) {
    retag(tokens[1], tokens[2]);
  }
  else if (tokens[0] === 'exit' && tokens.length === 1) {
    exit();
  }
  else if (tokens[0] === 'help' && tokens.length === 1) {
    help();
  }
  else {
    console.log(banner);
    console.log('Invalid command.');
    help();
    console.log(banner);
  }
}

function list() {
  console.log(banner);
  Object.keys(tags).forEach((tag) => {
    console.log(tag);
  });
  console.log(banner);
}

function get(tag) {
  if (tags[tag] === undefined) {
    log('This tag is unknown.');
  }
  else {
    log(tags[tag].name, '(' + tags[tag].type + ')');
  }
}

function add(tag, name, type) {
  if (tags[tag] !== undefined) {
    log('This tag is already present.');
  }
  else if (!typeValid(type.toLowerCase())) {
    log('This type is invalid.');
  }
  else {
    tags[tag] = {
      name: name.toLowerCase(),
      type: type.toLowerCase()
    }
  }
}

function remove(tag) {
  if (tags[tag] === undefined) {
    log('This tag does not exist.');
  }
  else {
    delete tags[tag];
  }
}

function rename(tag, newName) {
  if (tags[tag] === undefined) {
    log('This tag does not exist.');
  }
  else {
    tags[tag].name = newName.toLowerCase();
  }
}

function retag(oldTag, newTag) {
  if (tags[oldTag] === undefined) {
    log('This tag does not exist.');
  }
  else if (tags[newTag] !== undefined) {
    log('That tag name is already taken.');
  }
  else {
    tags[newTag] = tags[oldTag];
    delete tags[oldTag];
  }
}

function help() {
  console.log(banner);
  console.log('Command list:');
  console.log('list');
  console.log('get <tag>');
  console.log('add <tag> <name> <type>');
  console.log('remove <tag>');
  console.log('rename <tag> <newName>');
  console.log('retag <tag> <newTag>');
  console.log('exit');
  console.log(banner);
}

function exit() {
  fs.writeFileSync('tags/tags.json', JSON.stringify(tags));
  process.exit(0);
}

help();
