import matter from 'gray-matter';
import type { CFRSResume } from '../types/cfrs';

export async function importMarkdown(content: string): Promise<CFRSResume> {
  try {
    const { data, content: markdown } = matter(content);

    // Try to extract basics from frontmatter
    const basics = {
      name: data.name || 'Unknown',
      label: data.title || data.label,
      email: data.email,
      phone: data.phone,
      url: data.website || data.url,
      summary: data.summary || markdown.split('\n').slice(0, 3).join(' ').substring(0, 500),
    };

    const resume: CFRSResume = {
      $schema: 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json',
      basics,
    };

    // Parse work experience from markdown sections (basic implementation)
    if (data.work) {
      resume.work = Array.isArray(data.work) ? data.work : [];
    }

    if (data.education) {
      resume.education = Array.isArray(data.education) ? data.education : [];
    }

    if (data.skills) {
      resume.skills = Array.isArray(data.skills) ? data.skills : [];
    }

    return resume;
  } catch (error) {
    throw new Error(`Failed to parse Markdown: ${(error as Error).message}`);
  }
}
