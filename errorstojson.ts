import { ValidationError } from "class-validator";

const constraintsToJson = (errors: ValidationError[]) => {
  return errors.reduce((result, error) => {
    if (error.constraints) {
      result[error.property] = Object.values(error.constraints);
    }
    if (error.children && error.children.length > 0) {
      result[error.property] = errorsToJson(error.children);
    }
    return result;
  }, {});
};

const errorsToJson = (errors: ValidationError[]) => {
  return {
    error: "Validation Failed",
    statusvode: 400,
    errors: constraintsToJson(errors),
  };
};

export default errorsToJson;
