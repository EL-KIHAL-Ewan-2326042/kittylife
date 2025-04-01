// src/models/GameState.js
class GameState {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.speed = 1;
        this.isPlaying = false;
        this.gameOver = false;
        this.board = [];
        this.boardSize = { rows: 8, cols: 8 };
    }

    reset(initialBoard) {
        this.score = 0;
        this.level = 1;
        this.isPlaying = false;
        this.gameOver = false;
        this.board = initialBoard;
    }

    update() {
        // Update game logic here
        // For example, move elements down, check for matches, etc.
    }

    processTileClick(position) {
        // Process user interaction with tiles
        // Return score change if any
        return { scoreChange: 0 };
    }

    getBoard() {
        return this.board;
    }

    getScore() {
        return this.score;
    }

    getLevel() {
        return this.level;
    }

    getSpeed() {
        return this.speed + (this.level - 1) * 0.1;
    }

    getBoardSize() {
        return this.boardSize;
    }

    isGameOver() {
        return this.gameOver;
    }
}

export default GameState;