const readline = require("readline");


  
  const commandLine = readline.createInterface({ 
    input: process.stdin, output: process.stdout 
  })
  
  /*
  commandLine.question('User name:', (name) => {
    askForMessage(name)
  })
*/

  module.exports = {commandLine}
