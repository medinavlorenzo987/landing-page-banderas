import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const isAdmin = window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#/admin');

if (isAdmin) {
  import('./admin/AdminApp.jsx').then(({ default: AdminApp }) => {
    createRoot(document.getElementById('root')).render(
      <StrictMode><AdminApp /></StrictMode>
    );
  });
} else {
  import('./index.css');
  import('./App.jsx').then(({ default: App }) => {
    createRoot(document.getElementById('root')).render(
      <StrictMode><App /></StrictMode>
    );
  });
}
