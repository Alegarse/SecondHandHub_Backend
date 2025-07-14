const express = require('express');
const cors = require('cors');

require('dotenv').config({ override: true });
const connectToDatabase = require('./db/connectDb');
const PORT = process.env.PORT;

const app = express();

connectToDatabase();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
