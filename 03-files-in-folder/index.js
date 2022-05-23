const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

let dir = path.join(__dirname, 'secret-folder');

fsPromises.readdir(dir, {withFileTypes: true})
  .then(files => {
    for (let file of files) {
      if (file.isFile()) {
        let filePath = path.join(dir, `${file.name}`);
        let fileName = file.name.slice(0, file.name.lastIndexOf('.'));
        let fileExt = file.name.split('.').pop();

        fs.stat(filePath, (error, stats) => {
          if (error) {
            console.log(error);
          } else {
            console.log(fileName + ' - ' + fileExt + ' - ' + (stats.size/1024).toFixed(2) + 'KB');
          }
        });
      }
    }
  });