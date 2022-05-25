const fs = require("fs");
const { stdin, stdout } = process;
const path = require("path");
const url = path.join(__dirname, "data.txt");

function exit_programm() {
  console.log("Good Bye!");
  process.exit();
}

function add_text(text) {
  fs.appendFile(url, text, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
console.log("Enter some text: ");
process.on("SIGINT", (code) => {
  console.log("Good Bye!");
  process.exit();
});

stdin.on("data", (data) => {
  if (data.toString().includes("exit")) {
    exit_programm();
  } else {
    add_text(data);
  }
});
