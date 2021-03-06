const net = require('net');
const readline = require('readline');
//var readLineSync = require('readline-sync');

var commandLine = readline.createInterface({
  input: process.stdin, 
  output: process.stdout
});

function ask(questionText) {
  return new Promise((resolve, reject) => {
    commandLine.question(questionText, (input) => resolve(input) );
  });
}

var clients = [];
//var clientIDS = [];
var tempIndex = 0;
let forwarding = true;
let loop = true;


net.createServer(async function (socket) {
   
  socket.on('data', function (data) {
    if(!(clients.includes(socket)))
    {
      socket.name = data.toString()
      clients.push(socket);
      tempIndex = clients.indexOf(socket)
      clients[tempIndex].index = tempIndex
      broadcast("Welcome " + socket.name + "\n")
      broadcast(socket.name + " joined the chat \n")
      //console.log(clients)
    }
    else{
        clients[socket.index].history += `${data.toString()}  \n`
        if(forwarding == true)
        {
          //clients.forEach(function (client) {
          //client.write(`${socket.name}: ${data.toString()}`);
          broadcast(`${socket.name} typed: ${data.toString()}  \n`)
        }
      
        //console.log(clients)
        setTimeout(() =>{ serverPrompt() }, 500)
        }
  });

 //console.log(clients);

  async function sendToOne() {
    var userID = await ask('Enter User ID \n')
    if(userID)
    {
      var check = clients.find(socket => socket.name==userID);
      if(check)
      {
        var userIndex = clients.indexOf(clients.find(socket => socket.name==userID))
        var specificMSG = await ask(`Type MSG to User(${userID}) \n`)
        clients[userIndex].write(`SERVER: ${specificMSG} \n`)
        setTimeout(() =>{ serverPrompt() }, 500)
    }
    }
    else{
      var escape = await ask('Incorrect UserID. Try Again? \n Y for yes, N for no \n')
      if(escape == 'Y') {sendToOne();}
      else if(escape == 'N') {setTimeout(() =>{ serverPrompt() }, 500)}
    }
  }
  let blockSomeUser = async() => {
    let blockedUser = await ask(`Enter Name of Client To Block \n`)
    let indexToBeBlocked = clients.indexOf(clients.find(socket => socket.name==blockedUser))
    if(clients[indexToBeBlocked]!=-1) 
    {
      clients[indexToBeBlocked].write('pineapple is disgusting');
     clients[indexToBeBlocked].destroy();
     broadcast(`User ${blockedUser} has been removed from the chat \n`);
    let blockedChoice = await ask(`Remove User ${blockedUser} from chat log? \n Press Y for Yes, or N for No \n`);
    if(blockedChoice == 'Y') {clients.splice(clients[indexToBeBlocked], 1); console.log(`User has been REDACTED \n`); return true;}
    else{return true;}
    }
    else{return false;}
  }

  
  

  function broadcast(message, sender) {
    clients.forEach(function (client) {

      if (client === sender) return;
      client.write(message);
    });

    console.log(message);
  }

  let serverPrompt= async() => {
    var msg = await ask(`Please Choose An Option: \n 1. Check Messages \n  2. sendToUser \n  3. sendToAll \n 4. Show Client Lists \n 5. Show Chat History \n 6. Block User From Chat \n`)

    switch(msg){
      case '1':
        //loop = false;
      //break;
      setTimeout(() =>{ serverPrompt() }, 500)
      break;
      
        
      case '2':
        sendToOne();
        break;
      
      case '3':
        let globalMSG = await ask('Enter Message to All Users \n')
        clients.forEach(function (client) {
          // Don't want to send it to sender
          client.write(`SERVER: ${globalMSG} \n` );
        })
        //break;
        setTimeout(() =>{ serverPrompt() }, 500)
        break;

      case '4':
        clients.forEach(function(client) {
        console.log(client.name);
        })
        //break;
        setTimeout(() =>{ serverPrompt() }, 500)
        break;
        
        
        case '5':
          let chatHistory = await ask(`Check History of One User or All Users? \n`)
          if(chatHistory == 'all')
          {
            clients.forEach(function(client)
            {
           if(typeof(client.history)=="string")
           {console.log(`${client.name}: \n ${client.history.slice(9)} \n`)}
           else{console.log(`${client.name} does not have chat history at the moment, try again later \n` )}
          })//foreach
          }//if chathistory

          else
          {
            if(clients.find(socket => socket.name==chatHistory))
            {
              let temp = clients.indexOf(clients.find(socket => socket.name==chatHistory));console.log(`${chatHistory}: \n ${clients[temp].history.slice(9)} \n`);setTimeout(() =>{ serverPrompt() }, 500); break;}
              else{console.log(`error, cannot find user ${chatHistory}`);}
            }
            setTimeout(() =>{ serverPrompt() }, 500)
             break;
      
           case '6':   
           let tryBlock = blockSomeUser();
            if(tryBlock) {setTimeout(() =>{ serverPrompt() }, 500); break;}
             else{let tryAgain = await ask(`Error, User does not exist. Try Again? Y or N \n`); 
             if(tryAgain=='Y'){blockSomeUser(); setTimeout(() =>{ serverPrompt() }, 500); break;} 
             else{setTimeout(() =>{ serverPrompt() }, 500); break;}}
             

             
          

      default:
        msg = await ask(`Do you Want to Send Message Back? Y for Yes, N for No: \n`)
        if(msg == 'Y') {socket.write(await ask('Send Message Back: \n')); setTimeout(() =>{ serverPrompt() }, 500); break;}
        else if(msg == 'N') {setTimeout(() =>{ serverPrompt() }, 500); break;}
        //break;
        setTimeout(() =>{ serverPrompt() }, 500)
        break;
      }
    }
    
  
  

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    //clients.splice(clients.indexOf(socket), 1);
    socket.destroy();
    broadcast(socket.name + " left the chat.\n")
  });
  
  

}).listen({port:1234, host:'0.0.0.0'});

console.log("Chat server running at port 9898\n");
