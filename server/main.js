var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', function(socket) {
  console.log('Nueva conexion establecida');

  socket.on('hello', function(data) {
    console.log("Se conectó " + data);
  });
});

server.listen(8080, function() {
  console.log("Servidor corriendo en http://localhost:8080");
});