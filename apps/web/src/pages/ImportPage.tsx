import { useState } from 'preact/hooks';
import { useResumeStore, useUIStore } from '../store';
import { importJSON } from '../importers/json';
import { importMarkdown } from '../importers/markdown';
import { validateResume } from '../utils/validator';

export function ImportPage() {
  const [importing, setImporting] = useState(false);
  const setResume = useResumeStore((state) => state.setResume);
  const setValidationErrors = useUIStore((state) => state.setValidationErrors);

  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const content = await file.text();
      let resume;

      if (file.name.endsWith('.json')) {
        resume = await importJSON(content);
      } else if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
        resume = await importMarkdown(content);
      } else {
        throw new Error('Unsupported file format. Please use .json or .md files.');
      }

      const { valid, errors } = validateResume(resume);
      setValidationErrors(errors);

      if (valid || errors.length === 0) {
        setResume(resume);
        alert('Resume imported successfully!');
      } else {
        setResume(resume);
        alert(`Resume imported with ${errors.length} validation warnings. Check the preview.`);
      }
    } catch (error) {
      alert(`Import failed: ${(error as Error).message}`);
    } finally {
      setImporting(false);
    }
  };

  const handlePaste = async (event: Event) => {
    event.preventDefault();
    const target = event.target as HTMLTextAreaElement;
    const content = target.value;
    if (!content.trim()) return;

    setImporting(true);
    try {
      let resume;

      // Try JSON first
      try {
        resume = await importJSON(content);
      } catch {
        // Fall back to Markdown
        resume = await importMarkdown(content);
      }

      const { valid, errors } = validateResume(resume);
      setValidationErrors(errors);

      if (valid || errors.length === 0) {
        setResume(resume);
        alert('Resume imported successfully!');
      } else {
        setResume(resume);
        alert(`Resume imported with ${errors.length} validation warnings.`);
      }
    } catch (error) {
      alert(`Import failed: ${(error as Error).message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Import Your Resume
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload a JSON Resume or Markdown file, or paste your resume data below.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upload File
        </h3>
        <input
          type="file"
          accept=".json,.md,.markdown"
          onChange={handleFileUpload}
          disabled={importing}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 disabled:opacity-50"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Or Paste Resume Data
        </h3>
        <textarea
          placeholder="Paste JSON or Markdown resume here..."
          onBlur={handlePaste}
          disabled={importing}
          className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm disabled:opacity-50"
        />
      </div>

      {importing && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Importing...</p>
        </div>
      )}
    </div>
  );
}
