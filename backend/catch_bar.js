import { 
    CATCH_BAR_INITIAL_POSITION, 
    computeCatchBarCurrentPosition 
} from '../frontend/public/globals.js'

export default function CatchBar(ws, onDirectionSwap) {
    let lastSwapAt;
    let lastSwapPosition;
    let direction;

    const sendState = () => {
        ws.send(JSON.stringify({
            type: 'catchBarInfo',
            data: { lastSwapPosition, lastSwapAt, direction }
        }));
    };

    const swapDirection = newDirection => {
        direction = newDirection;
        lastSwapAt = Date.now();
        sendState();
        onDirectionSwap(direction, lastSwapAt, lastSwapPosition);
    };

    const start = () => {
        lastSwapPosition = CATCH_BAR_INITIAL_POSITION;
        lastSwapAt = Date.now();
        swapDirection("down");
    };

    const updateDirection = newDirection => {
        if (newDirection === direction) return;

        lastSwapPosition = computeCatchBarCurrentPosition(
            direction,
            lastSwapAt,
            lastSwapPosition
        );

        swapDirection(newDirection);
    };

    const getInfo = () => ({ direction, lastSwapAt, lastSwapPosition });

    return { start, updateDirection, getInfo };
}
