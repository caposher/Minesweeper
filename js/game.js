'use strict';

//TODO: try to reduce history memory by saving the diff and not the whole board and DOM
//TODO: try to reduce duplicate of renderCell and renderBoard. using similar code
//TODO: check how you can add neighbors work function for code generalization and avoid duplication
//TODO: move code segments to different files
//TODO: sound effects (?)
//TODO: choose better colors (?)

var gLevel = {
  size: 4,
  mines: 2,
  emptyCellAmount: 14,
};

var gGame = {
  isOn: false,
  isManual: false,
  is7Boom: false,
  lifes: 3,
  safeLocation: 3,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

var gTimerInervalId = null;
var gInProgressTmo = null;
var gBoard = null;
var gHistoryModel = [];
var gHistoryDOM = [];
var gHistoryGameParm = [];

const MINE = '💣';
const FLAG = '🏴';
const EMPTY = ' ';
const HINT_TIME = 1000;
const SAFE_TIME = 3000;

//initialize the game--------------------------------------------------------------------------------
function init() {
  gBoard = generateBoard(gLevel.size);
  renderBoard(gBoard, '.board-container');
  renderBestScore();
  gGame.isOn = true;
}

//reset the game--------------------------------------------------------------------------------
function resetGame(elDifficalty) {
  gBoard = null;
  gGame.isOn = false;
  gGame.lifes = 3;
  gGame.safeLocation = 3;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gHistoryModel = [];
  gHistoryDOM = [];
  gHistoryGameParm = [];

  document.querySelector('.timer').innerText = '000';
  document.querySelector('.smiley').src = 'img/start.png';
  clearDomElements();
  resetModes();

  if (elDifficalty) {
    //save difficalty parameters
    var diffVals = elDifficalty.value.split('-');
    gLevel.size = +diffVals[0];
    gLevel.mines = +diffVals[1];
    gLevel.emptyCellAmount = gLevel.size ** 2 - gLevel.mines;
  }

  clearInterval(gTimerInervalId);
  gTimerInervalId = null;
  clearTimeout(gInProgressTmo);
  gInProgressTmo = null;

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
function setMinesOnBoard(mineAmount, location) {
  for (var i = 0; i < mineAmount; i++) {
    var randLoc = getRandomLocation(gLevel.size);
    while (
      gBoard[randLoc.i][randLoc.j].isMine ||
      (location.i === randLoc.i && location.j === randLoc.j) ||
      randLoc.i === location.i + 1 ||
      randLoc.i === location.i - 1 ||
      randLoc.j === location.j + 1 ||
      randLoc.j === location.j - 1
    ) {
      //find empty location to put mine and first press land on empty block
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

//handle cell click------------------------------------------------------------------------------
function cellClick(ev, elCell, location) {
  if (gGame.isManual && gIsMineSet) {
    //manual mode
    setManualMine(location);
  } else {
    if (gGame.isOn && !gTimerInervalId) {
      //first time job
      if (gGame.is7Boom) {
        create7BoomMines();
      } else if (!gGame.isManual) {
        setMinesOnBoard(gLevel.mines, location);
      }
      updateNeighborsCount();
      renderBoard(gBoard, '.board-container');
      elCell = document.querySelector(`.${elCell.classList[0]}`); //refresh cell element
      gTimerInervalId = setInterval(timer, 1000);
    }

    if (gGame.isOn) {
      saveHistory();
      var currCell = gBoard[location.i][location.j];

      //identify mouse button
      switch (ev.which) {
        case 1: {
          //left click
          if (!currCell.isMarked) {
            if (currCell.isHint) {
              showHint(location);
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
  if (stat === 'win') saveBestScore();
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
  var elHearts = document.querySelectorAll('.heart');
  for (var i = elHearts.length - 1; i >= 0; i--) {
    if (!elHearts[i].classList.contains('inactive')) {
      elHearts[i].classList.add('inactive');
      elHearts[i].src = 'img/heartInactive.png';
      break;
    }
  }
}

//timer --------------------------------------------------------------------------------------------
function timer() {
  gGame.secsPassed++;
  var txt = `${gGame.secsPassed}`.padStart(3, '0');
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = txt;
}

// undo last change---------------------------------------------------------------------------------
function undoChange() {
  if (gHistoryModel.length) {
    gBoard = gHistoryModel.pop();
    document.querySelector('.history-container').innerHTML = gHistoryDOM.pop();
    gGame = gHistoryGameParm.pop();
    if (!gTimerInervalId) gTimerInervalId = setInterval(timer, 1000);
  }
}

// save board and DOM element to history array---------------------------------------------------------------------------------
function saveHistory() {
  gHistoryModel.push(duplicateMat(gBoard));
  gHistoryDOM.push(document.querySelector('.history-container').innerHTML);
  gHistoryGameParm.push({ ...gGame });
}
