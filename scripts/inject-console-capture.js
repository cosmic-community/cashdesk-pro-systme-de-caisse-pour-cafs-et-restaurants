const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', '.next');
const publicDir = path.join(__dirname, '..', 'public');

const scriptContent = fs.readFileSync(
  path.join(publicDir, 'dashboard-console-capture.js'),
  'utf8'
);

function injectScript(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      injectScript(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (!content.includes('dashboard-console-capture.js')) {
        content = content.replace(
          '</head>',
          `<script>${scriptContent}</script></head>`
        );
        fs.writeFileSync(filePath, content);
        console.log(`Injected console capture into ${filePath}`);
      }
    }
  });
}

injectScript(buildDir);