
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization.ts");

exports.protect = asyncHandler(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {

            token = req.headers.authorization.split(" ")[1];

            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.organization = await Organization.findById(decoded.id).select("-password");

            next();

        } catch (err) {
            res.status(401)
            throw new Error("No authorization");
        }
    } else {
        res.status(401)
        throw new Error("No given token is given");
    }
});