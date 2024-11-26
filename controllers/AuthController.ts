const Organization = require("../models/Organization.ts");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//@desc           Register a user
//@route          POST /api/v1/auth/register
//@access         Public

exports.register = asyncHandler(async (req, res, next) => {

        let {username, email, password} = req.body;

        if (!username || !email || !password) {
            res.status(400)
            throw new Error("Please include all fields!")
        };

        //Check username
        let usernameExists = await Organization.findOne({username});

        if (usernameExists) {  
            res.status(400)
            throw new Error("This user with this username already exists");
        }
        //Check User
        let userExists = await Organization.findOne({email: email});

        if (userExists) {
            res.status(400)
            throw new Error("This user with this email already exists!");
        };

        //Hash Password

        let salt = await bcrypt.genSalt(10);

        let hashPassword = await bcrypt.hash(password, salt);

        //Add to database

        let user = await Organization.create({
            username,
            email: email,
            password: hashPassword
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
            })
        } else {
            res.status(400)
            throw new Error("Invalid User Data")
        }
});

//@desc           Log In
//@route          POST    /api/v1/auth/login
//@access         Public

exports.login = asyncHandler(async (req, res, next) => {

    let {email, password} = req.body;

    if (!email || !password) {
        res.status(400)
        throw new Error("Please include all fields!")
    };

    let user = await Organization.findOne({email: email});

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken: generateToken(user._id, process.env.JWT_EXPIRE_ACCESS_TOKEN),
            refreshToken: generateToken(user._id, process.env.JWT_EXPIRE_REFRESH_TOKEN),
        })
    } else {
        res.status(401)
        throw new Error("Invalid Credentials");
    }
});


//@desc           Get new token from refresh token
//@route          POST  /api/v1/auth/getNewTokenFromRefreshToken
//@access         Public

exports.getNewTokenFromRefreshToken = asyncHandler(async (req, res) => {

    let {refreshToken} = req.body;

    if (!refreshToken) {
        res.status(400)
        throw new Error("Please include refresh token!");
    }

    try {
        let decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        res.status(201).json({
            accessToken: generateToken(decoded.id, process.env.JWT_EXPIRE_ACCESS_TOKEN), 
            refreshToken: generateToken(decoded.id, process.env.JWT_EXPIRE_REFRESH_TOKEN),
        })
    } catch (error) {
        res.status(401)
        throw new Error("Invalid refresh token");
    }

});

const generateToken = (id, expirationDate) => {
    return jwt.sign({ id: id}, process.env.JWT_SECRET, {
        expiresIn: expirationDate
    })
};

//Test

exports.getMe = asyncHandler(async (req, res) => {

    console.log(req.organization.id);
})

