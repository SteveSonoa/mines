import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Tile.css";

export const Tile = ({
    hPos,
    wPos,
    isFlagged,
    isGameOver,
    isMined,
    isVisible,
    numNeighbors,
    onClick,
    onContextMenu,
}) => {
    return (
        <div
            className={`tile ${isVisible ? "clicked" : "unclicked"} ${
                isVisible && isMined ? "bomb" : ""
            }`}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {isVisible
                ? isMined
                    ? "*"
                    : numNeighbors === 0
                    ? ""
                    : numNeighbors
                : isFlagged
                ? "?"
                : ""}
        </div>
    );
};

Tile.propTypes = {
    hPos: PropTypes.number.isRequired,
    wPos: PropTypes.number.isRequired,
    isFlagged: PropTypes.bool,
    isGameOver: PropTypes.bool,
    isMined: PropTypes.bool,
    isVisible: PropTypes.bool,
    numNeighbors: PropTypes.number,
    onClick: PropTypes.func.isRequired,
};

Tile.defaultProps = {
    isFlagged: false,
    isGameOver: false,
    isMined: false,
    isVisible: false,
    numNeighbors: 0,
};

export default Tile;
