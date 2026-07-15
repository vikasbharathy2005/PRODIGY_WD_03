const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const pvpBtn = document.getElementById('pvpBtn');
const pvaBtn = document.getElementById('pvaBtn');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isAI = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    if (!gameActive || gameState[index] !== '') return;
    if (isAI && currentPlayer === 'O') return;

    makeMove(index, cell);
}

function makeMove(index, cell) {
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    const winner = checkWinner();
    if (winner) {
        highlightWinningCells(winner);
        status.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        status.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;

    if (isAI && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 400);
    }
}

function checkWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return condition;
        }
    }
    return null;
}

function highlightWinningCells(winningCombo) {
    for (const index of winningCombo) {
        cells[index].classList.add('win');
    }
    for (const cell of cells) {
        cell.classList.add('disabled');
    }
}

function aiMove() {
    if (!gameActive || currentPlayer !== 'O') return;

    const best = getBestMove();
    if (best !== -1) {
        makeMove(best, cells[best]);
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] !== '') continue;
        gameState[i] = 'O';
        let score = minimax(gameState, 0, false);
        gameState[i] = '';
        if (score > bestScore) {
            bestScore = score;
            bestMove = i;
        }
    }
    return bestMove;
}

function minimax(boardState, depth, isMaximizing) {
    const result = evaluate(boardState);
    if (result !== null) return result;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] !== '') continue;
            boardState[i] = 'O';
            let score = minimax(boardState, depth + 1, false);
            boardState[i] = '';
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] !== '') continue;
            boardState[i] = 'X';
            let score = minimax(boardState, depth + 1, true);
            boardState[i] = '';
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

function evaluate(boardState) {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            if (boardState[a] === 'O') return 10;
            if (boardState[a] === 'X') return -10;
        }
    }
    if (!boardState.includes('')) return 0;
    return null;
}

function setMode(aiMode) {
    isAI = aiMode;
    pvpBtn.classList.toggle('active', !aiMode);
    pvaBtn.classList.toggle('active', aiMode);
    resetGame();

    if (isAI && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 400);
    }
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    status.textContent = "Player X's turn";

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win', 'disabled');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
pvpBtn.addEventListener('click', () => setMode(false));
pvaBtn.addEventListener('click', () => setMode(true));