document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const grid = 30;
    const tetrisRow = 20;
    const tetrisCol = 10;
    const emptyColor = "#000000";

    // Definir los colores de los bloques
    const tetrisColors = [
        emptyColor,
        "#6A1B9A", // Púrpura oscuro
        "#F9A825", // Amarillo anaranjado
        "#0288D1", // Azul
        "#E65100", // Naranja
        "#4CAF50", // Verde
        "#D50000", // Rojo
        "#FFEB3B"  // Amarillo
    ];

    // Definir las piezas y sus posiciones iniciales
    const tetrisPieces = [
        [],
        [[1, 1, 1, 1]],                     // I
        [[1, 1, 1], [0, 1, 0]],             // T
        [[1, 1, 1], [1, 0, 0]],             // L
        [[1, 1, 1], [0, 0, 1]],             // J
        [[0, 1, 1], [1, 1, 0]],             // S
        [[1, 1], [1, 1]],                   // O
        [[0, 1, 0], [1, 1, 1]]              // Z
    ];

    let board = [];
    let currentPiece;
    let currentPieceColor;
    let currentPosition;
    let interval;
    let score = 0;

    function init() {
        // Inicializar el tablero vacío
        for (let r = 0; r < tetrisRow; r++) {
            board[r] = [];
            for (let c = 0; c < tetrisCol; c++) {
                board[r][c] = 0;
            }
        }

        // Definir el tamaño del canvas
        canvas.width = tetrisCol * grid;
        canvas.height = tetrisRow * grid;

        // Generar la primera pieza
        generatePiece();

        // Dibujar el juego
        drawGame();
    }

    function generatePiece() {
        const pieceType = Math.floor(Math.random() * tetrisPieces.length);
        currentPiece = tetrisPieces[pieceType];
        currentPieceColor = tetrisColors[pieceType + 1]; // Ignorar el primer color vacío
        currentPosition = { x: 3, y: 0 };
    }

    function drawPiece() {
        currentPiece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    drawSquare(currentPosition.x + x, currentPosition.y + y, currentPieceColor);
                }
            });
        });
    }

    function drawGame() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar el tablero
        for (let r = 0; r < tetrisRow; r++) {
            for (let c = 0; c < tetrisCol; c++) {
                drawSquare(c, r, tetrisColors[board[r][c]]);
            }
        }

        // Dibujar la pieza actual
        drawPiece();
    }

    function drawSquare(x, y, color) {
        context.fillStyle = color;
        context.fillRect(x * grid, y * grid, grid, grid);
        context.strokeStyle = "#333";
        context.strokeRect(x * grid, y * grid, grid, grid);
    }

    function moveDown() {
        currentPosition.y++;
        if (collide()) {
            currentPosition.y--;
            mergePiece();
            generatePiece();
            clearLines();
            if (gameOver()) {
                clearInterval(interval);
                alert(`¡Juego terminado! Puntuación final: ${score}`);
                location.reload(); // Recargar la página para reiniciar
            }
        }
        drawGame();
    }

    function moveRight() {
        currentPosition.x++;
        if (collide()) {
            currentPosition.x--;
        }
        drawGame();
    }

    function moveLeft() {
        currentPosition.x--;
        if (collide()) {
            currentPosition.x++;
        }
        drawGame();
    }

    function rotate() {
        const nextRotation = rotatePiece(currentPiece);
        if (canRotate(nextRotation)) {
            currentPiece = nextRotation;
        }
        drawGame();
    }

    function rotatePiece(piece) {
        const rotatedPiece = [];
        for (let y = 0; y < piece[0].length; y++) {
            rotatedPiece[y] = [];
            for (let x = 0; x < piece.length; x++) {
                rotatedPiece[y][x] = piece[x][piece[0].length - 1 - y];
            }
        }
        return rotatedPiece;
    }

    function canRotate(piece) {
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[0].length; x++) {
                if (piece[y][x] && (board[currentPosition.y + y] && board[currentPosition.y + y][currentPosition.x + x]) !== 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function collide() {
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[0].length; x++) {
                if (currentPiece[y][x] && (board[currentPosition.y + y] && board[currentPosition.y + y][currentPosition.x + x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function mergePiece() {
        currentPiece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    board[currentPosition.y + y][currentPosition.x + x] = currentPieceColor;
                }
            });
        });
    }

    function clearLines() {
        let rowCount = 0;
        for (let r = 0; r < tetrisRow; r++) {
            if (board[r].every(cell => cell !== 0)) {
                // Eliminar la línea
                board.splice(r, 1);
                // Añadir una nueva línea vacía en la parte superior
                board.unshift(Array(tetrisCol).fill(0));
                rowCount++;
            }
        }
        // Aumentar la puntuación
        score += rowCount * 100;
        document.getElementById('score').innerText = `Puntuación: ${score}`;
    }

    function gameOver() {
        return board[0].some(cell => cell !== 0);
    }

    function startGame() {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            moveDown();
        }, 500);
        document.addEventListener('keydown', control);
    }

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.getElementById('start-button').addEventListener('click', startGame);

    init();
});
