import { 
    catchBarAndFishTouch, 
    computeCatchBarCurrentPosition, 
    computeFishCurrentPosition, 
    computeProgressBarCurrentPosition, 
    PROGRESS_BAR_INITIAL_POSITION, 
    PROGRESS_BAR_TICK_FREQUENCY, 
    timeForProgressBarToReachLimit 
} from "../frontend/public/globals.js";

export default function ProgressBar(ws, fishSpeed, finishCallback) {
    let lastSwapPosition;
    let lastSwapAt; 
    let direction; 
    let state;

    let t1 ,t2;

    let fishDirection, fishLastSwapAt, fishLastSwapPosition;
    let catchBarDirection, catchBarLastSwapAt, catchBarLastSwapPosition;

    const _sendToWs = (lastSwapPosition, lastSwapAt, direction, state) => {
        ws.send(JSON.stringify({'type' : 'progressBarInfo', 'data' : {lastSwapPosition, lastSwapAt, direction, state}}));
    }

    const start = () => {
        lastSwapPosition = PROGRESS_BAR_INITIAL_POSITION;
        lastSwapAt = Date.now();
        direction = "down";
        state = "in_progress";
        _sendToWs(lastSwapPosition, lastSwapAt, direction, state);
        startTimerT1();
        startIntervalT2();
    }

    const startTimerT1 = () => {
        t1 = setTimeout(() => {
            if (direction === "up") state = "successful";
            if (direction === "down") state = "failed";

            _sendToWs(lastSwapPosition, lastSwapAt, direction, state);

            if (t2 !== undefined) {
                clearTimeout(t2);
                t2 = undefined;
            }
            finishCallback();
        }, timeForProgressBarToReachLimit(direction, lastSwapPosition));

    }

    const startIntervalT2 = () => {
        t2 = setInterval(() => {
            const currentPositionCatchBar = computeCatchBarCurrentPosition(catchBarDirection, catchBarLastSwapAt, catchBarLastSwapPosition);
            const currentPositionFish = computeFishCurrentPosition(fishDirection, fishLastSwapAt, fishLastSwapPosition, fishSpeed);
            const isCatchBarAndFishTouch = catchBarAndFishTouch(currentPositionFish, currentPositionCatchBar)

            if ((direction === "down" && isCatchBarAndFishTouch) || (direction === "up" && !isCatchBarAndFishTouch)) {
                lastSwapPosition = computeProgressBarCurrentPosition(direction, lastSwapAt, lastSwapPosition);
                (direction === "down") ? direction = "up" : direction = "down";
                lastSwapAt = Date.now();
                
                _sendToWs(lastSwapPosition, lastSwapAt, direction, state);

                if (t1 !== undefined) {
                    clearTimeout(t1);
                    startTimerT1();
                }
            }
        }, PROGRESS_BAR_TICK_FREQUENCY);
    }

    const fishSwappedDirection = (newFishDirection, newFishLastSwapAt, newFishLastSwapPosition) => {
        fishDirection = newFishDirection;
        fishLastSwapAt = newFishLastSwapAt;
        fishLastSwapPosition = newFishLastSwapPosition;
    }

    const catchBarSwappedDirection = (newCatchBarDirection, newCatchBarLastSwapAt, newCatchBarLastSwapPosition) => {
        catchBarDirection = newCatchBarDirection;
        catchBarLastSwapAt = newCatchBarLastSwapAt;
        catchBarLastSwapPosition = newCatchBarLastSwapPosition;
    }

    const getInfo = () => {
        return {
            direction,
            lastSwapAt,
            lastSwapPosition,
            state
        }
    }

    return {
        start,
        fishSwappedDirection,
        catchBarSwappedDirection,
        getInfo
    }
}