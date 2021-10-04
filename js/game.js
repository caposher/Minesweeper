'use strict';

var gLevel = {
  size: 12,
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
  printBoard(gBoard, '.board-container');
}

//create model board--------------------------
function generateBoard(boardSize) {
  var cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
  };

  var board = [];
  for (var i = 0; i < boardSize; i++) {
    board.push([]);
    for (var j = 0; j < boardSize; j++) {
      board[i][j] = cell;
    }
  }
  return board;
}
