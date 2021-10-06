'use strict';

var gManualMinecount = 0;
var gIsMineSet = true;

// clean global variables ----------------------------------------------
function resetModes() {
  gManualMinecount = 0;
  gIsMineSet = true;
}

// rise manual flag ----------------------------------------------
function manualMode(elCheckBox) {
  gGame.isManual = elCheckBox.checked;
  gGame.is7Boom = false;
  document.querySelector('.boom7Mode input').checked = false;
  resetGame();
}

// remove transparency  ---------------------------------------------------
function removeTansparecy() {
  var elCells = document.querySelectorAll('.cover-trans');
  for (var i = 0; i < elCells.length; i++) {
    elCells[i].classList.remove('cover-trans');
  }
}

// add manual mine from user ----------------------------------------------
function setManualMine(location) {
  var cell = gBoard[location.i][location.j];
  if (!cell.isMine) {
    cell.isMine = true;
    var elTableCell = document.querySelector(`.board`).rows[location.i].cells[location.j];
    renderCell(gBoard, location, elTableCell);
    gManualMinecount++;
    if (gManualMinecount === gLevel.mines) {
      gIsMineSet = false;
      removeTansparecy();
    }
  }
}
