const express = require('express');
const path = require('path');
require('dotenv').config()
const app = express();

// recuperation du port via .env sinon utilise le port 5000
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.static('front/build'))

app.get('/api/app', (req, res) => {
    res.send({
        msg: 'Hello world'
    })
})

app.get('/*', (_, res) => {
    res.sendFile(path.join(__direname, '/front/build/index.html'));
})

app.listen(PORT, () => {
    console.log(`server lancé sur le port: ${PORT}`);
})