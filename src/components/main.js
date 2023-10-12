let intervalPlayId = null;

function createBoard(rows, columns) {
  const board = [];

  for (let i = 0; i < rows; ++i) {
    board.push([]);
    const id = board.length - 1;

    for (let j = 0; j < columns; ++j) {
      board[id].push(false);
    }
  }

  return board;
}

function createBoardTable(boardData) {
  const table =  document.createElement('table');
  table.setAttribute('class', 'table-board');

  for (let i = 0; i < boardData.length; ++i) {
    const row = document.createElement('tr');

    for (let j = 0; j < boardData[i].length; ++j) {
      const td = document.createElement('td');

      td.setAttribute('data-row', i);
      td.setAttribute('data-col', j);
      if (boardData[i][j]) {
        td.setAttribute('class', 'alive');
      }
      row.appendChild(td);
    }

    table.appendChild(row);
  }

  return table;
}

function drawBoardTable(boardContainer, data) {
  const table = createBoardTable(data);
  boardContainer.innerHTML = '';
  boardContainer.appendChild(table);
}

function countNeighbour(boardData, indexI, indexJ){
  let sum = 0;
  const startI = indexI - 1 >= 0 ? indexI - 1 : indexI;
  const endI = indexI + 1 < boardData.length ? indexI + 1 : indexI;
  
  for(let i = startI; i <= endI; i++ ){

    const startJ = indexJ - 1 >= 0 ? indexJ - 1 : indexJ;
    const endJ = indexJ + 1 < boardData[i].length ? indexJ + 1 : indexJ;

    for(let j = startJ; j <= endJ; j++){
      sum += boardData[i][j]; 
    }
  }

  sum -= boardData[indexI][indexJ];

  return sum;
}

function main() {
  let boardData = createBoard(3, 3);
  const boardElement = document.getElementById("board")
  const rowsElement = document.getElementById("rows");
  const columnsElement = document.getElementById("columns");

  document.addEventListener('click', e => {
    const { target } = e;
    e.stopPropagation();

    if (target.nodeName === 'TD') {
      const col = +target.getAttribute('data-col');
      const row = +target.getAttribute('data-row');
      boardData[row][col] = !boardData[row][col];

      drawBoardTable(boardElement, boardData);
    }
  }, false);

  
  document.getElementById("submit").addEventListener("click", function(event){
    event.preventDefault();

    const rows = rowsElement.value;
    const columns = columnsElement.value;

    boardData = createBoard(rows, columns);
    drawBoardTable(boardElement, boardData);
  })

  document.getElementById("start").addEventListener("click", async function(event){
    event.preventDefault();
    
    intervalPlayId = setInterval(() => {
      const newBoardData = createBoard(boardData.length, boardData[0].length);

      for(let i = 0; i < boardData.length; i++){
        for(let j = 0; j < boardData[i].length; j++){
          const neighbour = countNeighbour(boardData, i, j);
 
          if(boardData[i][j] && neighbour < 2) {
            newBoardData[i][j] = false;
          } else if(boardData[i][j] && neighbour > 3) {
            newBoardData[i][j] = false;
          } else if(!boardData[i][j] && neighbour == 3) {
            newBoardData[i][j] = true;
          } else {
            newBoardData[i][j] = boardData[i][j];
          }

        } 
      }

      boardData = newBoardData;
      drawBoardTable(boardElement, boardData);
    }, 500)
  });
  
  document.getElementById('stop').addEventListener('click', () => {
    if (intervalPlayId) {
      clearInterval(intervalPlayId);
    }
  }, false);
}

document.addEventListener('load', main, true);