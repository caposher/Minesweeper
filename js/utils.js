'use strict';

function printBoard(mat, selector) {
  var strHTML = '<table ><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell' + i + '-' + j;
      strHTML += `<td class="${className}"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
