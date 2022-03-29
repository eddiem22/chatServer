const readline = require("readline");


  
  const commandLine = readline.createInterface({ 
    input: process.stdin, output: process.stdout 
  })
  
  module.exports = {commandLine}
