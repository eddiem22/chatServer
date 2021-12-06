const net = require('net');
const readline = require('readline');
var readlineSync = require('readline-sync');


/*const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
*/

var clients = [];
//var clientIDS = [];
var tempIndex = 0;
let forwarding = true;
let loop = true;


net.createServer(function (socket) {
   
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

  function sendToOne() {
    var userID = readlineSync.question('Enter User ID \n')
    if(userID)
    {
      var check = clients.find(socket => socket.name==userID);
      if(check)
      {
        var userIndex = clients.indexOf(clients.find(socket => socket.name==userID))
        var specificMSG = readlineSync.question(`Type MSG to User(${userID}) \n`)
        clients[userIndex].write(`SERVER: ${specificMSG} \n`)
    }
    }
    else{
      var escape = readlineSync.question('Incorrect UserID. Try Again? \n Y for yes, N for no \n')
      if(escape == 'Y') {sendToOne();}
      else if(escape == 'N') {return}
    }
  }

  function broadcast(message, sender) {
    clients.forEach(function (client) {

      if (client === sender) return;
      client.write(message);
    });

    console.log(message);
  }

  let serverPrompt= () => {
    var msg = readlineSync.question(`Please Choose An Option: \n 1. Check Messages \n  2. sendToUser \n  3. sendToAll \n 4. Show Client Lists \n 5. Show Chat History \n 6. Block User From Chat \n`)

    switch(msg){
      case '1':
        //loop = false;
      //break;
      setTimeout(() =>{ serverPrompt() }, 500)
      break;
      
        
      case '2':
        sendToOne();
        //break;
        setTimeout(() =>{ serverPrompt() }, 500)
        break;
      
      case '3':
        let globalMSG = readlineSync.question('Enter Message to All Users \n')
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
        //console.log(clients)
        //process.stdout.write(`${client.name} \n`)
        })
        //break;
        setTimeout(() =>{ serverPrompt() }, 500)
        break;
        
        
        case '5':
          let chatHistory = readlineSync.question(`Check History of One User or All Users? \n`)
          if(chatHistory == 'all')
          {
            clients.forEach(function(client){
           // process.stdout.write(`${client.name}: \n ${client.history.slice(9)} \n`)
           if(typeof(client.history)=="string")
           {console.log(`${client.name}: \n ${client.history.slice(9)} \n`)}
           else{console.log(`${client.name} does not have chat history at the moment, try again later \n` )}
            })
            
          }
          else
          {
            if(clients.find(socket => socket.name==chatHistory))
            {
              let temp = clients.indexOf(clients.find(socket => socket.name==chatHistory))
              //process.stdout.write(`${chatHistory}: \n ${clients[temp].history.slice(9)} \n`)
              console.log(`${chatHistory}: \n ${clients[temp].history.slice(9)} \n`)
              
            }
              else
                  {
                    console.log(`error, cannot find user ${chatHistory}`) 
                    
                    
                  }
          }
          setTimeout(() =>{ serverPrompt() }, 500)
           break;
      
           case '6':
            let blockedUser = readlineSync.question(`Enter Name of Client To Block \n`)
            let indexToBeBlocked = clients.indexOf(clients.find(socket => socket.name==blockedUser))
            if(clients[indexToBeBlocked]) {clients[indexToBeBlocked].destroy()}
            else{console.log(`Error, User ${clients[indexToBeBlocked]} does not exist. \n`); setTimeout(() =>{ serverPrompt() }, 500); break;}
            broadcast(`User ${clients[indexToBeBlocked]} has been removed from the chat \n`)
            let blockedChoice = readlineSync.question(`Remove User ${clients[indexToBeBlocked]} from chat log?} \n Press Y for Yes, or N for No \n`)
            if(blockedChoice == 'Y') {splice(clients[indexToBeBlocked], 1); console.log(`User has been REDACTED \n`); setTimeout(() =>{ serverPrompt() }, 500); break;}
            else{setTimeout(() =>{ serverPrompt() }, 500); break;}
             
          

      default:
        msg = readlineSync.question(`Do you Want to Send Message Back? Y for Yes, N for No: \n`)
        if(msg == 'Y') {socket.write(readlineSync.question('Send Message Back: \n')); setTimeout(() =>{ serverPrompt() }, 500); break;}
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
    console.log(socket.name + " left the chat.\n")
  });
  
  

}).listen(9898);

console.log("Chat server running at port 9898\n");
