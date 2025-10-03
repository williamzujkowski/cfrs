import { render } from 'preact';
import { App } from './App';
import './styles/index.css';

// Render the app
const root = document.getElementById('app');

if (!root) {
  throw new Error('Root element not found');
}

render(<App />, root);

// Log version and privacy notice
// eslint-disable-next-line no-console
console.log('%cCloudFlow Resume', 'font-size: 1.5em; font-weight: bold; color: #3b82f6;');
// eslint-disable-next-line no-console
console.log(
  '%cAll processing happens locally in your browser. No data is sent to servers.',
  'color: #10b981; font-weight: bold;'
);
// eslint-disable-next-line no-console
console.log(`Version: ${__APP_VERSION__}`);

// Service worker registration for offline support (future enhancement)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // eslint-disable-next-line no-console
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}
