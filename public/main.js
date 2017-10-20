let socket = io.connect('http://localhost:8080', { 'forceNew': true });

function sendName(e) {
  const username = document.getElementById('username').value;
  socket.emit('hello', username);
  return false;
}