class JSONResponse {
    static success(res, message = "Success", data, status) {
        res.status(status ?? res.statusCode).json({
            status: status ?? res.statusCode,
            message,
            data
        });
    }


    static err(res, message = "Error", error, status) {
        res.status(status ?? res.statusCode).json({
            message,
            error,
            status: status ?? res.statusCode
        });
    }

}

module.exports = { JSONResponse };