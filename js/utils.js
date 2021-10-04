'use strict';

function renderBoard(mat, selector) {
  var strHTML = '<table ><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var isMine = mat[i][j].isMine;
      var className = 'cell' + i + '-' + j;
      strHTML += `<td class="${className}">${isMine ? MINE : EMPTY}</td>`;
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
