const path = require('path');
const fs = require('fs/promises');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

(async function copyDir () {
  await fs.rm(dest, {recursive:true, force:true});
  await fs.mkdir(dest, {recursive:true});

  const srcFiles = await fs.readdir(src);
  for (let file of srcFiles) {
    let srcFilePath = path.join(src, file);
    let destFilePath = path.join(dest, file);
    await fs.copyFile(srcFilePath, destFilePath);
  }
  console.log('All files copied successfully');
}
)();


