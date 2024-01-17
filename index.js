const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs').promises;
const path = require('path');

app.use(express.json());
let toDo = [];

const FILE_PATH = path.join(__dirname, 'file.json');

async function readTodos() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        toDo = JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error);
        toDo = [];
    }
}

async function writeTodos() {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(toDo));
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

app.post('/todo', async (req, res) => {
    const obj = {
        id: Math.floor(Math.random() * 1000000),
        title: req.body.title,
        description: req.body.description
    };

    toDo.push(obj);
    await writeTodos();
    res.send(toDo);
});

app.get('/todo', async (req, res) => {
    await readTodos();
    res.send(toDo);
});

app.delete('/todo/:id', async (req, res) => {
    const todoIndex = toDo.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
        res.status(404).send();
    } else {
        toDo.splice(todoIndex, 1);
        await writeTodos();
        res.status(200).send();
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

async function start() {
    await readTodos();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

start();
