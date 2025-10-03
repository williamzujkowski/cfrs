import { h } from 'preact';
import { useResumeStore, useUIStore } from '../store';
import { useLocation } from 'wouter';

export function PreviewPage(): h.JSX.Element {
  const resume = useResumeStore((state) => state.resume);
  const validationErrors = useUIStore((state) => state.validationErrors);
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Resume Preview</h2>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Validation Warnings ({validationErrors.length})
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
            {validationErrors.slice(0, 5).map((err, idx) => (
              <li key={idx}>
                {err.instancePath || '/'}: {err.message}
              </li>
            ))}
            {validationErrors.length > 5 && <li>...and {validationErrors.length - 5} more</li>}
          </ul>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 prose dark:prose-invert max-w-none">
        <h1>{resume.basics.name}</h1>
        {resume.basics.label && <p className="text-xl text-gray-600">{resume.basics.label}</p>}

        {resume.basics.summary && (
          <div>
            <h2>Summary</h2>
            <p>{resume.basics.summary}</p>
          </div>
        )}

        {resume.work && resume.work.length > 0 && (
          <div>
            <h2>Work Experience</h2>
            {resume.work.map((job, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="text-lg font-semibold">{job.position}</h3>
                <p className="text-gray-600">
                  {job.name} | {job.startDate} - {job.endDate || 'Present'}
                </p>
                {job.summary && <p>{job.summary}</p>}
                {job.highlights && job.highlights.length > 0 && (
                  <ul>
                    {job.highlights.map((highlight, hidx) => (
                      <li key={hidx}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {resume.education && resume.education.length > 0 && (
          <div>
            <h2>Education</h2>
            {resume.education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="text-lg font-semibold">
                  {edu.studyType} in {edu.area}
                </h3>
                <p className="text-gray-600">
                  {edu.institution} | {edu.startDate} - {edu.endDate || 'Present'}
                </p>
              </div>
            ))}
          </div>
        )}

        {resume.skills && resume.skills.length > 0 && (
          <div>
            <h2>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
