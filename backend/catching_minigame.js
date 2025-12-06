import CatchBar from "./catch_bar.js";
import Fish from "./fish.js";
import ProgressBar from "./progress_bar.js";
import { DIFFICULTY_TO_FISH_SPEED } from "../frontend/public/globals.js";

export default function CatchingMinigame(ws, finishCallback) {
    let progressBar;
    let catchBar;
    let fish;

    const start = (difficulty) => {
        const fishSpeed = DIFFICULTY_TO_FISH_SPEED[difficulty]
        progressBar = ProgressBar(ws, fishSpeed, () => {fish.finish(), finishCallback();});
        catchBar = CatchBar(ws, progressBar.catchBarSwappedDirection);
        fish = Fish(ws, fishSpeed, progressBar.fishSwappedDirection);
        
        progressBar.start();
        catchBar.start();
        fish.start();
    }

    const getInfo = () => {
        return {
            progressBarInfo : progressBar.getInfo(),
            catchBarInfo : catchBar.getInfo(),
            fishInfo : fish.getInfo()
        }
    }

    const updateCatchBarDirection = newDirection => {
        catchBar.updateDirection(newDirection);
    }

    return {
        start, 
        getInfo,
        updateCatchBarDirection
    }
}