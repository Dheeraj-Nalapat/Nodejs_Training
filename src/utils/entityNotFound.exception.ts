import HttpException from "../exceptions/http.exceptions";
import { CustomError } from "./error.code";

class EntityNotFoundException extends HttpException {
  constructor(error: CustomError) {
    super(404, error);
  }
}

export default EntityNotFoundException;
