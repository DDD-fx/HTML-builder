const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

(async function copyDir () {
  await fsPromises.rm(dest, {recursive:true, force:true});
  await fsPromises.mkdir(dest, {recursive:true});
  const srcFiles = await fsPromises.readdir(src);
  for (let file of srcFiles) {
    let srcFilePath = path.join(src, `${file}`);
    let destFilePath = path.join(dest, `${file}`);
    await fsPromises.copyFile(srcFilePath, destFilePath);
  }
  console.log('All files copied successfully');
}
)();