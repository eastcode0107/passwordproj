const fs = require("fs");
const { parse } = require("csv-parse"); 
const sha256 = require('sha256');
const { createHash } = require('crypto');
const readlineSync = require('readline-sync');

const readFromFile = (filePath, hashedFile) => {
  fs.createReadStream(filePath)
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
  // Used to remove the '\r' character from the last row!
  row[3] = row[row.length - 1].trim()

  if(row[0] && row[1] && row[2] && row[3]){
    fs.appendFileSync(hashedFile, row[0] + "," + row[1] + "," + sha256(row[2]) + "," + row[3] + "\n", "utf-8")
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

const displayFile = (displayPath) => {
  fs.createReadStream(displayPath)
  .pipe(parse({ delimiter: "," }))
  .on("data", function (row) {
    console.log(row[0] + "," + row[1] + "," + sha256(row[2]) + "," + row[3])
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    console.log("finished");
  });
}

const passwordChecker = () => {
  // YOU NEED TO MAKE SURE WE ARE MATCHING THE CORRECT DATA TYPES!
  let username = readlineSync.question("Enter Username: ");
  let password = readlineSync.question("Enter Password: ");
  let checkPassword = sha256(password)
  let flag = 0;
    fs.createReadStream("hash_database.csv")
    .pipe(parse({ delimiter: ","}))
    .on("data", function (row) {
      if(username == row[0] && checkPassword == row[2]) {
        console.log("Hello " + row[1])
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
  console.log("2. Display Hashes")
  console.log("3. Exit")
  console.log("4. Password Checker")

  let userInput = readlineSync.question();

  switch(userInput) {
    case "1":
      console.log("Option 1")
      console.log("Enter file path to be read. ex: ./database.csv")
      let filePath = readlineSync.question();
      console.log("Enter file name to be created with output.")
      let hashedFile = readlineSync.question();
      fs.truncate(hashedFile, 0, function(){console.log('done')})
      readFromFile(filePath, hashedFile);
      break;
    case "2":
      console.log("Enter file path to be read. ex: ./database.csv")
      let displayPath = readlineSync.question();
      displayFile(displayPath);
      break;
    case "3":
      console.log("Exitting program!")
      break;
    case "4":
      console.log("PASSWORD CHECKER")
      passwordChecker();
      break;
    default:
      console.log("Invalid choice / input!")
      menu()
      break;
  }
}

menu()