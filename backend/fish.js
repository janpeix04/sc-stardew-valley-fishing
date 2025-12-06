import { 
    computeFishCurrentPosition, 
    computeFishTimeToNextSwap, 
    FISH_MAX_POS 
} from "../frontend/public/globals.js";

export default function Fish(ws, speed, onDirectionSwap) {
    let lastSwapPosition;
    let lastSwapAt;
    let direction;

    let timer;

    const sendState = () => {
        ws.send(JSON.stringify({
            type: "fishInfo",
            data: { lastSwapPosition, lastSwapAt, direction, speed }
        }));
    };

    const swapDirection = () => {
        lastSwapPosition = computeFishCurrentPosition(
            direction,
            lastSwapAt,
            lastSwapPosition,
            speed
        );

        lastSwapAt = Date.now();
        direction = direction === "down" ? "up" : "down";

        sendState();
        onDirectionSwap(direction, lastSwapAt, lastSwapPosition);
    };

    const scheduleNextSwap = () => {
        const delay = computeFishTimeToNextSwap(direction, lastSwapPosition, speed);

        timer = setTimeout(() => {
            swapDirection();
            scheduleNextSwap();
        }, delay);
    };

    const start = () => {
        lastSwapPosition = Math.floor(Math.random() * FISH_MAX_POS);
        lastSwapAt = Date.now();
        direction = "down";

        sendState();
        onDirectionSwap(direction, lastSwapAt, lastSwapPosition);

        scheduleNextSwap();
    };

    const getInfo = () => ({
        direction,
        lastSwapAt,
        lastSwapPosition
    });

    const finish = () => {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
    };

    return {
        start,
        getInfo,
        finish
    };
}
