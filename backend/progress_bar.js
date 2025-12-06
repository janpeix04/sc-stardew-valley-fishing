import {
    catchBarAndFishTouch,
    computeCatchBarCurrentPosition,
    computeFishCurrentPosition,
    computeProgressBarCurrentPosition,
    PROGRESS_BAR_INITIAL_POSITION,
    PROGRESS_BAR_TICK_FREQUENCY,
    timeForProgressBarToReachLimit
} from '../frontend/public/globals.js';

export default function ProgressBar(fishSpeed, finishCallback) {
    let lastSwapAt;
    let lastSwapPosition;
    let direction;

    let state;
    let t1, t2;

    let fishDirection, fishLastSwapAt, fishLastSwapPosition;
    let catchBarDirection, catchBarLastSwapAt, catchBarLastSwapPosition;

    const start = () => {
        lastSwapAt = Date.now();
        lastSwapPosition = PROGRESS_BAR_INITIAL_POSITION;
        direction = "down";

        state = "in_progress";

        startTimerT1();
        startIntervalT2();
    };

    const startTimerT1 = () => {
        t1 = setTimeout(() => {
            state = direction === "up" ? "successful" : "failed";

            if (t2 !== undefined) {
                clearTimeout(t2);
                t2 = undefined;
            }
            finishCallback();
        }, timeForProgressBarToReachLimit(direction, lastSwapPosition));
    };

    const startIntervalT2 = () => {
        t2 = setInterval(() => {
            const currentPositionCatchBar = computeCatchBarCurrentPosition(catchBarDirection, catchBarLastSwapAt, catchBarLastSwapPosition);
            const currentPositionFish = computeFishCurrentPosition(fishDirection, fishLastSwapAt, fishLastSwapPosition, fishSpeed);

            const isCatchBarAndFishTouching = catchBarAndFishTouch (currentPositionCatchBar, currentPositionFish);

            if ((direction === "down" && isCatchBarAndFishTouching) || (direction === "up" && !isCatchBarAndFishTouching)) {
                lastSwapPosition = computeProgressBarCurrentPosition(direction, lastSwapAt, lastSwapPosition);
                lastSwapAt = Date.now();
                direction = direction === "down" ? "up" : "down";

                if (t1 !== undefined) {
                    clearTimeout(t1);
                    startTimerT1();
                }
            }
        }, PROGRESS_BAR_TICK_FREQUENCY); 
    };

    const fishSwappedDirection = (newFishDirection, newFishLastSwapAt, newFishLastSwapPosition) => {
        fishDirection = newFishDirection;
        fishLastSwapAt = newFishLastSwapAt;
        fishLastSwapPosition = newFishLastSwapPosition;
    };

    const catchBarSwappedDirection = (newCatchBarDirection, newCatchBarLastSwapAt, newCatchBarLastSwapPosition) => {
        catchBarDirection = newCatchBarDirection;
        catchBarLastSwapAt = newCatchBarLastSwapAt;
        catchBarLastSwapPosition = newCatchBarLastSwapPosition;
    };

    const getInfo = () => {
        return {
            direction,
            lastSwapAt,
            lastSwapPosition,
            state
        }
    };

    return {
        start,
        fishSwappedDirection,
        catchBarSwappedDirection,
        getInfo
    }
}