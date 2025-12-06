import CatchBar from "./catch_bar.js";
import Fish from "./fish.js";
import ProgressBar from "./progress_bar.js";
import { DIFFICULTY_TO_FISH_SPEED } from "../frontend/public/globals.js";

export default function CatchingMiniggame(ws, onFinish) {
    let progressBar;
    let catchBar;
    let fish;

    const start = (difficulty) => {
        const fishSpeed = DIFFICULTY_TO_FISH_SPEED[difficulty];

        const handleProgressBarFull = () => {
            fish.finish();
            onFinish();
        };

        progressBar = ProgressBar(ws, fishSpeed, handleProgressBarFull);
        catchBar   = CatchBar(ws, progressBar.catchBarSwappedDirection);
        fish       = Fish(ws, fishSpeed, progressBar.fishSwappedDirection);

        progressBar.start();
        catchBar.start();
        fish.start();
    };

    const getInfo = () => ({
        progressBarInfo: progressBar.getInfo(),
        catchBarInfo: catchBar.getInfo(),
        fishInfo: fish.getInfo(),
    });

    const updateCatchBarDirection = (newDirection) => {
        catchBar.updateDirection(newDirection);
    };

    return {
        start,
        getInfo,
        updateCatchBarDirection,
    };
}
