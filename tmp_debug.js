const fs = require('fs');
const path = require('path');
let text = fs.readFileSync(path.join('webpage','frontend-build','src','lib','api','platformClient.ts'),'utf8');
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
const lines = text.split('\n');
console.log(lines.length);
