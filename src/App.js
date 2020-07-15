import React, { useState } from "react";
import GameBoard from "./GameBoard";

function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [width, setWidth] = useState(8);
    const [height, setHeight] = useState(8);
    const [numMines, setNumMines] = useState(10);

    const startEasyGame = () => {
        setWidth(8);
        setHeight(8);
        setNumMines(10);
        setIsPlaying(true);
    };

    const startMediumGame = () => {
        setWidth(16);
        setHeight(16);
        setNumMines(40);
        setIsPlaying(true);
    };

    const startHardGame = () => {
        setWidth(30);
        setHeight(16);
        setNumMines(99);
        setIsPlaying(true);
    };

    return (
        <div className="App">
            <GameBoard
                height={height}
                width={width}
                numMines={numMines}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                setIsWinner={setIsWinner}
            />
            {!isPlaying && isWinner && <h2>You Win!!!</h2>}
            {!isPlaying && (
                <div>
                    <button onClick={startEasyGame}>Easy</button>
                    <button onClick={startMediumGame}>Medium</button>
                    <button onClick={startHardGame}>Hard</button>
                </div>
            )}
        </div>
    );
}

export default App;
