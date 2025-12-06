import { 
    computeFishCurrentPosition, 
    computeFishTimeToNextSwap, 
    FISH_MAX_POS 
} from "../frontend/public/globals.js";

export default function Fish(ws, speed, swappedDirectionCallback) {
    let lastSwapPosition;
    let lastSwapAt;
    let direction;

    let fishTimer;

    const _sendToWs = (lastSwapPosition, lastSwapAt, direction, speed) => {
        ws.send(JSON.stringify({'type' : 'fishInfo', 'data' : {lastSwapPosition, lastSwapAt, direction, speed}}));
    }

    const start = () => {
        lastSwapPosition = Math.floor(Math.random() * FISH_MAX_POS);
        lastSwapAt = Date.now();
        direction = "down";
        _sendToWs(lastSwapPosition, lastSwapAt, direction, speed);
        swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
        directionSwapTimer();
    }

    const directionSwapTimer = () => {
        const timeToNextSwap = computeFishTimeToNextSwap(direction, lastSwapPosition, speed);

        fishTimer = setTimeout(() => {
            lastSwapPosition = computeFishCurrentPosition(direction, lastSwapAt, lastSwapPosition, speed);
            lastSwapAt = Date.now();
            (direction === "down") ? direction = "up" : direction = "down";
            _sendToWs(lastSwapPosition, lastSwapAt, direction, speed);
            swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
            directionSwapTimer();
        }, timeToNextSwap);
    }

    const getInfo = () => {
        return {
            direction,
            lastSwapAt,
            lastSwapPosition
        }
    }

    const finish = () => {
        if (fishTimer !== undefined) {
            clearTimeout(fishTimer);
            fishTimer = undefined;
        }
    }

    return {
        start, 
        getInfo,
        finish
    }
}