import HttpException from "./http.exceptions";
import { CustomError } from "../utils/error.code";

class EntityNotFoundException extends HttpException {
  constructor(error: CustomError) {
    super(404, error.MESSAGE);
  }
}

export default EntityNotFoundException;
