const express = require('express');
const cors = require('cors');

const authRouter = require('./routers/authRouter')

require('dotenv').config();
const connectToDatabase = require('./db/connectDb');
const PORT = process.env.PORT

const app = express();

connectToDatabase();

app.use(cors());
app.use(express.json());

//Router for auth tasks
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
