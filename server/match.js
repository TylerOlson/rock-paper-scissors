'use strict';
class Match {
  constructor(player1, player2, io) {
    this.io = io;
    this.players = [];
    this.players.push(player1);
    this.players.push(player2);
  }

  findPlayer(idToFind) {
    for (let i = 0; i < this.players.length; i++) {
      console.log('heres an id ' + this.players[i].id);
      if (this.players[i].id == idToFind) {
        return this.players[i];
      }
    }
  }

  setPlayerMove(id, move) {
    console.log('Id to find ' + id);
    if (this.findPlayer(id).move == '') {
      this.findPlayer(id).move = move;
    }

    if (this.checkBothPlayers()) {
      this.io.to(this.players[0].id).emit('bothPlayed', {
        'winner': this.findWinner(),
        'opponent': this.players[1],
      });
      this.io.to(this.players[1].id).emit('bothPlayed', {
        'winner': this.findWinner(),
        'opponent': this.players[0],
      });
      this.players[0].move = '';
      this.players[1].move = '';
      console.log('both played');
    }
  }

  findWinner() {
    if (this.players[0].move == this.players[1].move) {
      return 'draw';
    }
    if (this.players[0].move == 'rock' && this.players[1].move == 'paper') {
      return this.players[1];
    }
    if (this.players[0].move == 'paper' && this.players[1].move == 'rock') {
      return this.players[0];
    }

    if (this.players[0].move == 'rock' && this.players[1].move == 'scissors') {
      return this.players[0];
    }
    if (this.players[0].move == 'scissors' && this.players[1].move == 'rock') {
      return this.players[1];
    }

    if (this.players[0].move == 'paper' && this.players[1].move == 'scissors') {
      return this.players[1];
    }
    if (this.players[0].move == 'scissors' && this.players[1].move == 'paper') {
      return this.players[0];
    }
  }

  checkBothPlayers() {
    return (this.players[0].move != '') && (this.players[1].move != '');
  }
}

module.exports.Match = Match;
