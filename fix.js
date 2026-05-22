const fs = require('fs');
const path = require('path');
const dir = 'src/components/ui';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const importRegex = /^import\s+\{([^}]+)\}\s+from\s+["']class-variance-authority["']/m;
  const match = content.match(importRegex);
  
  if (match && match[1].includes('VariantProps')) {
    const newImports = match[1].split(',')
      .map(s => s.trim())
      .filter(s => s && !s.includes('VariantProps'))
      .join(', ');
    
    if (newImports) {
      content = content.replace(importRegex, `import { ${newImports} } from "class-variance-authority"`);
    } else {
      content = content.replace(importRegex, '');
    }
    
    if (content.includes('import { cn } from "@/lib/utils"')) {
        content = content.replace(/import\s+\{\s*cn\s*\}\s+from\s+["']@\/lib\/utils["']/, 'import { cn, type VariantProps } from "@/lib/utils"');
    } else {
        content = `import { type VariantProps } from "@/lib/utils"\n` + content;
    }
    
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
console.log('Done!');
