import { CustomError } from "../utils/error.code";
import HttpException from "./http.exceptions";

class IncorrectPasswordException extends HttpException {
  constructor(error: CustomError) {
    super(401, error);
  }
}

export default IncorrectPasswordException;
