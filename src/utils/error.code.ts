export const ErrorCodes: { [key: string]: CustomError } = {
  EMPLOYEE_WITH_ID_NOT_FOUND: {
    CODE: "EMPLOYEE_WITH_ID_NOT_FOUND",
    MESSAGE: "Emplpoyee with given id not found",
  },
  VALIDATION_ERROR: {
    CODE: "VALIDATION_ERROR",
    MESSAGE: "Error while validation request body",
  },
  INCORRECT_PASSWORD: {
    CODE: "INCORRECT_PASSWORD",
    MESSAGE: "Incorrect password",
  },
  UNAUTHORIZED: {
    CODE: "UNAUTHORIZED",
    MESSAGE: "You are not authorized to perform this action",
  },
  DELETION_CONSTRAINT_ERROR: {
    CODE: "DELETION_CONSTRAINT_ERROR",
    MESSAGE:
      "cannot delete this resource as it is referenced by another resource",
  },
};

export interface CustomError {
  CODE: string;
  MESSAGE: string;
}
