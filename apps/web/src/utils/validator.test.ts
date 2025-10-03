import { describe, it, expect } from 'vitest';
import { validateResume } from './validator';

describe('validateResume', () => {
  it('should validate a minimal valid resume', () => {
    const resume = {
      $schema: 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json',
      basics: {
        name: 'Test User',
      },
    };

    const result = validateResume(resume);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject a resume without basics.name', () => {
    const resume = {
      $schema: 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json',
      basics: {},
    };

    const result = validateResume(resume);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject invalid date formats', () => {
    const resume = {
      $schema: 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json',
      basics: {
        name: 'Test User',
      },
      work: [
        {
          name: 'Company',
          position: 'Developer',
          startDate: '2023/01/01', // Invalid format (should be YYYY-MM-DD)
        },
      ],
    };

    const result = validateResume(resume);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should accept valid date formats', () => {
    const resume = {
      $schema: 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json',
      basics: {
        name: 'Test User',
      },
      work: [
        {
          name: 'Company',
          position: 'Developer',
          startDate: '2023-01-01',
          endDate: '2023-06',
        },
      ],
    };

    const result = validateResume(resume);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
