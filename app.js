require("dotenv").config();
const cors =require("cors")
const express = require("express");
const app = express();
const port = 5500;

// Import db connection
const { dbConnectionPool, dbConnectionPromise } = require('./db/dbConfig');

// user route file
const userRouter = require('./routes/userRoute');

// question  route file
const questionRoute=require("./routes/questionRoute")

// answer route file
const answerRoute=require("./routes/answerRoute")

app.use(express.json())
app.use(cors())

// user middleware
app.use("/api/users", userRouter);

// question middleware
app.use('/api/questions', questionRoute)

//  Answer MiddleWare
app.use('/api/answer', answerRoute)

async function first() {
    try {
        // Use the promise for executing queries
        await app.listen(port);
        console.log(`Listening on ${port}`)
    } catch (error) {
        console.log(error);
    }
}

first();

