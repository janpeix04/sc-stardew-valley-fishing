import cors from 'cors';
import path from 'path';
import express from 'express';

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: 'hello world'})
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))