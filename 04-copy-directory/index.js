const fs = require("fs");
const path = require("path");
const base_url = path.join(__dirname, "files");
const copy_url = path.join(__dirname, "files-copy");

let arr_base = [];
let arr_copy = [];

fs.mkdir(copy_url, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

function clean_folder(url) {
  fs.readdir(url, (err, files) => {
    files.forEach((file) => {
      let file_url = path.join(url, file);
      fs.stat(file_url, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        fs.unlink(path.join(copy_url, path.basename(file_url)), (err) => {
          if (err) throw err;
          console.log("Файл успешно удалён");
        });
      });
    });
  });
}

clean_folder(copy_url);

function gets_files(url) {
  fs.readdir(url, (err, files) => {
    files.forEach((file) => {
      let file_url = path.join(url, file);
      fs.stat(file_url, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        fs.copyFile(
          path.join(base_url, path.basename(file_url)),
          path.join(copy_url, path.basename(file_url)),
          (err) => {
            if (err) throw err;
            console.log("Файл успешно скопирован");
          }
        );
      });
    });
  });
}

gets_files(base_url);
