let socket = io.connect('https://afternoon-springs-83827.herokuapp.com/', { 'forceNew': true });
let questions = [];
let questionNum = 0;
let score = 0;
let blockedAswers = false;

function sendName(e) {
  const username = document.getElementById('username').value;
  socket.emit('HELLO', username);
  return false;
}

function next() {
  blockedAswers = false;
  $('#result').hide();
  $('#third').show();
  var html = getQuestionHTML(questions[questionNum]);
  $('#third').html(html);
  $('#fourth').hide();
}

function answerQuestion(answer) {
  if(blockedAswers) return;
  socket.emit('ANSWER', {answer: answer.value, id: answer.id});
  questionNum++;
}

function getQuestionHTML(q) {
  let options = '';
  q.options.forEach((o) => {
    options += `<div class="option"><a onclick="answerQuestion({value: '${o}', id: ${q.id}})">${o}</a></div>`;
  });

  var html = `<div>
        <h3>${q.question}</h3>
        <p><strong>Categoría:</strong> ${q.subject}</p>
        ${options}
    `;

  return html;
}

socket.on('ANSWER_ACK', (data) => {
  $('#result').show();
  $('#fourth').show();
  blockedAswers = true;
  if(data.correct) {
    $('#result').html('<div class="result result--correct">Correcto!!</div>');
    score++;
    $('#score').html('<p><strong>Score: ' + score + ' / ' + questions.length + '</strong></p>');
  } else {
    $('#result').html('<div class="result result--incorrect">Incorrecto. Respuesta correcta: ' + data.answer + '</div>');
  }
  if(questionNum === questions.length) {
    $('#fourth').hide();
    //DISPLAY WAITING FOR OPONENT TO FINISH
  }
});

socket.on('HELLO_ACK', (data) => {
  $('#first').hide();
  $('#second').show();
});

socket.on('GAME_START', (data) => {
  questions = data.message;
  $('#second').hide();
  $('#score').show();
  $('#score').html('<p><strong>Score: ' + score + ' / ' + questions.length + '</strong></p>');
  next();
});

socket.on('GAME_OVER', (data) => {
  $('#third').hide();
  $('#result').hide();
  $('#winner').show();
  if(!data.winner) {
    $('#winner').html('<h2>Empate!</h2>');
  } else $('#winner').html('<h2>El ganador es: ' + data.winner + '</h2>');
});

$(document).ready(function(){
  $('#second').hide();
  $('#third').hide();
  $('#fourth').hide();
  $('#result').hide();
  $('#score').hide();
  $('#winner').hide();
});