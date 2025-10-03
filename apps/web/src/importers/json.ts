import type { CFRSResume } from '../types/cfrs';

export async function importJSON(content: string): Promise<CFRSResume> {
  try {
    const data = JSON.parse(content);

    // Ensure $schema field
    if (!data.$schema) {
      data.$schema = 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json';
    }

    // Ensure basics.name exists (minimum requirement)
    if (!data.basics || !data.basics.name) {
      throw new Error('Resume must have basics.name field');
    }

    return data as CFRSResume;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
    throw error;
  }
}
