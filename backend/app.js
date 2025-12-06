import cors from 'cors';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import CatchBar from './catch_bar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());
const publicFolder = path.join(__dirname, '/frontend/public');
app.use(express.static(publicFolder));

app.get('/', (req, res) => {
    res.send({message: 'hello world'})
});

app.get('/cast_line', (_, res) => {
    res.send({message: CatchBar()})
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))