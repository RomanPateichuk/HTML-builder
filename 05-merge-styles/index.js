const fs = require("fs");
const path = require("path");
const url = path.join(__dirname, "styles");
const url_bundle = path.join(__dirname, "project-dist", "bundle.css");

fs.open(url_bundle, "a+", (err) => {
  if (err) throw err;
});

function clean_bundle() {
  fs.truncate(url_bundle, (err) => {
    if (err) throw err;
  });
}

function write(file, url_bundle) {
  fs.appendFile(url_bundle, file, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

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
          if (path.join(url, path.basename(file_url)).includes(".css")) {
            fs.readFile(
              path.join(url, path.basename(file_url)),
              "utf8",
              (err, file) => {
                if (err) {
                  console.error(err);
                  return;
                }
                write(file, url_bundle);
              }
            );
          }
        }
      });
    });
  });
}

clean_bundle();
gets_files(url);
