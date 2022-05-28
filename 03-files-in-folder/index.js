const path = require('path');
const fs = require('fs/promises');
const { stat } = require('fs');

let dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, {withFileTypes: true})
  .then(files => {
    for (let file of files) {
      if (file.isFile()) {
        let filePath = path.join(dir, file.name);
        let fileExt = path.extname(filePath);
        let fileName = path.basename(filePath, fileExt);

        stat(filePath, (error, stats) => {
          if (error) {
            console.error(error);
          } else {
            let fileSize = (stats.size/1024).toFixed(2);
            console.log(fileName + ' - ' + fileExt.slice(1) + ' - ' + fileSize + 'KB');
          }
        });
      }
    }
  });

