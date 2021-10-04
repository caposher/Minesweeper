'use strict';

const MINE = '💣';
const FALG = '🚩';
const EMPTY = ' ';

var gLevel = {
  size: 4,
  mines: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

var gBoard = null;

//initialize the game-------------------------
function init() {
  gBoard = generateBoard(gLevel.size);
  setMinesOnBoard(5);
  renderBoard(gBoard, '.board-container');
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

//put bombs on board--------------------------
function setMinesOnBoard(mineAmount) {
  for (var i = 0; i < mineAmount; i++) {
    var randLoc = getRandomLocation(gLevel.size);
    while (gBoard[randLoc.i][randLoc.j].isMine) {
      randLoc = getRandomLocation(gLevel.size);
    }
    gBoard[randLoc.i][randLoc.j].isMine = true;
    console.log(gBoard[randLoc.i][randLoc.j].isMine);
  }
}
