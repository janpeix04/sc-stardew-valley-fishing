import { fileURLToPath } from "url";
import Game from "./game.js";
import cors from "cors";
import path from "path";
import express from "express";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

const publicFolder = path.join(__dirname, "frontend/public");
app.use(express.static(publicFolder));

let game = null;

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    game = Game(ws);
});

const requireGame = (res) => {
    if (!game) {
        res.status(503).json({ error: "Game not initialized yet." });
        return false;
    }
    return true;
};

app.get("/cast_line", (req, res) => {
    if (!requireGame(res)) return;

    const result = game.castLine();

    if (result) {
        res.status(400).json({ errorCode: result });
        return;
    }

    res.sendStatus(200);
});

app.get("/wait_for_bite", (req, res) => {
    if (!requireGame(res)) return;

    game.waitForBite()
        .then(() => res.sendStatus(200))
        .catch((errorCode) => res.status(400).json({ errorCode }));
});

app.get("/reel_in", (req, res) => {
    if (!requireGame(res)) return;

    const result = game.reelIn();

    if (result?.errorCode) {
        res.status(400).json(result);
        return;
    }

    if (result?.difficulty) {
        res.status(200).json(result);
        return;
    }

    res.sendStatus(400);
});

app.get("/get_mini_game_info", (req, res) => {
    if (!requireGame(res)) return;

    const info = game.getCatchingMiniGameInfo();
    res.status(200).json(info);
});

app.get("/move_catch_bar_up", (req, res) => {
    if (!requireGame(res)) return;

    game.updateCatchBarDirection("up");
    res.sendStatus(200);
});

app.get("/stop_moving_catch_bar_up", (req, res) => {
    if (!requireGame(res)) return;

    game.updateCatchBarDirection("down");
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
