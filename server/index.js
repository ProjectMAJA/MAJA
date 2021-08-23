require('dotenv').config();

const cors = require('cors');
const express = require('express');
const router = require('./app/router');

const port = process.env.PORT || 5500;

const app = express();

app.use(cors());   
app.use(express.json());

app.use('/v1', router);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});