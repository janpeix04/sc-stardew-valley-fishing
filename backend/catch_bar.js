import { 
    CATCH_BAR_INITIAL_POSITION, 
    computeCatchBarCurrentPosition 
} from '../frontend/public/globals.js'

export default function CatchBar(ws, swappedDirectionCallback) {
    let lastSwapAt;
    let lastSwapPosition;
    let direction;

    const _sendToWs = (lastSwapPosition, lastSwapAt, direction) => {
        ws.send(JSON.stringify({'type' : 'catchBarInfo', 'data' : {lastSwapPosition, lastSwapAt, direction}}));
    }

    const start = () => {
        lastSwapAt = Date.now();
        lastSwapPosition = CATCH_BAR_INITIAL_POSITION;
        direction = "down";
        _sendToWs(lastSwapPosition, lastSwapAt, direction);
        swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
    }

    const updateDirection = newDirection => {
        if (newDirection !== direction) {
            lastSwapPosition = computeCatchBarCurrentPosition(direction, lastSwapAt, lastSwapPosition);
            lastSwapAt = Date.now();
            direction = newDirection;
            _sendToWs(lastSwapPosition, lastSwapAt, direction);
            swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
        }
    }

    const getInfo = () => {
        return {
            direction,
            lastSwapAt,
            lastSwapPosition
        }
    }

    return {
        start,
        updateDirection,
        getInfo
    }
}