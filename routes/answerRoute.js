const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {createAnswer,GetAnswersByQuestionId}  = require("../controller/answer")

router.post("/create", authMiddleware, createAnswer);

router.get('/all/:questionId',authMiddleware ,GetAnswersByQuestionId)

module.exports=router;