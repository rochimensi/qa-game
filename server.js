var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

const questionsData = require('./questions.json');
const COUNT = process.env.Q;

var questions = [];
var rooms = [getNewRoom()];

setQuestionsSubjects();

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('TCP connection established');

  var room;

  socket.on('HELLO', (data) => {
    console.log("New connection: " + data);
    room = setPlayerOnRoom(data, socket);
    socket.join(room.room);
    socket.emit('HELLO_ACK', { message: 'Esperando oponente'});

    if(Object.keys(room.players).length < 2) return;
    startGame(room);
  });

  socket.on('ANSWER', (data) => {
    var answeredQuestion = questions[data.id];
    if(data.answer == answeredQuestion.answer) {
      room.players[socket.id].score += 1;
      console.log(room.players[socket.id].name + ' scores 1!');
      socket.emit('ANSWER_ACK', {message: 'Correct!', correct: true});
    } else socket.emit('ANSWER_ACK', {message: 'Incorrect', correct: false, answer: answeredQuestion.answer});

    room.players[socket.id].submitted += 1;
    checkGameOver(room);
  });
});

function checkGameOver(room) {
  var submittedPlayers = Object.keys(room.players);
  if(room.players[submittedPlayers[0]].submitted == COUNT && room.players[submittedPlayers[1]].submitted == COUNT) {
    var diff = room.players[submittedPlayers[0]].score - room.players[submittedPlayers[1]].score;
    if(diff > 1) {
      console.log(room.players[submittedPlayers[0]].name + ' WINS!');
      io.sockets.in(room.room).emit('GAME_OVER', { winner: room.players[submittedPlayers[0]].name});
    } else if(diff < 0) {
      console.log(room.players[submittedPlayers[1]].name + ' WINS!');
      io.sockets.in(room.room).emit('GAME_OVER', { winner: room.players[submittedPlayers[1]].name});
    } else {
      console.log('EVEN.');
      io.sockets.in(room.room).emit('GAME_OVER', { winner: ''});
    }
  }
}

function getNewPlayer(player, socket) {
  return { name: player, socket: socket, score: 0, submitted: 0 };
}

function getNewRoom() {
  return { players: {}, questions: {}, room: new Date().getTime()};
}

function startGame(room) {
  var sockets = Object.keys(room.players);
  setQuestionsForRoomPlayer(room, sockets[0]);
  setQuestionsForRoomPlayer(room, sockets[1]);

  room.players[sockets[0]].socket.emit('GAME_START', {message: room.questions[sockets[0]]});
  room.players[sockets[1]].socket.emit('GAME_START', {message: room.questions[sockets[1]]});
}

function setQuestionsForRoomPlayer(room, player) {
  var indexUsed = [];
  var index;
  room.questions[player] = [];
  for (var i = 0; i < COUNT; i++) {
    index = Math.floor(Math.random()*(questions.length));
    while(indexUsed.indexOf(index) > -1) {
      index = Math.floor(Math.random()*(questions.length));
    }
    var selected = _.clone(questions[index]);
    selected.id = index;
    delete selected["answer"];
    room.questions[player].push(selected);
  }
}

function setPlayerOnRoom(player, socket) {
  const last = rooms.length - 1;
  if(Object.keys(rooms[last].players).length < 2) {
    rooms[last].players[socket.id] = getNewPlayer(player, socket);
    return rooms[last];
  }

  var newRoom = getNewRoom();
  newRoom.players[socket.id] = getNewPlayer(player, socket);
  rooms.push(newRoom);
  return newRoom;
}

function setQuestionsSubjects() {
  Object.keys(questionsData).map((k) => {
    questionsData[k].forEach((q) => {
      q.subject = k;
    })
  });

  questions = _.flatten(_.values(questionsData));
}

server.listen(8080, () => {
  console.log("Servidor corriendo puerto 8080");
});