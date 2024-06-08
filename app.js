require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5500; // Ensure a default port if not specified in .env

// Import db connection (ensure these files are correctly set up)
const { dbConnectionPool, dbConnectionPromise } = require('./db/dbConfig');

// Import route files
const userRouter = require('./routes/userRoute');
const questionRoute = require('./routes/questionRoute');
const answerRoute = require('./routes/answerRoute');

// Middleware setup
app.use(express.json());
app.use(cors());

// Route middlewares
app.use("/api/users", userRouter);
app.use("/api/questions", questionRoute);
app.use("/api/answers", answerRoute); // Ensure consistency with pluralization

// Default 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ msg: 'Resource not found error.' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Something went wrong.', error: err.message });
});

// Start the server
async function startServer() {
    try {
        await app.listen(port);
        console.log(`Server listening on port ${port}`);
    } catch (error) {
        console.log('Error starting server:', error);
    }
}

startServer();
