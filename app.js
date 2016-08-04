// Given a knight on a chess board at position [0, 0]
// Write a function that will calculate the smallest amount of moves for the knight to get to position [x, y]

class ChessBoard {
  constructor(containerId, tilesPerVertex = 8) {
    this.board = document.querySelector(containerId);
    this.tilesPerVertex = tilesPerVertex;

    let boardSize = 90;

    this.squareDimension = `${(boardSize / this.tilesPerVertex)}vmin`;
    this.board.style.width = `${boardSize}vmin`;
    this.board.style.fontSize = this.squareDimension;
    this.plotBoard();
  }

  plotSquare(x, y) {
    const square = document.createElement('div');
    square.classList.add('square');
    // x and y are reversed because the divs are plotted in rows
    square.dataset.x = y;
    square.dataset.y = x;
    square.style.width = this.squareDimension;
    square.style.height = this.squareDimension;
    square.style.lineHeight = this.squareDimension;

    let odd = false;

    if (x % 2) {
      odd = !odd;
    }
    if (y % 2) {
      odd = !odd;
    }
    if (odd) {
      square.dataset.odd = true;
    } else {
      square.dataset.even = true;
    }

    this.board.appendChild(square);
  }


  plotBoard() {
    for (let x = 0; x < this.tilesPerVertex; x++) {
      for (let y = 0; y < this.tilesPerVertex; y++) {
        this.plotSquare(x, y);
      }
    }
  }
}

class Knight {

  constructor() {

    this.movement = {
      a: 2,
      b: 1
    };

    this.refererenceGrid = [
      [0, 3, 2, 3, 2],
      [3, 4, 1, 2, 3],
      [2, 1, 4, 3, 2],
      [3, 2, 3, 2, 3],
      [2, 3, 2, 3, 4]
    ];

  }

  calculateShortestRoute(coords, counter = 0) {
    let x = coords.x;
    let y = coords.y;
    let newCoords = null;

    if (x < this.refererenceGrid.length && y < this.refererenceGrid.length) {
      counter = counter + this.refererenceGrid[x][y];
      return counter;
    }

    if (x > y) {
      newCoords = {
        x: x >= this.movement.a ? x - this.movement.a : x + this.movement.a,
        y: y >= this.movement.b ? y - this.movement.b : y + this.movement.b
      }
    } else {
      newCoords = {
        x: x >= this.movement.b ? x - this.movement.b : x + this.movement.b,
        y: y >= this.movement.a ? y - this.movement.a : y + this.movement.a
      }
    }

    return this.calculateShortestRoute(newCoords, ++counter);
  }

}

class App {
  constructor() {
    this.board = new ChessBoard('#board', 36);

    this.knight = new Knight();

    document.querySelector('#board').addEventListener('click', this.onClick.bind(this));
    document.querySelector('#toggle-all').addEventListener('click', this.evaluateAllSquares.bind(this));
    document.querySelector('#toggle-odd').addEventListener('click', this.evaluateOddSquares.bind(this));
    document.querySelector('#toggle-even').addEventListener('click', this.evaluateEvenSquares.bind(this));

  }

  onClick(evt) {

    if (!evt.target.classList.contains('square')) {
      return;
    }

    const square = evt.target;

    this.evaluateSquare(square);
  }

  evaluateSquare(square) {

    if (square.dataset.count) {
      this.hideInfo(square);
    } else {
      this.showInfo(square);
    }

  }

  showInfo(square) {

    const coords = {
      x: square.dataset.x * 1,
      y: square.dataset.y * 1
    }

    const shortestRouteCount = this.knight.calculateShortestRoute(coords);

    square.dataset.count = shortestRouteCount;
    square.innerText = shortestRouteCount;
    square.style.backgroundColor = this.colorize(shortestRouteCount);
  }

  hideInfo(square) {
    square.dataset.count = '';
    square.innerText = '';
    square.style.backgroundColor = '';
  }

  colorize(stepSize) {
    const degrees = 360;
    const tilesPerVertex = this.board.tilesPerVertex;
    const stepRatio = .75;

    const hue = stepSize * degrees / tilesPerVertex / stepRatio;
    return `hsla(${hue}, 80%, 40%, .8)`;
  }

  evaluateSquares(selector) {
    let squares = Array.from(document.querySelectorAll(selector));

    squares.forEach(square => {
      this.evaluateSquare(square);
    });
  }

  evaluateAllSquares() {
    this.evaluateSquares('.square');
  }

  evaluateOddSquares() {
    this.evaluateSquares('.square[data-odd="true"]');
  }

  evaluateEvenSquares() {
    this.evaluateSquares('.square[data-even="true"]');
  }

}

var appInstance = new App();
