import React, { useEffect, useState } from "react";
import Tile from "./Tile";
import "./GameBoard.css";

export const GameBoard = ({
    height,
    width,
    numMines,
    isPlaying,
    setIsPlaying,
    setIsWinner,
}) => {
    const [tiles, setTiles] = useState([]);
    const [isMinesPlaced, setIsMinesPlaced] = useState(false);
    const [isNumNeighborsCounted, setIsNumNeighborsCounted] = useState(false);

    // tiles[height][width]
    // [
    // 	[{}, {}, {}, {}],
    // 	[{}, {}, {}, {}],
    // 	[{}, {}, {}, {}],
    // 	[{}, {}, {}, {}]
    // ]

    const createTiles = () => {
        const newTiles = [];
        //height
        for (let i = 0; i < height; i++) {
            const row = [];
            // width
            for (let j = 0; j < width; j++) {
                row.push({
                    hPos: i,
                    wPos: j,
                    isFlagged: false,
                    isMined: false,
                    isVisible: false,
                    numNeighbors: 0,
                });
            }
            newTiles.push(row);
        }
        setTiles(newTiles);
    };

    const placeMines = () => {
        const tempTiles = JSON.parse(JSON.stringify(tiles));
        let i = 0;
        while (i < numMines) {
            const randomW = Math.floor(Math.random() * width);
            const randomH = Math.floor(Math.random() * height);
            if (!tempTiles[randomH][randomW].isMined) {
                tempTiles[randomH][randomW].isMined = true;
                i++;
            }
        }
        setIsMinesPlaced(true);
        setTiles(tempTiles);
    };

    const determineNumNeighbors = () => {
        const tempTiles = JSON.parse(JSON.stringify(tiles));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let numNeighbors = 0;
                if (!tempTiles[i][j].isMined) {
                    // above left, above center, above right
                    if (i > 0) {
                        // above left
                        if (j > 0 && tempTiles[i - 1][j - 1].isMined) {
                            numNeighbors++;
                        }
                        // above center
                        if (tempTiles[i - 1][j].isMined) {
                            numNeighbors++;
                        }
                        // above right
                        if (j < width - 1 && tempTiles[i - 1][j + 1].isMined) {
                            numNeighbors++;
                        }
                    }
                    // left, NO CENTER, right
                    if (j > 0 && tempTiles[i][j - 1].isMined) numNeighbors++;
                    if (j < width - 1 && tempTiles[i][j + 1].isMined)
                        numNeighbors++;
                    // below left, below center, below right
                    if (i < height - 1) {
                        // below left
                        if (j > 0 && tempTiles[i + 1][j - 1].isMined) {
                            numNeighbors++;
                        }
                        // below centre
                        if (tempTiles[i + 1][j].isMined) {
                            numNeighbors++;
                        }
                        if (j < width - 1 && tempTiles[i + 1][j + 1].isMined) {
                            numNeighbors++;
                        }
                    }
                }
                tempTiles[i][j].numNeighbors = numNeighbors;
            }
        }
        setIsNumNeighborsCounted(true);
        setTiles(tempTiles);
    };

    const isGameOver = (tempTiles) => {
        let numSpacesLeft = height * width - numMines;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tempTiles[i][j].isVisible) {
                    numSpacesLeft--;
                }
            }
        }
        if (numSpacesLeft === 0) {
            setIsWinner(true);
            gameOver(tempTiles);
        }
    };

    const gameOver = (tempTiles) => {
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                tempTiles[i][j].isVisible = true;
            }
        }
        setIsPlaying(false);
        setTiles(tempTiles);
    };

    const resetGame = async () => {
        await setIsMinesPlaced(false);
        await setIsNumNeighborsCounted(false);
        // await setIsPlaying(true);
        await setIsWinner(false);
        await setTiles([]);
        createTiles();
    };

    const revealAllSurroundingTiles = async (hPos, wPos, tempTiles) => {
        for (let i = -1; i < 2; i++) {
            if (hPos + i >= 0 && hPos + i < height) {
                // above left
                if (wPos > 0) {
                    if (
                        tempTiles[hPos + i][wPos - 1].numNeighbors === 0 &&
                        !tempTiles[hPos + i][wPos - 1].isVisible
                    ) {
                        tempTiles[hPos + i][wPos - 1].isVisible = true;
                        tempTiles = await revealAllSurroundingTiles(
                            hPos + i,
                            wPos - 1,
                            JSON.parse(JSON.stringify(tempTiles))
                        );
                    } else {
                        tempTiles[hPos + i][wPos - 1].isVisible = true;
                    }
                }
                // above center
                if (i !== 0) {
                    if (
                        tempTiles[hPos + i][wPos].numNeighbors === 0 &&
                        !tempTiles[hPos + i][wPos].isVisible
                    ) {
                        tempTiles[hPos + i][wPos].isVisible = true;
                        tempTiles = await revealAllSurroundingTiles(
                            hPos + i,
                            wPos,
                            JSON.parse(JSON.stringify(tempTiles))
                        );
                    } else {
                        tempTiles[hPos + i][wPos].isVisible = true;
                    }
                }
                // above right
                if (wPos < width - 1) {
                    if (
                        tempTiles[hPos + i][wPos + 1].numNeighbors === 0 &&
                        !tempTiles[hPos + i][wPos + 1].isVisible
                    ) {
                        tempTiles[hPos + i][wPos + 1].isVisible = true;
                        tempTiles = await revealAllSurroundingTiles(
                            hPos + i,
                            wPos + 1,
                            JSON.parse(JSON.stringify(tempTiles))
                        );
                    } else {
                        tempTiles[hPos + i][wPos + 1].isVisible = true;
                    }
                }
            }
        }
        return tempTiles;
    };

    const handleClickedTile = async (hPos, wPos) => {
        if (!tiles[hPos][wPos].isVisible && !tiles[hPos][wPos].isFlagged) {
            let tempTiles = JSON.parse(JSON.stringify(tiles));
            const tempTile = Object.assign({}, tiles[hPos][wPos]);
            tempTile.isVisible = true;

            tempTiles[hPos][wPos] = tempTile;
            setTiles(tempTiles);

            if (tempTile.isMined) {
                gameOver(tempTiles);
            } else if (tempTile.numNeighbors === 0) {
                tempTiles = await revealAllSurroundingTiles(
                    hPos,
                    wPos,
                    JSON.parse(JSON.stringify(tempTiles))
                );
                setTiles(tempTiles);
            }
            isGameOver(tempTiles);
        }
    };

    const handleRightClick = (event, hPos, wPos) => {
        event.preventDefault();
        if (!tiles[hPos][wPos].isVisible) {
            let tempTiles = JSON.parse(JSON.stringify(tiles));
            const tempTile = Object.assign({}, tiles[hPos][wPos]);

            tempTile.isFlagged = !tempTile.isFlagged;
            tempTiles[hPos][wPos] = tempTile;

            setTiles(tempTiles);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            resetGame();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (tiles.length && !isMinesPlaced) {
            placeMines();
        }
    }, [tiles.length]);

    useEffect(() => {
        if (isMinesPlaced && !isNumNeighborsCounted) {
            determineNumNeighbors();
        }
    }, [isMinesPlaced]);

    return (
        <div className="board">
            {tiles.map((row, i) => (
                <div
                    className="row"
                    key={`${i}-${row.filter((tile) => tile.isVisible).length}`}
                >
                    {row.map((tile, j) => (
                        <Tile
                            key={`${i}-${j}-${tile.isVisible ? "yes" : "no"}`}
                            {...tile}
                            onClick={() => handleClickedTile(i, j)}
                            onContextMenu={(e) => handleRightClick(e, i, j)}
                            isGameOver={isPlaying}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
