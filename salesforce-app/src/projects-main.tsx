import React from 'react';
import ReactDOM from 'react-dom/client';
import ProjectsSection from './components/ProjectsSection';
import './projects.css';

function initProjectsSection() {
  const container = document.getElementById('projects-case-studies-root');
  if (container && !(container as any)._hasReactMounted) {
    (container as any)._hasReactMounted = true;
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <ProjectsSection />
      </React.StrictMode>
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsSection);
} else {
  initProjectsSection();
}
