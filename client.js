
const net = require('net');
const { exit } = require('process');
const readline = require('readline');
//var readlineSync = require('readline-sync');

var commandLine = readline.createInterface({
  input: process.stdin, 
  output: process.stdout
});

function ask(questionText) {
  return new Promise((resolve, reject) => {
    commandLine.question(questionText, (input) => resolve(input) );
  });
}


  async function createClient()
  {
    var myName = await ask('Enter Username \n', {
      defaultInput: `user+${Math.random()}`
    });

    //enterName(myName);
    myclient(myName);
  }
  



 async function myclient(name) {

  let username = name;

  let loop = true;

  var msg;

  let initalNameCheck = false;

  var client = net.createConnection({ port: 9898 }, () => {
    
   /* const sendGreeting = new Promise((resolve, reject) => {
      resolve(client.write(`Hello Server! \n`));
  });

    const notifyClientOnJoin = new Promise((resolve, reject) => {
    resolve(console.log(`User ${username} has joined the chat \n`))
    });
*/

  if(username && (initalNameCheck == false))
  {
    const initialUserName= new Promise((resolve, reject) => {
      resolve(client.write(username))
      initalNameCheck == true;
      setTimeout(() => {askForMessage(username)}, 500);
    })
    
    /*.then(setTimeout(() => {
      const sendGreeting = new Promise((resolve, reject) => {
        resolve(client.write(`Hello Server! \n`))
      })}, 1000)
    ).then(setTimeout(() => {
      const notifyClientOnJoin = new Promise((resolve, reject) => {
        resolve(console.log(`User ${username} has joined the chat \n`))
        })}, 1000)
    )
    */
  }



  /////////////////////////////INITAL MESSAGE
  /*
  var msg = commandLine.question('Enter Message:')
  client.write(`User ${username} Typed: ${msg}`)
  */
  let askForMessage = async(name) => {
    var msg = await ask(`${name} , Please Enter Message : \n`)
    if(msg == 'quit' || msg == 'stop') {endConnection();}
    else{
      console.log(`User ${name} Typed: ${msg} \n`)
      client.write(msg)
      setTimeout(() => {askForMessage(username)}, 500);
        }
    }


let endConnection = async() => {try {client.end();} catch(error) {console.log('ERROR: LOST CONNECTION'); }}

askForMessage(username);
 ///////////////////////////////////////////////////////////////   PROMPT USER 

});

client.on('data', (data) => {
  if(data.toString() == 'pineapple is disgusting')
  {endConnection();} 
  else{console.log(`${data.toString()} \n`)}
  //var server_msg = data.toString();
});

client.on('end', () => {
  console.log('Client has been disconnected');
});

 }

createClient(); //MAIN 
