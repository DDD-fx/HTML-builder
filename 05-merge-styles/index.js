const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const src = path.join(__dirname, 'styles');
const distFile = path.join(__dirname, 'project-dist', 'bundle.css');

const writer = fs.createWriteStream(distFile);

writer.on('error', (err) => console.log(`Err: ${err}`));
writer.on('finish', () => console.log('Process finished. Have a nice day'));

(async function cssBundle () {
  const srcFiles = await fsPromises.readdir(src, {withFileTypes:true});
  for (let dirent of srcFiles) {
    let fileExt = dirent.name.split('.').pop();
    let filePath = path.join(src, `${dirent.name}`);

    if (dirent.isFile() && fileExt === 'css') {
      const reader = await fs.createReadStream(filePath);
      reader.pipe(writer);
    }
  }
}
)();