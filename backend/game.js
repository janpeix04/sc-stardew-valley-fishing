import CatchingMinigame from './catching_minigame.js';
import {
    ATTEMPTS_DIFFICULTY,
    FISH_BIT_TIMEOUT_MS,
    PULL_ROD_TIMEOUT_MS
} from '../frontend/public/globals.js';

export default function Game() {
    let playerState = "standing";
    let attemptNumber = 0;

    let catchingMinigame = CatchingMinigame(() => { playerState = "standing"; });

    let biteTimer, escapeTimer;
    let waitForBiteResolver, waitForBiteRejecter;

    const castLine = () => {
        if (playerState !== "standing") return playerState;

        playerState = "line_cast";
        biteTimer = setTimeout(() => {
            playerState = "fish_bit";

            if (waitForBiteResolver) waitForBiteResolver();

            escapeTimer = setTimeout(() => {
                playerState = "standing";

                if (waitForBiteRejecter) waitForBiteRejecter(playerState);
            }, PULL_ROD_TIMEOUT_MS);
        }, FISH_BIT_TIMEOUT_MS);

        return null;
    }

    const waitForBite = () => {
        if (playerState !== "line_cast") return Promise.reject(playerState);

        return new Promise(( resolve, reject) => {
            waitForBiteResolver =  resolve;
            waitForBiteRejecter = reject;
        });
    }

    const reelIn = () => {
        if (playerState === "line_cast") {
            playerState = "standing";

            if (waitForBiteRejecter) waitForBiteRejecter(playerState);
            clearTimeout(biteTimer);
        } else if (playerState === "fish_bit") {
            playerState = "playing_minigame";

            const selectedDifficulty = ATTEMPTS_DIFFICULTY[attemptNumber];
            catchingMinigame.start(selectedDifficulty);
            attemptNumber = (attemptNumber + 1) % ATTEMPTS_DIFFICULTY.length;
            clearTimeout(escapeTimer);

            return { difficulty: selectedDifficulty };
        }

        return { errorCode: playerState };
    }

    const updateCatchBarDirection = (direction) => {
        catchingMinigame.updateCatchBarDirection(direction);
    }

    const getCatchingMinigameInfo = () => {
        return catchingMinigame.getInfo();
    }

    return {
        castLine,
        waitForBite,
        reelIn,
        updateCatchBarDirection,
        getCatchingMinigameInfo,
    }
}