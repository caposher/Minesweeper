'use strict';

//hendle safe click---------------------------------------------------------------------------------------
function safeClick() {
  if (gGame.isOn && gGame.safeLocation !== 0) {
    var location = getCoveredLocation();
    while (gBoard[location.i][location.j].isMine) {
      location = getCoveredLocation();
    }
    gGame.safeLocation--;
    document.querySelector(`.safe-num`).innerText = gGame.safeLocation;
    document.querySelector(`.cell${location.i}-${location.j}`).classList.add('safe-cell');
    setTimeout(hideSafe, SAFE_TIME, location);
  }
}

//hide hint cells---------------------------------------------------------------------------------------
function hideSafe(location) {
  document.querySelector(`.cell${location.i}-${location.j}`).classList.remove('safe-cell');
}
