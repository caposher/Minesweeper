'use strict';

function renderBoard(board, selector) {
  var strHTML = '<table class="board"><tbody>';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      //create cell
      var className = `cell${i}-${j}`;
      strHTML += `<td oncontextmenu="return false;">
      <div class="${className} cover " onMouseup="cellClick(event,this,{i:${i},j:${j}})" oncontextmenu="return false;"></div>`;

      var cell = board[i][j];
      if (cell.isMine) {
        strHTML += MINE;
      } else if (cell.minesAroundCount !== 0) {
        strHTML += cell.minesAroundCount;
      }
      strHTML += `</td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

//generate random integer
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//generate random location in matrix
function getRandomLocation(length) {
  return { i: getRandomInt(0, length), j: getRandomInt(0, length) };
}

//save best time score --------------------------------------------------------------
function saveBestScore() {
  var gameTime = +document.querySelector('.timer').innerText;
  var bestScore = +localStorage.getItem('score');
  if (bestScore > gameTime) {
    localStorage.setItem('score', gameTime);
    renderBestScore();
  }
}

//render best time score --------------------------------------------------------------
function renderBestScore() {
  if (typeof Storage !== 'undefined') {
    var bestScore = localStorage.getItem('score');
    document.querySelector('.score').innerText = bestScore ? bestScore.padStart(3, '0') : '000';
  } else {
    console.log('cant store on local storage');
  }
}
