const bcrypt = require('bcrypt');
const { StatusCodes } = require("http-status-codes"); // Corrected import

const jwt = require("jsonwebtoken")

// db connection
const { dbConnectionPool, dbConnectionPromise } = require('../db/dbConfig');

async function register(req, res) {
    const { username, firstname, lastname, email, password } = req.body;
    if (!username || !firstname || !lastname || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please fill all fields" }); // Corrected reference to StatusCodes
    }
    try {
        const [user] = await dbConnectionPromise.query("select username,userid from users where username=? or email=? ", [username, email]);
        if (user.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json("user already register"); // Corrected reference to StatusCodes
        }
        if (password.length <= 8) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: `Password should be at least 8 characters` }); // Corrected reference to StatusCodes
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await dbConnectionPromise.query("INSERT INTO users (username,firstname,lastname,email,password) value (?,?,?,?,?)", [username, firstname, lastname, email, hashedPassword]);

        return res.status(StatusCodes.CREATED).json({ msg: "inserted" }); // Corrected reference to StatusCodes
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something is wrong" }); // Corrected reference to StatusCodes
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please enter all info" }); // Corrected reference to StatusCodes
    }
    try {
        const [user] = await dbConnectionPromise.query("select username,userid,password from users where  email=? ", [email]);
        if (user.length == 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credential" }); // Corrected reference to StatusCodes
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid Credentials' });
        }
        const username = user[0].username
        const userid = user[0].userid

        const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, { expiresIn: "1d" })

        return res.status(StatusCodes.OK).json({ token, username, msg: "successful login" });
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something is wrong" }); // Corrected reference to StatusCodes
    }
}

async function checker(req, res) {
    const username = req.user.username
    const userid = req.user.userid
    res.status(StatusCodes.OK).json({ msg: "valid user", username, userid })
}


module.exports = {
    register,
    login,
    checker
};