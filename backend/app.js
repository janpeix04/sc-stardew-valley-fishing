import cors from 'cors';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import Game from './game.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8081;
const game = Game();

app.use(cors());
app.use(express.json());
const publicFolder = path.join(__dirname, '/frontend/public');
app.use(express.static(publicFolder));

app.get('/', (req, res) => {
    res.send({message: 'hello world'})
});

app.get('/cast_line', (req, res) => {
    console.log('Cast line endpoint entered')
    const result = game.castLine();

    if (result) {
        res.status(400).json({errorCode : result});
    }

    res.status(200).send();
});

app.get('/wait_for_bite', (req, res) => {
    console.log('Wait for bite endpoint entered')
    game.waitForBite()
        .then(() => res.status(200).send())
        .catch(errorCode => res.status(400).json({errorCode}));
});

app.get('/reel_in', (req, res) => {
    console.log('Reel in endpoint entered')
    const result = game.reelIn();

    if (result && result.errorCode) {
        res.status(400).json(result);
    } else if (result && result.difficulty) {
        res.status(200).json(result);
    }
});

app.get('/get_mini_game_info', (req, res) => {
    console.log('Get mini game endpoint entered')
    const result = game.getCatchingMiniGameInfo();

    if (result) {
        res.status(200).json(result);
    }
});

app.get('/move_catch_bar_up', (req, res) => {
    game.updateCatchBarDirection("up");
    res.status(200).send();
});

app.get('/stop_moving_catch_bar_up', (req, res) => {
    game.updateCatchBarDirection("down");
    res.status(200).send();
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));