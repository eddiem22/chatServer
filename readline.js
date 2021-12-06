const readline = require("readline");


let askForMessage = (name) => {
    commandLine.question('Message:', (message) => {
      // TODO: send name + ":" + message 
      askForMessage(name)
    })
  }
  
  const commandLine = readline.createInterface({ 
    input: process.stdin, output: process.stdout 
  })
  
  /*
  commandLine.question('User name:', (name) => {
    askForMessage(name)
  })
*/

  module.exports = {
      askForMessage,
      commandLine
  }