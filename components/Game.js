import React, { Component } from 'react';
import GameBoard from './GameBoard';
import ScorePanel from './cat/StatusBars';
import GameController from '../controllers/GameController';
import '../styles/Game.css';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            level: 1,
            isPlaying: false,
            gameOver: false
        };

        this.gameController = new GameController();
    }

    componentDidMount() {
        this.gameController.initialize(this.updateGameState);
    }

    componentWillUnmount() {
        this.gameController.cleanup();
    }

    updateGameState = (newState) => {
        this.setState(newState);
    }

    startGame = () => {
        this.setState({ isPlaying: true, gameOver: false });
        this.gameController.startGame();
    }

    pauseGame = () => {
        this.setState({ isPlaying: false });
        this.gameController.pauseGame();
    }

    resetGame = () => {
        this.setState({
            score: 0,
            level: 1,
            isPlaying: false,
            gameOver: false
        });
        this.gameController.resetGame();
    }

    render() {
        const { score, level, isPlaying, gameOver } = this.state;

        return (
            <div className="game-container">
                <ScorePanel
                    score={score}
                    level={level}
                />

                <GameBoard
                    gameController={this.gameController}
                    isPlaying={isPlaying}
                    gameOver={gameOver}
                />

                <div className="game-controls">
                    {!isPlaying && !gameOver && (
                        <button onClick={this.startGame}>Start Game</button>
                    )}
                    {isPlaying && (
                        <button onClick={this.pauseGame}>Pause Game</button>
                    )}
                    {(gameOver || isPlaying) && (
                        <button onClick={this.resetGame}>Reset Game</button>
                    )}
                </div>
            </div>
        );
    }
}

export default Game;