import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { CFRSResume, ValidationError } from '../types/cfrs';
import cfrsSchema from '@schemas/cfrs.schema.json';

const ajv = new Ajv({
  strict: true,
  allErrors: true,
  strictSchema: false,
  validateFormats: true,
});
addFormats(ajv);

const validate = ajv.compile(cfrsSchema);

export function validateResume(resume: unknown): {
  valid: boolean;
  errors: ValidationError[];
} {
  const valid = validate(resume);
  const errors = (validate.errors || []).map((err) => ({
    instancePath: err.instancePath,
    schemaPath: err.schemaPath,
    keyword: err.keyword,
    params: err.params,
    message: err.message,
  }));

  return { valid: !!valid, errors };
}

export function isValidCFRSResume(data: unknown): data is CFRSResume {
  return validate(data) === true;
}
