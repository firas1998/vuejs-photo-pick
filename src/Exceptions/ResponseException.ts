import { BaseError } from "./BaseError";

export class ResponseException extends BaseError {
    public readonly status: number;
    public readonly message: string;
    constructor (status: number, message: string) {
        super();
        this.status = status; 
        this.message = message; 
    }
}