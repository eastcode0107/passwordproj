const fs = require("fs");
const { parse } = require("csv-parse"); 
const sha256 = require('sha256');
const { createHash } = require('crypto');
const readlineSync = require('readline-sync');

const readFromFile = () => {
  fs.createReadStream("./database.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
  // Used to remove the '\r' character from the last row!
  row[3] = row[row.length - 1].trim()

  if(row[0] && row[1] && row[2] && row[3]){
    fs.appendFileSync("hash_database.csv", row[0] + " , " + row[1] + " , " + sha256(row[2]) + " , " + row[3] + "\n", "utf-8")
    console.log(row)
  }

  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    console.log("finished");
  });
}

const menu = () => {
  console.log("--- Sha-256 Hasher ---")
  console.log("1. Generate Hashes")
  console.log("2. Option 2 (PLACE HOLDER)")
  console.log("3. Exit")

  let userInput = readlineSync.question();

  switch(userInput) {
    case "1":
      console.log("Option 1")
      console.log("Enter file line to hash. ")
      fs.truncate('hash_database.csv', 0, function(){console.log('done')})
      readFromFile();
      break;
    case "2":
      console.log("Option 2 (PLACE HOLDER)")
      break;
    case "3":
      console.log("Exitting program!")
      break;
    default:
      console.log("Invalid choice / input!")
      menu()
      break;
  }
}

menu()