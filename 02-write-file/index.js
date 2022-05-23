const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;

const file = path.join(__dirname, 'notes.txt');

/*-----change flag to 'a' to open file for appending------*/
const stream = fs.createWriteStream(file, {flags: 'w'});

stream.on('error', (err) => console.log(`Err: ${err}`));
process.on('exit', () => stdout.write('Process terminated. Have a nice day'));
process.on('SIGINT', () => process.exit());

stdout.write('Type something and press Enter:\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  stream.write(data +'\n');
});
