const fs = require('fs');

function isDefaultCapitalizable(tagType) {
  return tagType === 'person';
}

const tags = JSON.parse(fs.readFileSync('tags/tags.json'), 'utf8');

const outDir = './out';

if (!fs.existsSync(outDir)){
    fs.mkdirSync(outDir);
}

fs.readdirSync('in/').forEach((fileName) => {
  const text = fs.readFileSync('in/' + fileName, 'utf8');
  let fragments = [];
  let tagIndices = [];
  let matchStart = 0; // from where a substring should be captured

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      // push previous text to the list
      if (matchStart < i) {
        fragments.push(text.substring(matchStart, i));
      }

      let sentenceStart = false;

      if ((i > 0 && text[i-1] === '"')
       || (i > 1 && text[i-1] === ' ' && text[i-2] === '.')) {
          sentenceStart = true;
      }

      let j = i;
      while (text[j] !== '}') {
        j++;
      }

      const tag = text.substring(i + 1, j);
      let suffix = null;

      // capture 's 
      if (j+2 < text.length && text[j+1] === '\'' && text[j+2] === 's') {
        j += 2;
        suffix = '\'s';
      }
      // capture s
      if (j+1 < text.length && text[j+1] === 's') {
        j++;
        suffix = 's';
      }

      tagIndices.push(fragments.length);
      fragments.push({
        tag: tag,
        suffix: suffix,
        sentenceStart:sentenceStart
      });
      i = j;
      matchStart = j + 1;
    }
    // push end of text
    else if (i == text.length - 1) {
      fragments.push(text.substring(matchStart, text.length));
    }
  }

  tagIndices.forEach((index) => {
    const tagObj = fragments[index];
    const tag = tagObj.tag;
    const suffix = tagObj.suffix;

    if (tags[tag] !== undefined) {
      expanded = tags[tag].name;

      // handle suffix
      if (suffix !== null) {
        // possesive
        if (suffix === '\'s') {
          if (tags[tag].type !== 'person') {
            throw new Error('Only people can have associative suffixes. Tag ' + tag + ' is not a person.');
          }

          const lastChar = expanded[expanded.length - 1];
          if (lastChar === 's' || lastChar === 'z') {
            expanded += '\'';
          }
          else {
            expanded += '\'s';
          }
        }

        // plural
        else if (suffix === 's') {
          const lastChar = expanded[expanded.length - 1];
          if (lastChar === 's' || lastChar === 'z') {
            expanded += 'es';
          }
          else {
            expanded += 's';
          }
        }
      }

      // handle capitalization
      if (isDefaultCapitalizable(tags[tag].type) || tagObj.sentenceStart) {
        expanded = expanded[0].toUpperCase() + expanded.substring(1);
      }

      fragments[index] = expanded;
    }
    else {
      throw new Error('Tag ' + tag + ' is undefined');
    }
  });

  const expandedText = fragments.join('');

  fs.writeFileSync(outDir + '/' + fileName, expandedText);
});