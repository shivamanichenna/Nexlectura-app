const fs = require('fs');
const path = require('path');

const dir = 'd:/Nexlectra/functions/src/flows';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace '));' with ');'
  content = content.replace(/\)\);\n\nexport const/g, ');\n\nexport const');
  
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed extra parenthesis');
