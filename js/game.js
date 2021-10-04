'use strict';
var gLevel = {
  size: 4,
  mines: 3,
};

var gGame = {
  isOn: false,
  lifes: 3,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

var gBoard = null;

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';
const EMPTY_CELL_AMOUNT = gLevel.size ** 2 - gLevel.mines;

//initialize the game-------------------------
function init() {
  gBoard = generateBoard(gLevel.size);
  setMinesOnBoard(gLevel.mines);
  updateNeighborsCount();
  renderBoard(gBoard, '.board-container');
  // var a = document.querySelector('.cell0-0 .cover');
  // debugger;
  // a.classList.add('show');
}

//create model board--------------------------
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

//put mines on board--------------------------
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

//add neighbors count to every cell
function updateNeighborsCount() {
  for (var i = 0; i < gLevel.size; i++) {
    for (var j = 0; j < gLevel.size; j++) {
      gBoard[i][j].minesAroundCount = countNeighbors({ i, j }, gLevel.size);
    }
  }
}

//counting neighbors
function countNeighbors(location, matLen) {
  var neighborsCount = 0;
  // debugger;
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

//handle cell left click
function cellClick(ev, elCell, i, j) {
  //identify mouse button
  switch (ev.which) {
    case 1: {
      console.log('left click');
      //update model
      if (gBoard[i][j].isMine) {
        gGame.lifes--;
      } else {
        gGame.shownCount++;
      }
      //update DOM
      elCell.classList.add('show');
      break;
    }
    case 3: {
      console.log('right click');
      //update model
      if (gBoard[i][j].isMine) {
        gGame.markedCount++;
      }

      //update DOM
      elCell.innerHTML = `<p>${FLAG}<p>`;
      break;
    }
    default:
      console.log('unknown event click:', ev.which);
  }

  // debugger;
  checkEndGame();

  //check cell content
}

//handle cell right click
function cellRightClick(elCell, i, j) {
  console.log('right clicked');
}

//check if game end
function checkEndGame() {
  // debugger;
  if (gGame.lifes === 0) {
    //lose
    console.log('loss');
  } else if (gGame.markedCount === gLevel.mines && gGame.shownCount === EMPTY_CELL_AMOUNT) {
    //win
    console.log('win');
  }
}
