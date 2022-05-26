const fs = require("fs");
const path = require("path");
const promises = require("fs").promises;
const dist = path.join(__dirname, "project-dist");
const from = path.join(__dirname, "assets/");
const to = path.join(__dirname, "project-dist", "assets/");
const url_bundle = path.join(__dirname, "project-dist", "style.css");
const url = path.join(__dirname, "styles");

async function init_folders() {
  await promises.rm(dist, {
    recursive: true,
    force: true,
  });

  await promises.mkdir(dist, {
    recursive: true,
    force: true,
  });

  await promises.mkdir(path.join(__dirname, "project-dist", "assets"), {
    recursive: true,
  });
}

async function copy_files(from, to) {
  await promises.copyFile(
    path.join(__dirname, "template.html"),
    path.join(__dirname, "project-dist", "index.html")
  );

  await promises.rm(to, { recursive: true, force: true });
  await promises.mkdir(to, { recursive: true });

  const fromFiles = await promises.readdir(from, { withFileTypes: true });
  for (const file of fromFiles) {
    try {
      if (file.isFile()) {
        await promises.copyFile(
          path.join(from, file.name),
          path.join(to, file.name)
        );
      } else {
        copy_files(path.join(from, file.name), path.join(to, file.name));
      }
    } catch (err) {
      console.error(err);
    }
  }
}

async function replace(name, file) {
  let html = await promises.readFile(
    path.join(__dirname, "project-dist", "index.html"),
    "utf8"
  );

  html = html.replace(`{{${name}}}`, file);

  fs.writeFile(
    path.join(__dirname, "project-dist", "index.html"),
    html,
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
}

async function get_components() {
  let files = await promises.readdir(path.join(__dirname, "components"));

  for (let file of files) {
    let file_url = path.join(path.join(__dirname, "components"), file);

    if (path.extname(file_url).slice(1) === "html") {
      let file = await promises.readFile(path.join(file_url), "utf8");
      let name = path.basename(file_url, path.extname(file_url));
      await replace(name, file);
    }
  }
}

function write(file, url_bundle) {
  fs.appendFile(url_bundle, file, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

async function gets_files(url) {
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

async function build_page() {
  await init_folders();
  await copy_files(from, to);
  await get_components();
  await gets_files(url);
}

build_page();
