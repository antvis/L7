import { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';
import { ErrorObject } from 'ajv';

type Schema = JSONSchema4 | JSONSchema6 | JSONSchema7;
type PostFormatter = (formattedError: string, error: ErrorObject) => string;

declare namespace SchemaUtils {
  class ValidationError extends Error {
    constructor(
      errors: Array<ErrorObject>,
      schema: Schema,
      configuration?: Partial<ValidationErrorConfiguration>
    );

    name: string;
    errors: Array<ErrorObject>;
    schema: Schema;
    headerName: string;
    baseDataPath: string;
    postFormatter: PostFormatter | null;
    message: string;
  }

  interface ValidationErrorConfiguration {
    name: string;
    baseDataPath: string;
    postFormatter: PostFormatter;
  }
}

declare var validate: {
  (
    schema: Schema,
    options: Array<object> | object,
    configuration?: Partial<SchemaUtils.ValidationErrorConfiguration>
  ): void;
  ValidateError: typeof SchemaUtils.ValidationError;
  ValidationError: typeof SchemaUtils.ValidationError;
};

export = validate;
