import { 
    CATCH_BAR_INITIAL_POSITION,
    computeCatchBarCurrentPosition
} from '../frontend/public/globals.js'

export default function CatchBar(swappedDirectionCallback) {
    let lastSwapAt;
    let lastSwapPosition:;
    let direction;

    const start = () => {
        lastSwapAt = Date.now();
        lastSwapPosition = CATCH_BAR_INITIAL_POSITION;
        direction = "down";
        swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
    };

    const updateDirection = (newDirection) => {
        if (newDirection === direction) return;

        lastSwapPosition = computeCatchBarCurrentPosition(direction, lastSwapAt, lastSwapPosition);
        lastSwapAt = Date.now();
        direction = newDirection;
        swappedDirectionCallback(direction, lastSwapAt, lastSwapPosition);
    };

    const getInfo = () => {
        return {
            direction,
            lastSwapAt,
            lastSwapPosition,
        }
    };

    return {
        start,
        updateDirection,
        getInfo,
    }

}