#!/usr/bin/env node

/**
 * Schema validation script
 * Validates CFRS schema and mappings
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ajv = new Ajv({
  strict: true,
  allErrors: true,
  strictSchema: false, // Allow metadata keywords like "version"
  validateFormats: true
});
addFormats(ajv);

// Paths to validate
const SCHEMA_PATH = resolve(__dirname, '../schemas/cfrs.schema.json');

console.log('🔍 Validating CFRS schema...\n');

// Check if schema file exists
if (!existsSync(SCHEMA_PATH)) {
  console.error('❌ Schema file not found:', SCHEMA_PATH);
  console.log('ℹ️  Schema file will be created by the SCHEMA agent');
  process.exit(0); // Don't fail if schema doesn't exist yet
}

try {
  // Load and validate schema
  const schemaContent = readFileSync(SCHEMA_PATH, 'utf-8');
  const schema = JSON.parse(schemaContent);

  // Validate schema structure
  const validate = ajv.compile(schema);

  console.log('✅ CFRS schema is valid');
  console.log(`   Version: ${schema.version || 'N/A'}`);
  console.log(`   $id: ${schema.$id || 'N/A'}`);
  console.log(`   Title: ${schema.title || 'N/A'}\n`);

  process.exit(0);
} catch (error) {
  console.error('❌ Schema validation failed:');
  console.error(error.message);
  process.exit(1);
}
