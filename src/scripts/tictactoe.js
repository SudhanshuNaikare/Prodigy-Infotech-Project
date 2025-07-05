class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameStatus = document.querySelector('.game-status');
        this.cells = document.querySelectorAll('.cell');
        this.restartButton = document.getElementById('restart');
        this.gameActive = true;

        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.initialize();
    }

    initialize() {
        this.cells.forEach(cell => {
            cell.innerHTML = '<span></span>';
            cell.addEventListener('click', (e) => this.handleCellClick(e), { once: true });
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
        this.updateStatus();
    }

    handleCellClick(e) {
        const cell = e.target.closest('.cell');
        const span = cell.querySelector('span');
        const index = Array.from(this.cells).indexOf(cell);

        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }

        this.board[index] = this.currentPlayer;
        span.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.endGame(false);
        } else if (this.checkDraw()) {
            this.endGame(true);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            if (
                this.board[combination[0]] &&
                this.board[combination[0]] === this.board[combination[1]] &&
                this.board[combination[0]] === this.board[combination[2]]
            ) {
                combination.forEach(index => {
                    this.cells[index].classList.add('winning');
                });
                return true;
            }
            return false;
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    endGame(isDraw) {
        this.gameActive = false;
        if (isDraw) {
            this.gameStatus.textContent = "Game ended in a draw!";
        } else {
            this.gameStatus.textContent = `Player ${this.currentPlayer} wins!`;
        }
    }

    updateStatus() {
        this.gameStatus.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;

        this.cells.forEach(cell => {
            const span = cell.querySelector('span');
            span.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });

        this.cells.forEach(cell => {
            cell.removeEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('click', (e) => this.handleCellClick(e), { once: true });
        });

        this.updateStatus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new TicTacToe();
}); 