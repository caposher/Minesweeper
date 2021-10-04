'use strict';
var gLevel = {
  size: 4,
  mines: 2,
};

var gGame = {
  isOn: false,
  lifes: 3,
  shownCount: 0,
  markedCount: 0,
  emptyCellAmount: gLevel.size ** 2 - gLevel.mines,
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

  if (elDifficalty) {
    var diffVals = elDifficalty.value.split('-');
    gLevel.size = +diffVals[0];
    gLevel.mines = +diffVals[1];
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
        if (currCell.minesAroundCount === 0 && !currCell.isMine) {
          recurseOpening(location);
        } else if (currCell.isMine) {
          removeLife(currCell);
        } else {
          gGame.shownCount++;
        }
        currCell.isShown = true;
        elCell.classList.add('show');
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
  } else if (gGame.markedCount === gLevel.mines && gGame.shownCount === gGame.emptyCellAmount) {
    //win
    endGame('win');
  }
}

//end the game--------------------------------------------------------------------------------------
function endGame(text) {
  console.log(text);
  gGame.isOn = false;

  clearInterval(gTimerInervalId);
  gTimerInervalId = null;
}

//open all empty cells, recursive-------------------------------------------------------------------
function recurseOpening(location) {
  var cell = document.querySelector(`.cell${location.i}-${location.j}`);
  cell.classList.add('show');
  gBoard[location.i][location.j].isShown = true;
  gGame.shownCount++;

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
    elCell.innerHTML = `<p>${FLAG}<p>`;
    gGame.markedCount++;
    bCell.isMarked = true;
  } else {
    elCell.innerHTML = ``;
    gGame.markedCount--;
    bCell.isMarked = false;
  }
}

//show cell----------------------------------------------------------------------------------------
function showCell(elCell, bCell) {
  //TODO fix
  bCell.isShown = true;
  gGame.shownCount++;
  elCell.classList.add('show');
}

//to all work when press on mine------------------------------------------------------------------
function removeLife(cell) {
  //TODO fix
  gGame.lifes--;
  gGame.shownCount--;
  gGame.markedCount++;
  cell.isMarked = true;
}

//timer --------------------------------------------------------------------------------------------
function timer() {
  gGame.secsPassed++;
  var txt = `${gGame.secsPassed}`.padStart(3, '0');
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = txt;
}
