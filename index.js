const express = require('express');
const cors = require('cors');

const authRouter = require('./routers/authRouter')

require('dotenv').config();
const connectToDatabase = require('./db/connectDb');
const PORT = process.env.PORT

const app = express();

connectToDatabase();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Router for auth tasks
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
