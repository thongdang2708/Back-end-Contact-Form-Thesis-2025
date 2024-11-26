
const errorHandler = (err, req, res, next) => {

    let statusCode = res.statusCode ?? 500;

    if (err?.name === "SyntaxError") {
        res.status(400).json({
            message: "Syntax is wrong",
            statusCode: 400
        });

        return;
    }
    if (err?.name === "ValidationError") {
        res.status(400).json({
            message: err?.message,
            statusCode: 400,
        }); 

        return;
    }

    res.status(statusCode).json({
        message: err?.message,
        statusCode: statusCode,
    });

};

module.exports = errorHandler;