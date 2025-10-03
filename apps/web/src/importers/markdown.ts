import matter from 'gray-matter';
import type { CFRSResume, CFRSWork, CFRSEducation, CFRSSkill } from '../types/cfrs';

export function importMarkdown(content: string): CFRSResume {
  try {
    const { data, content: markdown } = matter(content);

    // Type the frontmatter data
    const frontmatter = data as Record<string, unknown>;

    // Try to extract basics from frontmatter
    const basics: CFRSResume['basics'] = {
      name: (frontmatter.name as string) || 'Unknown',
    };

    // Add optional fields only if they exist
    if (frontmatter.title || frontmatter.label) {
      basics.label = (frontmatter.title as string) || (frontmatter.label as string);
    }
    if (frontmatter.email) basics.email = frontmatter.email as string;
    if (frontmatter.phone) basics.phone = frontmatter.phone as string;
    if (frontmatter.website || frontmatter.url) {
      basics.url = (frontmatter.website as string) || (frontmatter.url as string);
    }
    if (frontmatter.summary) {
      basics.summary = frontmatter.summary as string;
    } else {
      basics.summary = markdown.split('\n').slice(0, 3).join(' ').substring(0, 500);
    }

    const resume: CFRSResume = {
      $schema: 'https://cloudflowresume.dev/schemas/cfrs-v1.0.0.json',
      basics,
    };

    // Parse work experience from markdown sections (basic implementation)
    if (frontmatter.work && Array.isArray(frontmatter.work)) {
      resume.work = frontmatter.work as unknown as CFRSWork[];
    }

    if (frontmatter.education && Array.isArray(frontmatter.education)) {
      resume.education = frontmatter.education as unknown as CFRSEducation[];
    }

    if (frontmatter.skills && Array.isArray(frontmatter.skills)) {
      resume.skills = frontmatter.skills as unknown as CFRSSkill[];
    }

    return resume;
  } catch (error) {
    throw new Error(`Failed to parse Markdown: ${(error as Error).message}`);
  }
}
