import { 
    FISH_MAX_POS,
    computeFishCurrentPosition,
    computeFishTimeToNextSwap
} from '../frontend/public/globals.js';

export default function Fish(speed, swappedDirectionCallback) {
    let lastSwapAt;
    let lastSwapPosition;
    let direction;

    let fishTimer;

    const start = () => {
        lastSwapAt = Date.now();
        lastSwapPosition = Math.floor(Math.random() * FISH_MAX_POS);
        direction = "down";
        swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
        directionSwapTimer();
    };

    const directionSwapTimer = () => {
        const timeToNextSwap = computeFishTimeToNextSwap(direction, lastSwapPosition, speed);

        fishTimer = setTimeout(() => {
           lastSwapAt = Date.now();
           lastSwapPosition = computeFishCurrentPosition(direction, lastSwapAt, lastSwapPosition, speed);
           direction = direction === "down" ? "up" : "down";
           swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
           directionSwapTimer();
        }, timeToNextSwap);
    };

    const finish = () => {
        if (fishTimer !== undefined) {
            clearTimeout(fishTimer);
            fishTimer = undefined;
        }
    };

    const getInfo = () => {
        return {
            direction, 
            lastSwapAt,
            lastSwapPosition
        }
    };

    return {
        start,
        finish,
        getInfo
    }
}