// src/services/game/GameController.js
import GameState from '../../models/GameState';
import { generateBoard, calculateScore } from '../../utils/GameUtils';

class GameController {
    constructor() {
        this.gameState = new GameState();
        this.boardUpdater = null;
        this.gameStateUpdater = null;
        this.gameLoopInterval = null;
    }

    initialize(gameStateUpdater) {
        this.gameStateUpdater = gameStateUpdater;
        this.resetGame();
    }

    registerBoardUpdater(boardUpdater) {
        this.boardUpdater = boardUpdater;
        this.updateBoard();
    }

    unregisterBoardUpdater() {
        this.boardUpdater = null;
    }

    startGame() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }

        this.gameLoopInterval = setInterval(() => {
            this.gameLoop();
        }, 1000 / this.gameState.getSpeed());
    }

    pauseGame() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    resetGame() {
        this.pauseGame();

        const initialBoard = generateBoard(this.gameState.getBoardSize());
        this.gameState.reset(initialBoard);

        this.updateBoard();
        this.updateGameState();
    }

    gameLoop() {
        if (this.gameState.isGameOver()) {
            this.endGame();
            return;
        }

        this.gameState.update();
        this.updateBoard();
        this.updateGameState();
    }

    endGame() {
        this.pauseGame();
        this.gameStateUpdater({ gameOver: true, isPlaying: false });
    }

    handleTileClick(position) {
        const result = this.gameState.processTileClick(position);

        if (result.scoreChange) {
            this.updateGameState();
        }

        this.updateBoard();
    }

    updateBoard() {
        if (this.boardUpdater) {
            this.boardUpdater(this.gameState.getBoard());
        }
    }

    updateGameState() {
        if (this.gameStateUpdater) {
            this.gameStateUpdater({
                score: this.gameState.getScore(),
                level: this.gameState.getLevel()
            });
        }
    }

    cleanup() {
        this.pauseGame();
    }
}

export default GameController;