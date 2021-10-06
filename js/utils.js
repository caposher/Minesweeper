'use strict';

function renderBoard(board, selector) {
  var strHTML = '<table class="board"><tbody>';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      //create cell
      var cell = board[i][j];

      var mineClass = '';
      var innerTxt = '';
      if (cell.isMine) {
        mineClass = 'mine';
        innerTxt = MINE;
      } else if (cell.minesAroundCount !== 0) {
        innerTxt += cell.minesAroundCount;
      }

      var className = `cell${i}-${j}`;
      strHTML += `<td class="${mineClass}" oncontextmenu="return false;">
      <div class="${className} 
      ${gGame.isManual && gIsMineSet ? 'cover-trans' : ''}
       cover" onMouseup="cellClick(event,this,{i:${i},j:${j}})" oncontextmenu="return false;"></div>`;
      strHTML += innerTxt;

      strHTML += `</td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(board, location, elTableCell) {
  var cell = board[location.i][location.j];
  var mineClass = '';
  var innerTxt = '';
  var strHTML = '';
  if (cell.isMine) {
    mineClass = 'mine';
    innerTxt = MINE;
  } else if (cell.minesAroundCount !== 0) {
    innerTxt += cell.minesAroundCount;
  }

  var className = `cell${location.i}-${location.j}`;
  strHTML += ` <div class="${className} 
  ${gGame.isManual ? 'cover-trans' : ''}
   cover" onMouseup="cellClick(event,this,{i:${location.i},j:${location.j}})" oncontextmenu="return false;"></div>`;
  strHTML += innerTxt;

  elTableCell.innerHTML = strHTML;
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
  var bestTime = +localStorage.getItem('score');
  var bestScore = bestTime ? bestTime : Infinity;

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

//clear DOM elements-----------------------------------------------------------------------
function clearDomElements() {
  var elHints = document.querySelectorAll('.hint-img');
  var elHearts = document.querySelectorAll('.heart');
  for (var i = 0; i < elHints.length; i++) {
    elHints[i].src = 'img/unusedHint.png';
    elHearts[i].src = 'img/heartActive.png';
    elHints[i].classList.remove('used');
    elHearts[i].classList.remove('inactive');
  }
}

//find covered cells ------------------------------------------------------------------------------
function getCoveredLocation() {
  var location = getRandomLocation(gLevel.size);
  var cell = gBoard[location.i][location.j];
  var boardSize = gLevel.size ** 2;

  for (var k = 0; k < boardSize && cell.isShown; k++) {
    location = getRandomLocation(gLevel.size);
    cell = gBoard[location.i][location.j];
  }
  return location;
}

//duplicate matrix----------------------------------------------------------------
function duplicateMat(mat) {
  var newBoard = [];
  for (var i = 0; i < mat.length; i++) {
    newBoard[i] = [];
    for (var j = 0; j < mat.length; j++) {
      newBoard[i][j] = { ...mat[i][j] };
    }
  }
  return newBoard;
}
