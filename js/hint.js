'use strict';

//handle logic hor hint------------------------------------------------------------------------------
function hintClick(elImg) {
  if (gGame.isOn) {
    if (!elImg.classList.contains('used')) {
      elImg.classList.add('used');
      elImg.src = 'img/usedHint.png';
      var hintLocation = getHintLocation();
      gBoard[hintLocation.i][hintLocation.j].isHint = true;
      document.querySelector(`.cell${hintLocation.i}-${hintLocation.j}`).classList.add('hint-cell');
    }
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

//show hint cells---------------------------------------------------------------------------------------
function showHint(location) {
  var LastStatus = [];
  for (var i = location.i - 1; i <= location.i + 1; i++) {
    for (var j = location.j - 1; j <= location.j + 1; j++) {
      if (0 <= i && i < gLevel.size && 0 <= j && j < gLevel.size) {
        LastStatus.push(gBoard[i][j].isShown);
        gBoard[i][j].isShown = true;
        document.querySelector(`.cell${i}-${j}`).classList.add('show');
      }
    }
  }

  setTimeout(hideHint, HINT_TIME, location, LastStatus);
}

function hideHint(location, lastStatus) {
  for (var i = location.i - 1; i <= location.i + 1; i++) {
    for (var j = location.j - 1; j <= location.j + 1; j++) {
      if (0 <= i && i < gLevel.size && 0 <= j && j < gLevel.size) {
        gBoard[i][j].isShown = lastStatus.shift();
        document.querySelector(`.cell${i}-${j}`).classList.remove('show');
      }
    }
  }
  gBoard[location.i][location.j].isHint = false;
  document.querySelector(`.cell${location.i}-${location.j}`).classList.remove('hint-cell');
}
