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

function addRowsToTable(table, boardData) {
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

function drawBoardTable(table, data) {
  table.innerHTML = '';
  addRowsToTable(table, data);
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

function getRowCol(element) {
  const col = +element.getAttribute('data-col');
  const row = +element.getAttribute('data-row');

  return {
    col,
    row,
  };
}

function main() {
  let boardData = createBoard(10, 10);
  const boardTable = document.getElementById("board-table");
  const rowsElement = document.getElementById("rows");
  const columnsElement = document.getElementById("columns");
  let isDrawing = false;
  let alive = 0;

  const chageStatus = (row, col) => boardData[row][col] = !boardData[row][col];
  
  drawBoardTable(boardTable, boardData);
  
  function drawCell(event) {
    const {target} = event;

    if(isDrawing && target.nodeName === 'TD'){
      const { col, row } = getRowCol(target);

      chageStatus(row, col);
      target.classList.toggle('alive');
    }
  }

  function resetBoard(event){

    if(intervalPlayId) {
      clearInterval(intervalPlayId);
      intervalPlayId = null;
    }

    const rows = rowsElement.value == 0 ? 10: rowsElement.value;
    const columns = columnsElement.value == 0 ? 10:rowsElement.value ;

    boardData = createBoard(rows, columns);
    drawBoardTable(boardTable, boardData);
}

  document.onselectstart = () => false;
  // Enable and disable painting mode.
  document.addEventListener('mousedown', () => {
    intervalPlayId == null ? isDrawing = true: isDrawing = false;
    return false;
  }, true);
  document.onmouseup = () => isDrawing = false;

  boardTable.onmouseover = drawCell;
  boardTable.onmousedown = drawCell;

  document.getElementById("submit").addEventListener("click", function(event){
    event.preventDefault();

    const rows = rowsElement.value;
    const columns = columnsElement.value;

    boardData = createBoard(rows, columns);
    drawBoardTable(boardTable, boardData);
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

            if(boardData[i][j]){
              alive += 1;
            }

          } 
        }
        boardData = newBoardData;
        drawBoardTable(boardTable, boardData);
        
        if(alive === 0){
          alert("Game finish");
          resetBoard();
        }else{
          alive = 0;
        }
      }, 500)
        
  });
  
  document.getElementById('stop').addEventListener('click', () => {
    if (intervalPlayId) {
      clearInterval(intervalPlayId);
      intervalPlayId = null;
    }

  }, false); 

  document.getElementById('clear').addEventListener('click', resetBoard, false);
}

document.addEventListener('load', main, true);