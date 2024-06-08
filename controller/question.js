const { StatusCodes } = require("http-status-codes"); // Corrected import

const { dbConnectionPool, dbConnectionPromise } = require('../db/dbConfig');

async function createQuestion(req, res) {
    const { userid, questionid, title, description, tag } = req.body;

    if (!userid || !questionid || !title || !description || !tag) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please enter all information" });
    }

    try {
        const query = "INSERT INTO questions (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)";
        const result = await dbConnectionPromise.query(query, [questionid, userid, title, description, tag]);
        if (result) {
            return res.status(StatusCodes.CREATED).json({ msg: "Question created successfully" });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to create question" });
        }
    } catch (error) {
        console.error("Error creating question:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
    }
}


async function updateQuestion(req, res) {
    const { questionid, title, description, tag } = req.body;

    if (!questionid || !title || !description || !tag) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all required information" });
    }

    try {
        const query = "UPDATE questions SET title=?, description=?, tag=? WHERE questionid=?";
        const result = await dbConnectionPromise.query(query, [title, description, tag, questionid]);

        if (result) {
            return res.status(StatusCodes.OK).json({ msg: "Question updated successfully" });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
        }
    } catch (error) {
        console.error("Error updating question:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
    }
}

async function deleteQuestion(req, res) {
    const { questionid } = req.body;

    if (!questionid) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide question ID" });
    }

    try {
        const query = "DELETE FROM questions WHERE questionid=?";
        const result = await dbConnectionPromise.query(query, [questionid]);

        if (result) {
            return res.status(StatusCodes.OK).json({ msg: "Question deleted successfully" });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
        }
    } catch (error) {
        console.error("Error deleting question:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
    }
}

async function allQuestions(req, res) {
    try {
        const query = "SELECT q.*, u.username FROM questions q INNER JOIN users u ON q.userid = u.userid";
        const result = await dbConnectionPromise.query(query);

        if (result.length > 0) {
            return res.status(StatusCodes.OK).json(result[0]);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "No questions found" });
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
    }
}
async function getQuestionDetail(req, res) {
    const questionId = req.params.questionId;

    try {
        const query = "SELECT q.*,u.username FROM questions q INNER JOIN users u ON q.userid=u.userid WHERE questionid = ?";
        const result = await dbConnectionPromise.query(query, [questionId]);

        if (result.length > 0) {
            return res.status(StatusCodes.OK).json(result[0]);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
        }
    } catch (error) {
        console.error("Error fetching question detail:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
    }
}



module.exports={
    createQuestion,
    deleteQuestion,
    updateQuestion,
    allQuestions,
    getQuestionDetail
}