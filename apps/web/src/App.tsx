import { h } from 'preact';
import { Route, Switch, Link } from 'wouter';
import { ImportPage } from './pages/ImportPage';
import { PreviewPage } from './pages/PreviewPage';
import { ExportPage } from './pages/ExportPage';
import { useResumeStore } from './store';

export function App(): h.JSX.Element {
  const resume = useResumeStore((state) => state.resume);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CloudFlow Resume</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Privacy-first resume builder - All processing happens locally
          </p>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2"
            >
              Import
            </Link>
            <Link
              href="/preview"
              className={`px-3 py-2 ${!resume ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
            >
              Preview
            </Link>
            <Link
              href="/export"
              className={`px-3 py-2 ${!resume ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
            >
              Export
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Switch>
          <Route path="/" component={ImportPage} />
          <Route path="/preview" component={PreviewPage} />
          <Route path="/export" component={ExportPage} />
        </Switch>
      </main>

      <footer className="mt-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            CloudFlow Resume v1.0.0 - MIT License - 100% Client-Side Processing
          </p>
        </div>
      </footer>
    </div>
  );
}
