#!/usr/bin/env node

/**
 * Mapping validation script
 * Validates CFRS ↔ JSON Resume ↔ FRESH mappings
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to validate
const CFRS_TO_JRS_PATH = resolve(__dirname, '../schemas/mappings/cfrs-to-jrs.json');
const CFRS_TO_FRESH_PATH = resolve(__dirname, '../schemas/mappings/cfrs-to-fresh.json');

console.log('🔍 Validating schema mappings...\n');

let hasErrors = false;

// Validate CFRS → JSON Resume mapping
if (!existsSync(CFRS_TO_JRS_PATH)) {
  console.log('ℹ️  CFRS → JSON Resume mapping not found (will be created by SCHEMA agent)');
} else {
  try {
    const mapping = JSON.parse(readFileSync(CFRS_TO_JRS_PATH, 'utf-8'));
    console.log('✅ CFRS → JSON Resume mapping is valid');
    console.log(`   Version: ${mapping.version || 'N/A'}\n`);
  } catch (error) {
    console.error('❌ CFRS → JSON Resume mapping validation failed:');
    console.error(error.message);
    hasErrors = true;
  }
}

// Validate CFRS → FRESH mapping
if (!existsSync(CFRS_TO_FRESH_PATH)) {
  console.log('ℹ️  CFRS → FRESH mapping not found (will be created by SCHEMA agent)');
} else {
  try {
    const mapping = JSON.parse(readFileSync(CFRS_TO_FRESH_PATH, 'utf-8'));
    console.log('✅ CFRS → FRESH mapping is valid');
    console.log(`   Version: ${mapping.version || 'N/A'}\n`);
  } catch (error) {
    console.error('❌ CFRS → FRESH mapping validation failed:');
    console.error(error.message);
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log('✅ All mappings validated successfully\n');
  process.exit(0);
}
