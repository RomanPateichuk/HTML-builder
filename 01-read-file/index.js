const fs = require("fs");
const path = require("path");
let stream = fs.createReadStream(path.join(__dirname, "text.txt"), "UTF-8");
stream.on("data", (chunk) => console.log(chunk));
