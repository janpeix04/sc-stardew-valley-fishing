import CatchingMinigame from "./catching_minigame.js";
import { 
    ATTEMPTS_DIFFICULTY,
    FISH_BIT_TIMEOUT_MS,
    PULL_ROD_TIMEOUT_MS
} from "../frontend/public/globals.js";

export default function Game(ws) {
    let playerState = "standing";
    let attemptNumber = 0;

    const catchingMinigame = CatchingMinigame(ws, () => {
        playerState = "standing";
    });

    let biteTimer;
    let escapeTimer;
    let resolveBite;
    let rejectBite;

    const setState = (state) => {
        playerState = state;
    };

    const clearBiteHandlers = () => {
        resolveBite = undefined;
        rejectBite = undefined;
    };

    const castLine = () => {
        if (playerState !== "standing") return playerState;

        setState("line_cast");

        biteTimer = setTimeout(() => {
            setState("fish_bit");

            if (resolveBite) resolveBite();

            escapeTimer = setTimeout(() => {
                setState("standing");
                if (rejectBite) rejectBite(playerState);
                clearBiteHandlers();
            }, PULL_ROD_TIMEOUT_MS);

        }, FISH_BIT_TIMEOUT_MS);

        return null;
    };

    const waitForBite = () => {
        if (playerState !== "line_cast") {
            return Promise.reject(playerState);
        }

        return new Promise((resolve, reject) => {
            resolveBite = resolve;
            rejectBite = reject;
        });
    };

    const reelIn = () => {
        if (playerState === "line_cast") {
            setState("standing");

            if (rejectBite) rejectBite(playerState);
            clearTimeout(biteTimer);
            clearBiteHandlers();

            return { errorCode: "standing" };
        }

        if (playerState === "fish_bit") {
            setState("playing_minigame");
            clearTimeout(escapeTimer);
            clearBiteHandlers();

            const difficulty = ATTEMPTS_DIFFICULTY[attemptNumber];
            catchingMinigame.start(difficulty);

            attemptNumber = (attemptNumber + 1) % ATTEMPTS_DIFFICULTY.length;

            return { difficulty };
        }

        return { errorCode: playerState };
    };

    const updateCatchBarDirection = (direction) => {
        catchingMinigame.updateCatchBarDirection(direction);
    };

    const getCatchingMiniGameInfo = () => catchingMinigame.getInfo();

    return {
        castLine,
        waitForBite,
        reelIn,
        updateCatchBarDirection,
        getCatchingMiniGameInfo,
    };
}
