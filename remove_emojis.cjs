const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function removeEmojis(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F004}-\u{1F0CF}\u{1F170}-\u{1F251}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{2B05}\u{2B06}\u{2B07}\u{2122}\u{00A9}\u{00AE}]/gu;
  
  const newContent = content.replace(emojiRegex, '');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Removed emojis from', filePath);
  }
}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else {
      if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.json') || fullPath.endsWith('.css')) {
        removeEmojis(fullPath);
      }
    }
  });
}

traverseDir(directoryPath);
