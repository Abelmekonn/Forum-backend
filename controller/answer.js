const { StatusCodes } = require("http-status-codes"); // Corrected import

const { dbConnectionPool, dbConnectionPromise } = require('../db/dbConfig');

async function createAnswer(req, res) {
    const { userid, questionid, answer } = req.body;
    
    if (!userid || !questionid || !answer) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please enter all information" });
    }

    try {
        const query = "INSERT INTO answer (userid, questionid, answer) VALUES (?, ?, ?)";
        const result = await dbConnectionPromise.query(query, [userid, questionid, answer]);
        
        if (result) {
            return res.status(StatusCodes.CREATED).json({ msg: "Answer created successfully" });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to create answer" });
        }
    } catch (error) {
        console.error("Error creating answer:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" });
    }
}

async function GetAnswersByQuestionId(req,res){
    const questionId= req.params.questionId;
    try {
        const query="SELECT q.*,u.username FROM answer q INNER JOIN users u ON q.userid=u.userid WHERE questionid = ?";
        const result =await dbConnectionPromise.query(query,[questionId])
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

module.exports = {
    createAnswer,
    GetAnswersByQuestionId
};
