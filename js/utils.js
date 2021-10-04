'use strict';

function renderBoard(mat, selector) {
  var strHTML = '<table ><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var className = 'cell' + i + '-' + j;
      strHTML += `<td class="${className}"><div class="hidden"></div>`;
      var cell = mat[i][j];
      if (cell.isMine) {
        strHTML += MINE;
      } else if (cell.minesAroundCount !== 0) {
        strHTML += cell.minesAroundCount;
      }
      strHTML += `</td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

//generate random integer
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//generate random location in matrix
function getRandomLocation(length) {
  return { i: getRandomInt(0, length), j: getRandomInt(0, length) };
}
