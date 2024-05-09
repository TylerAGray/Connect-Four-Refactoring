/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// Player class representing a player with a color
class Player {
  constructor(color) {
    this.color = color;
  }
}

// Game class representing the Connect Four game
class Game {
  constructor(p1, p2, height = 6, width = 7) {
    // Initialize players, board dimensions, current player, and game state
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.gameOver = false;
    // Create the game board and HTML representation
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops.  */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // Store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
    
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
    
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
    // Remove the event listener to prevent further moves
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // Prevent further moves if game is over
    if (this.gameOver) return;

    // Get x from ID of clicked cell
    const x = +evt.target.id;

    // Get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) return;

    // Place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // Check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver = true;
      return this.endGame('Tie!');
    }

    // Check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currPlayer.color} player won!`);
    }

    // Switch players
    this.currPlayer = (this.currPlayer === this.players[0]) ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    // Helper function to check if all cells in an array are the same player's color
    const _win = cells =>
      cells.every(([y, x]) =>
        y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Get "check list" of 4 cells (starting here) for each of the different ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // Find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

// Event listener for the "Start Game" button to initialize the game
document.getElementById('start-game').addEventListener('click', () => {
  // Create Player instances with colors from input fields
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  // Initialize the game with player instances
  new Game(p1, p2);
});

