const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const indexSrc = path.join(__dirname, 'template.html');
const componentsSrc = path.join(__dirname, 'components');
const cssSrc = path.join(__dirname, 'styles');
const assetsSrc = path.join(__dirname, 'assets');

const dist = path.join(__dirname, 'project-dist');
const indexDist = path.join(dist, 'index.html');
const cssDist = path.join(dist, 'style.css');
const assetsDist = path.join(dist, 'assets');

(async function webPack () {
  await fsPromises.rm(dist, {recursive:true, force:true});
  await fsPromises.mkdir(dist, {recursive:true});

  let indexSrcData = await fsPromises.readFile(indexSrc, 'utf-8');

  const components = await fsPromises.readdir(componentsSrc);
  for (let component of components) {
    let componentName = component.slice(0, component.lastIndexOf('.'));
    let componentPath = path.join(componentsSrc, `${component}`);
    let componentText = await fsPromises.readFile(componentPath, 'utf-8');
    indexSrcData = indexSrcData.replace(`{{${componentName}}}`, componentText);
  }
  await fsPromises.writeFile(indexDist, indexSrcData);
  await console.log('index.html created');

  /*-------------------Styles Bundle-------------------*/
  const cssWriter = fs.createWriteStream(cssDist);
  cssWriter.on('error', (err) => console.log(`Err: ${err}`));
  cssWriter.on('finish', () => console.log('style.css created'));

  const cssSrcFiles = (await fsPromises.readdir(cssSrc, {withFileTypes: true})).reverse();
  [cssSrcFiles[0], cssSrcFiles[1]] = [cssSrcFiles[1], cssSrcFiles[0]];
  for (let dirent of cssSrcFiles) {
    let fileExt = dirent.name.split('.').pop();
    let filePath = path.join(cssSrc, `${dirent.name}`);
    if (dirent.isFile() && fileExt === 'css') {
      const cssReader = await fs.createReadStream(filePath);
      await cssReader.pipe(cssWriter);
    }
  }
  /*-------------------Folder Copy-------------------*/
  async function copyDir (assetsSrc, assetsDist) {
    await fsPromises.rm(assetsDist, {recursive:true, force:true});
    await fsPromises.mkdir(assetsDist, {recursive:true});
    const assetsSrcFiles = await fsPromises.readdir(assetsSrc, {withFileTypes: true});

    for (let item of assetsSrcFiles) {
      let newAssetsSrc = path.join(assetsSrc, `${item.name}`);
      let newDestSrc = path.join(assetsDist, `${item.name}`);
      if (item.isDirectory()) {
        await copyDir(newAssetsSrc, newDestSrc);
      } else {
        await fsPromises.copyFile(newAssetsSrc, newDestSrc);
      }
    }
  }
  await copyDir(assetsSrc, assetsDist);
  await console.log('assets copied');
}
)();