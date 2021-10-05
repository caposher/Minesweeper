'use strict';
var gLevel = {
  size: 4,
  mines: 2,
  emptyCellAmount: 14,
};

var gGame = {
  isOn: false,
  lifes: 3,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

var gBoard = null;
var gTimerInervalId = null;

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';

//initialize the game--------------------------------------------------------------------------------
function init() {
  gBoard = generateBoard(gLevel.size);
  setMinesOnBoard(gLevel.mines);
  updateNeighborsCount();
  renderBoard(gBoard, '.board-container');
  gGame.isOn = true;
}

//reset the game--------------------------------------------------------------------------------
function resetGame(elDifficalty) {
  gBoard = null;
  gGame.isOn = false;
  gGame.lifes = 3;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  document.querySelector('.timer').innerText = '000';
  document.querySelector('.smiley').src = 'img/start.png';
  clearHintSymbols();

  if (elDifficalty) {
    var diffVals = elDifficalty.value.split('-');
    gLevel.size = +diffVals[0];
    gLevel.mines = +diffVals[1];
    gLevel.emptyCellAmount = gLevel.size ** 2 - gLevel.mines;
  }

  clearInterval(gTimerInervalId);
  gTimerInervalId = null;

  init();
}

//create model board--------------------------------------------------------------------------------
function generateBoard(boardSize) {
  var board = [];
  for (var i = 0; i < boardSize; i++) {
    board.push([]);
    for (var j = 0; j < boardSize; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        isHint: false,
      };
    }
  }
  return board;
}

//put mines on board--------------------------------------------------------------------------------
function setMinesOnBoard(mineAmount) {
  for (var i = 0; i < mineAmount; i++) {
    var randLoc = getRandomLocation(gLevel.size);
    while (gBoard[randLoc.i][randLoc.j].isMine) {
      //find empty location to put mine
      randLoc = getRandomLocation(gLevel.size);
    }
    gBoard[randLoc.i][randLoc.j].isMine = true;
  }
}

//add neighbors count to every cell-----------------------------------------------------------------
function updateNeighborsCount() {
  for (var i = 0; i < gLevel.size; i++) {
    for (var j = 0; j < gLevel.size; j++) {
      gBoard[i][j].minesAroundCount = countNeighbors({ i, j }, gLevel.size);
    }
  }
}

//counting neighbors--------------------------------------------------------------------------------
function countNeighbors(location, matLen) {
  var neighborsCount = 0;
  for (var i = location.i - 1; i <= location.i + 1; i++) {
    for (var j = location.j - 1; j <= location.j + 1; j++) {
      if (0 <= i && i < matLen && 0 <= j && j < matLen && gBoard[i][j].isMine) {
        //the location is valid and contain mine

        if (location.i !== i || location.j !== j) {
          //count only neighbors ignore the center location itself
          neighborsCount++;
        }
      }
    }
  }
  return neighborsCount;
}

//handle cell left click------------------------------------------------------------------------------
function cellClick(ev, elCell, location) {
  if (gGame.isOn && !gTimerInervalId) {
    gTimerInervalId = setInterval(timer, 1000);
  }
  if (gGame.isOn) {
    var currCell = gBoard[location.i][location.j];
    //identify mouse button
    switch (ev.which) {
      case 1: {
        if (!currCell.isMarked) {
          if (currCell.isHint) {
            console.log('yes');
          } else if (currCell.isMine) {
            removeLife();
            showCell(elCell, location);
          } else if (currCell.minesAroundCount === 0) {
            recurseOpening(location);
          } else {
            showCell(elCell, location);
          }
        }
        break;
      }
      case 3: {
        //right click
        toggleFlag(elCell, currCell);
        break;
      }
      default:
        console.log('unknown event click:', ev.which);
    }
    checkEndGame();
  }
}

//check if game end--------------------------------------------------------------------------------
function checkEndGame() {
  if (gGame.lifes === 0) {
    //lose
    endGame('loss');
  } else if (
    (gGame.markedCount === gLevel.mines && gGame.shownCount === gLevel.emptyCellAmount) ||
    gGame.shownCount + gGame.markedCount === gLevel.size ** 2
  ) {
    //win
    endGame('win');
  }
}

//end the game--------------------------------------------------------------------------------------
function endGame(stat) {
  document.querySelector('.smiley').src = `img/${stat}.png`;
  gGame.isOn = false;

  clearInterval(gTimerInervalId);
  gTimerInervalId = null;
}

//open all empty cells, recursive-------------------------------------------------------------------
function recurseOpening(location) {
  var cell = document.querySelector(`.cell${location.i}-${location.j}`);
  showCell(cell, location);

  //stop condition
  if (gBoard[location.i][location.j].minesAroundCount) {
    return;
  }

  for (var i = location.i - 1; i <= location.i + 1; i++) {
    for (var j = location.j - 1; j <= location.j + 1; j++) {
      if (0 <= i && i < gLevel.size && 0 <= j && j < gLevel.size && !gBoard[i][j].isShown) {
        if (location.i !== i || location.j !== j) {
          recurseOpening({ i, j });
        }
      }
    }
  }
}

//toggle flag on cell------------------------------------------------------------------------------
function toggleFlag(elCell, bCell) {
  if (!elCell.innerHTML) {
    if (bCell.isMine) {
      gGame.markedCount++;
    }
    elCell.innerHTML = `<p>${FLAG}<p>`;
    bCell.isMarked = true;
  } else {
    if (bCell.isMine) {
      gGame.markedCount--;
    }
    elCell.innerHTML = ``;
    bCell.isMarked = false;
  }
}

//show cell----------------------------------------------------------------------------------------
function showCell(elCell, location) {
  gBoard[location.i][location.j].isShown = true;
  gGame.shownCount++;
  elCell.classList.add('show');
}

//to all work when press on mine------------------------------------------------------------------
function removeLife() {
  gGame.lifes--;
  document.querySelector('.smiley').src = `img/${gGame.lifes}.png`;
}

//timer --------------------------------------------------------------------------------------------
function timer() {
  gGame.secsPassed++;
  var txt = `${gGame.secsPassed}`.padStart(3, '0');
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = txt;
}

//handle logic hor hint------------------------------------------------------------------------------
function hintClick(elImg) {
  if (!elImg.classList.contains('used')) {
    elImg.classList.add('used');
    elImg.src = 'img/usedHint.png';
    var hintLocation = getHintLocation();
    gBoard[hintLocation.i][hintLocation.j].isHint = true;
    document.querySelector(`.cell${hintLocation.i}-${hintLocation.j}`).classList.add('hint-cell');
  }
}

//find cell contain mine------------------------------------------------------------------------------
function getHintLocation() {
  var location = getRandomLocation(gLevel.size);
  var cell = gBoard[location.i][location.j];
  var boardSize = gLevel.size ** 2;

  for (var k = 0; k < boardSize && cell.isShown; k++) {
    location = getRandomLocation(gLevel.size);
    cell = gBoard[location.i][location.j];
  }
  return location;
}

//clear hints imgs-------------------------------------------------------------------------------------
function clearHintSymbols() {
  var elHints = document.querySelectorAll('.hint-img');
  for (var i = 0; i < elHints.length; i++) {
    elHints[i].src = 'img/unusedHint.png';
    elHints[i].classList.remove('used');
  }
}

//show hint cells---------------------------------------------------------------------------------------
