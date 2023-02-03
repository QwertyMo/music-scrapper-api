export class Error {
    statusCode: number;
    message: String;
    error: "WRONG_LINK" | "SERVER_ERROR" | "WRONG_ID" | null;

    constructor(statusCode: number, message: String, error: "WRONG_LINK" | "SERVER_ERROR" | "WRONG_ID" | null){
        this.statusCode = statusCode
        this.message = message
        this.error = error
    }
}