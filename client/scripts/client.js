'use strict';
const socket = io('http://localhost:3000');
let name = 'test';
let played = false;
let opponent;

function setMove(move) {
  if (name == '') {
    alert('You must set a name!');
  }
  if (!played) {
    socket.emit('setMove', move);
    console.log('Played move ' + move);
    played = true;
    disableInput();
  } else {
    console.log('You already played a move.');
  }
}

function join() {
  name = document.getElementById('nameInput').value;
  if (name == '') {
    alert('You must set a name!');
  } else {
    document.getElementById('nameInput').classList.add('hidden');
    document.getElementById('joinButton').classList.add('hidden');
    socket.emit('joinQueue', name);
  }
}

socket.on('updateQueue', function(queue) {
  console.log('Updated queue ' + queue);
  const table = document.getElementById('queueTable');
  table.innerHTML = '<tr><th>Name</th><th>ID</th></tr>';
  for (i = 0; i < queue.length; i++) {
    const row = table.insertRow(-1);
    const cell1 = row.insertCell(-1);
    const cell2 = row.insertCell(-1);
    cell1.innerHTML = queue[i].name;
    cell2.innerHTML = queue[i].id;
  }
});

socket.on('joinedMatch', function(opp) {
  opponent = opp;
  document.getElementById('opponent').innerHTML = 'Joined match with ' + opponent.name + ' (' + opponent.id + ')';

  hideQueue();
  showInput();
});

socket.on('bothPlayed', function(data) {
  enableInput();
  played = false;
  if (data.winner == 'draw') {
    document.getElementById('outcome').innerHTML = 'Draw!';
  } else if (data.winner.name == name) {
    document.getElementById('outcome').innerHTML = 'You won!';
  } else {
    document.getElementById('outcome').innerHTML = 'You lost!';
  }
  document.getElementById('opponentMove').innerHTML = 'Opponents move was ' + data.opponent.move;
});


socket.on('sendMessage', function(data) {
  console.log('got message ' + data.message + ' from ' + data.sender);
  chat = document.getElementById('chat');
  messages = chat.getElementsByTagName('li');
  chatMessage = document.createElement('li');
  chatMessage.setAttribute('data-sender', data.sender);

  if (messages.length > 0) {
    previousMessage = messages[messages.length-1];
    console.log(previousMessage.classList);

    if (previousMessage.getAttribute('data-sender') != data.sender) {
      if (previousMessage.classList.contains('chatMessageAlt')) {
        chatMessage.classList.add('chatMessage');
      } else {
        chatMessage.classList.add('chatMessageAlt');
      }
    } else {
      chatMessage.classList.add(previousMessage.classList[0]);
    }
  }
  chatMessage.innerHTML = data.sender + ': ' + data.message;
  chat.appendChild(chatMessage);
});

window.addEventListener('load', function() {
  hideInput();
  showQueue();

  document.getElementById('chatInput').addEventListener('keyup', function(event) {
    if (event.keyCode === 13) { // enter key
      event.preventDefault();
      socket.emit('sendMessage', {'message': chatInput.value, 'sender': name});
      chatInput.value = '';
    }
  });

  document.getElementById('joinButton').addEventListener(join());
  document.getElementById('rockButton').addEventListener('click', setMove('rock'));
  document.getElementById('paperButton').addEventListener('click', setMove('paper'));
  document.getElementById('scissorsButton').addEventListener('click', setMove('scissors'));
});

// DOM Presets

function showQueue() {
  document.getElementById('queueTable').classList.remove('hidden');
}

function hideQueue() {
  document.getElementById('queueTable').classList.add('hidden');
}

function showInput() {
  document.getElementById('rockButton').classList.remove('hidden');
  document.getElementById('paperButton').classList.remove('hidden');
  document.getElementById('scissorsButton').classList.remove('hidden');
}

function hideInput() {
  document.getElementById('rockButton').classList.add('hidden');
  document.getElementById('paperButton').classList.add('hidden');
  document.getElementById('scissorsButton').classList.add('hidden');
}

function enableInput() {
  document.getElementById('rockButton').disabled = false;
  document.getElementById('paperButton').disabled = false;
  document.getElementById('scissorsButton').disabled = false;
}

function disableInput() {
  document.getElementById('rockButton').disabled = true;
  document.getElementById('paperButton').disabled = true;
  document.getElementById('scissorsButton').disabled = true;
}
