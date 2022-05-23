const fs = require("fs");
const { stdin, stdout } = process;
const path = require("path");
const { exit } = require("process");
const url = path.join(__dirname, "data.txt");
console.log("тут есть косяк с выходом через exit");
function add_text(text) {
  fs.appendFile(url, text, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

console.log("Enter some text: ");

process.on("exit", () => console.log("Good Bye!"));
stdin.on("data", (data) => {
  if (data.toString().includes("exit")) {
    add_text(data.toString().replace(/exit/gi, ""));
    process.exit();
  } else {
    add_text(data);
  }
});
