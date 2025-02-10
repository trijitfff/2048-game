
const gridContainer = document.getElementById('grid-container');
const restartButton = document.getElementById('restart-button');
const currentScoreElem = document.getElementById('current-score');
const highScoreElem = document.getElementById('high-score');

let board;
let currentScore = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let isGameOver = false;

const initGame = () => {
    board = Array(4).fill().map(() => Array(4).fill(0));
    currentScore = 0;
    isGameOver = false;
    addNewTile();
    addNewTile();
    renderBoard();
    updateScores();
};

const renderBoard = () => {
    gridContainer.innerHTML = '';
    board.forEach(row => {
        row.forEach(cell => {
            const gridCell = document.createElement('div');
            gridCell.classList.add('grid-cell');
            gridCell.textContent = cell !== 0 ? cell : '';
            gridCell.style.backgroundColor = getTileColor(cell);
            gridContainer.appendChild(gridCell);
        });
    });
};

const getTileColor = (value) => {
    const colors = {
        2: '#eee4da', 4: '#ece0c8', 8: '#f5b57f', 16: '#f79c42',
        32: '#f57c35', 64: '#f56a29', 128: '#f5a630', 256: '#f57c32',
        512: '#ff6e2e', 1024: '#ff5e3a', 2048: '#ff4f3b',
    };
    return colors[value] || '#ccc0b3';
};

const addNewTile = () => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) emptyCells.push([r, c]);
        }
    }
    if (emptyCells.length > 0) {
        const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
};

const moveLeft = () => {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        let newRow = board[r].filter(cell => cell !== 0);
        let mergedRow = [];
        for (let i = 0; i < newRow.length; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                currentScore += newRow[i];
                newRow[i + 1] = 0;
                mergedRow.push(newRow[i]);
                i++; // Skip next cell after merge
            } else {
                mergedRow.push(newRow[i]);
            }
        }
        while (mergedRow.length < 4) mergedRow.push(0);
        if (mergedRow.join() !== board[r].join()) moved = true;
        board[r] = mergedRow;
    }
    return moved;
};

const rotateBoard = () => {
    return board[0].map((_, colIdx) => board.map(row => row[colIdx]));
};

const moveRight = () => {
    board = board.map(row => row.reverse());
    const moved = moveLeft();
    board = board.map(row => row.reverse());
    return moved;
};

const moveUp = () => {
    board = rotateBoard();
    const moved = moveLeft();
    board = rotateBoard().map(row => row.reverse());
    return moved;
};

const moveDown = () => {
    board = rotateBoard();
    const moved = moveRight();
    board = rotateBoard().map(row => row.reverse());
    return moved;
};

const checkGameOver = () => {
    if (board.flat().includes(2048)) {
        alert("You win!");
        isGameOver = true;
    }
    if (board.flat().includes(0)) return false;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (r < 3 && board[r][c] === board[r + 1][c]) return false;
            if (c < 3 && board[r][c] === board[r][c + 1]) return false;
        }
    }
    return true;
};

const updateScores = () => {
    currentScoreElem.textContent = `Score: ${currentScore}`;
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);
    }
    highScoreElem.textContent = `High Score: ${highScore}`;
};

const handleKeyPress = (e) => {
    if (isGameOver) return;
    let moved = false;
    if (e.key === 'ArrowLeft') moved = moveLeft();
    if (e.key === 'ArrowRight') moved = moveRight();
    if (e.key === 'ArrowUp') moved = moveUp();
    if (e.key === 'ArrowDown') moved = moveDown();
    if (moved) {
        addNewTile();
        renderBoard();
        updateScores();
        if (checkGameOver()) {
            alert("Game Over!");
            isGameOver = true;
        }
    }
};

restartButton.addEventListener('click', initGame);
window.addEventListener('keydown', handleKeyPress);

initGame();
