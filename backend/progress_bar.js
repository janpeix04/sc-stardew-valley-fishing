import { 
    catchBarAndFishTouch, 
    computeCatchBarCurrentPosition,
    computeFishCurrentPosition,
    computeProgressBarCurrentPosition,
    PROGRESS_BAR_INITIAL_POSITION,
    PROGRESS_BAR_TICK_FREQUENCY,
    timeForProgressBarToReachLimit
} from "../frontend/public/globals.js";

export default function ProgressBar(ws, fishSpeed, onFinish) {
    let lastSwapPosition;
    let lastSwapAt;
    let direction;
    let state;

    let timeoutT1;
    let intervalT2;

    let fishDirection, fishLastSwapAt, fishLastSwapPosition;
    let catchBarDirection, catchBarLastSwapAt, catchBarLastSwapPosition;

    const sendState = () => {
        ws.send(JSON.stringify({
            type: "progressBarInfo",
            data: { lastSwapPosition, lastSwapAt, direction, state }
        }));
    };

    const swapDirection = () => {
        lastSwapPosition = computeProgressBarCurrentPosition(
            direction,
            lastSwapAt,
            lastSwapPosition
        );

        lastSwapAt = Date.now();
        direction = direction === "down" ? "up" : "down";

        sendState();
    };

    const restartLimitTimer = () => {
        clearTimeout(timeoutT1);

        timeoutT1 = setTimeout(() => {
            state = direction === "up" ? "successful" : "failed";
            sendState();

            clearInterval(intervalT2);
            onFinish();
        }, timeForProgressBarToReachLimit(direction, lastSwapPosition));
    };

    const startIntervalT2 = () => {
        intervalT2 = setInterval(() => {
            const posCatchBar = computeCatchBarCurrentPosition(
                catchBarDirection,
                catchBarLastSwapAt,
                catchBarLastSwapPosition
            );

            const posFish = computeFishCurrentPosition(
                fishDirection,
                fishLastSwapAt,
                fishLastSwapPosition,
                fishSpeed
            );

            const touching = catchBarAndFishTouch(posFish, posCatchBar);

            const mustSwap =
                (direction === "down" && touching) ||
                (direction === "up" && !touching);

            if (mustSwap) {
                swapDirection();
                restartLimitTimer();
            }
        }, PROGRESS_BAR_TICK_FREQUENCY);
    };

    const start = () => {
        lastSwapPosition = PROGRESS_BAR_INITIAL_POSITION;
        lastSwapAt = Date.now();
        direction = "down";
        state = "in_progress";

        sendState();
        restartLimitTimer();
        startIntervalT2();
    };

    const fishSwappedDirection = (dir, at, pos) => {
        fishDirection = dir;
        fishLastSwapAt = at;
        fishLastSwapPosition = pos;
    };

    const catchBarSwappedDirection = (dir, at, pos) => {
        catchBarDirection = dir;
        catchBarLastSwapAt = at;
        catchBarLastSwapPosition = pos;
    };

    const getInfo = () => ({
        direction,
        lastSwapAt,
        lastSwapPosition,
        state
    });

    return {
        start,
        fishSwappedDirection,
        catchBarSwappedDirection,
        getInfo
    };
}
