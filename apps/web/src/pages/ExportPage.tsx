import { h } from 'preact';
import { useResumeStore } from '../store';
import { useLocation } from 'wouter';

export function ExportPage(): h.JSX.Element {
  const resume = useResumeStore((state) => state.resume);
  const [, setLocation] = useLocation();

  if (!resume) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No resume loaded. Please import a resume first.
        </p>
        <button
          onClick={() => setLocation('/')}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Go to Import
        </button>
      </div>
    );
  }

  const downloadJSON = (): void => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.basics.name.replace(/\s+/g, '-')}-resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHTML = (): void => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.basics.name} - Resume</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { margin-bottom: 0; }
    .subtitle { color: #666; margin-top: 5px; }
    section { margin: 30px 0; }
    h2 { border-bottom: 2px solid #333; padding-bottom: 5px; }
    .job, .education { margin: 15px 0; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>${resume.basics.name}</h1>
  ${resume.basics.label ? `<p class="subtitle">${resume.basics.label}</p>` : ''}
  ${resume.basics.summary ? `<section><h2>Summary</h2><p>${resume.basics.summary}</p></section>` : ''}
  ${
    resume.work && resume.work.length > 0
      ? `
    <section>
      <h2>Work Experience</h2>
      ${resume.work
        .map(
          (job) => `
        <div class="job">
          <h3>${job.position}</h3>
          <p><strong>${job.name}</strong> | ${job.startDate} - ${job.endDate || 'Present'}</p>
          ${job.summary ? `<p>${job.summary}</p>` : ''}
          ${job.highlights ? `<ul>${job.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>` : ''}
        </div>
      `
        )
        .join('')}
    </section>
  `
      : ''
  }
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.basics.name.replace(/\s+/g, '-')}-resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Export Resume</h2>
        <p className="text-gray-600 dark:text-gray-400">Download your resume in various formats.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">CFRS JSON</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            CloudFlow Resume Schema format with all extensions
          </p>
          <button
            onClick={downloadJSON}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Download JSON
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">HTML</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Standalone HTML file with inline CSS
          </p>
          <button
            onClick={downloadHTML}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Download HTML
          </button>
        </div>
      </div>
    </div>
  );
}
