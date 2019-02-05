/* error_code is the code with which the error comes e.g. 404
    all custom error codes form Dr.Booze starts with 600 and a description of them is located at the discord/info
   error_reason is the part of the input which activates the error
*/
export interface CustomError {
    error_code: number;
    error_reason?: string;
}
