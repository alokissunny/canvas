// Setup basic express server
var express = require('express');
var app = express();
var fs = require('fs');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var loopLimit = 0;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
  fs.writeFile(__dirname + '/start.log', 'started'); 
});

// Routing
app.use(express.static(__dirname));
//app.use('/test',test);

// Entire gameCollection Object holds all games and info

var sessionCollection = new function(){
  this.sessionCount = 0,
  this.sessionList = []
};
var connections = [];
var connectionsMap = {};


var numUsers = 0;

io.on('connection', function (socket) {
  connections.push(socket);

  socket.on('mousemove', syncSameSession.bind(this));

  socket.on('new-session', function(data)
  {
    console.log(data.sid);
    createSession(data.sid,socket);
  });
socket.on('join-session', function(data)
  {
    if(sessionCollection.sessionList.indexOf(data.jid) === -1) {
   createSession(data.jid,socket);
  }
  });
 

});

function createSession(id, socket)
{
  sessionCollection.sessionCount++;
    sessionCollection.sessionList.push(id);
    connectionsMap[id] = socket;

}
function syncSameSession(data)
{
  connectionsMap[data.id] ? connectionsMap[data.id].emit('moving', data.data) : console.log("nothing");
}





