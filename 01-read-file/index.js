const fs = require('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');
stream.on('data', chunk => stdout.write(chunk));
stream.on('error', (err) => console.error(err));