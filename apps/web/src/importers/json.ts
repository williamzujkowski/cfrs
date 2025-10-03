import type { CFRSResume } from '../types/cfrs';

export function importJSON(content: string): CFRSResume {
  try {
    const data: unknown = JSON.parse(content);

    // Type guard to check if data is an object
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid JSON: expected an object');
    }

    const resume = data as Record<string, unknown>;

    // Ensure $schema field
    if (!resume.$schema) {
      resume.$schema = 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json';
    }

    // Ensure basics.name exists (minimum requirement)
    const basics = resume.basics as Record<string, unknown> | undefined;
    if (!basics || !basics.name) {
      throw new Error('Resume must have basics.name field');
    }

    return resume as unknown as CFRSResume;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
    throw error;
  }
}
