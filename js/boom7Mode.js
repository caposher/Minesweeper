'use strict';

// rise 7boom flag ----------------------------------------------
function boom7Mode(elCheckBox) {
  gGame.is7Boom = elCheckBox.checked;
  gGame.isManual = false;
  document.querySelector('.maunalMode input').checked = false;
  resetGame();
}

// set mines in 7 boom way ----------------------------------------------
function create7BoomMines() {
  var cellNum = 1;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (cellNum % 7 === 0) {
        setManualMine({ i, j });
      }
      cellNum++;
    }
  }
}
