import CatchBar from './catch_bar.js';
import Fish from './fish.js';
import ProgressBar from './progress_bar.js';
import { DIFFICULTY_TO_FISH_SPEED } from '../frontend/public/globals.js';

export default function CatchingMinigame(finishCallback) {
    let progressBar, catchBar, fish;

    const start = (difficulty) => {
        const fishSpeed = DIFFICULTY_TO_FISH_SPEED[difficulty];
        progressBar = ProgressBar(fishSpeed, () => { fish.finish(), finishCallback() });
        catchBar = CatchBar(progressBar.catchBarSwappedDirection());
        fish = Fish(fishSpeed, progressBar.fishSwappedDirection());

        progressBar.start();
        catchBar.start();
        fish.start();
    };

    const updateCatchBarDirection = (direction) => {
        catchBar.updateDirection(direction);
    }

    const getInfo = () => {
        return {
            progressBarInfo: progressBar.getInfo(),
            catchBarInfo: catchBar.getInfo(),
            fishInfo: fish.getInfo()
        }
    };

    return {
        start,
        updateCatchBarDirection,
        getInfo,
    }
}