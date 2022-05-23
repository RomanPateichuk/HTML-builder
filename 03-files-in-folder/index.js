const fs = require("fs");
const path = require("path");
const url = path.join(__dirname, "secret-folder");

function gets_files(url) {
  fs.readdir(url, (err, files) => {
    files.forEach((file) => {
      let file_url = path.join(url, file);
      fs.stat(file_url, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isDirectory()) {
          gets_files(file_url);
        } else {
          console.log(
            `${path.basename(file_url, path.extname(file_url))}-${path
              .extname(file_url)
              .slice(1)}-${stats.size / 1000}kb`
          );
        }
      });
    });
  });
}

gets_files(url);
