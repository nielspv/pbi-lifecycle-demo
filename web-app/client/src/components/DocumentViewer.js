import React, { useState } from 'react';
import './DocumentViewer.css';

function DocumentViewer({ title, markdown, docxFilename, pbiId }) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'markdown'

  const handleDownloadDocx = () => {
    // Trigger download of the .docx file
    const link = document.createElement('a');
    link.href = `/api/pbis/${pbiId}/download-docx`;
    link.download = docxFilename || `${title}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMarkdown = () => {
    // Trigger download of the .md file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(markdown));
    element.setAttribute('download', `${title}.md`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="document-viewer">
      <div className="viewer-header">
        <div className="viewer-title">
          <h2>📄 Generated Documentation</h2>
          <p>{title}</p>
        </div>
        <div className="viewer-controls">
          <button
            className={`btn-view-mode ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => setViewMode('preview')}
          >
            👁️ Preview
          </button>
          <button
            className={`btn-view-mode ${viewMode === 'markdown' ? 'active' : ''}`}
            onClick={() => setViewMode('markdown')}
          >
            📝 Markdown
          </button>
          <button className="btn-download" onClick={handleDownloadMarkdown}>
            ⬇️ .md
          </button>
          <button className="btn-download btn-docx" onClick={handleDownloadDocx}>
            ⬇️ .docx
          </button>
        </div>
      </div>

      {viewMode === 'preview' && (
        <div className="document-preview">
          <div className="preview-content">
            {markdown.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i}>{line.replace('# ', '')}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={i}>{line.replace('## ', '')}</h2>;
              } else if (line.startsWith('### ')) {
                return <h3 key={i}>{line.replace('### ', '')}</h3>;
              } else if (line.startsWith('- ')) {
                return <li key={i}>{line.replace('- ', '')}</li>;
              } else if (line.trim() === '') {
                return <br key={i} />;
              } else {
                return <p key={i}>{line}</p>;
              }
            })}
          </div>
        </div>
      )}

      {viewMode === 'markdown' && (
        <div className="document-markdown">
          <pre>{markdown}</pre>
        </div>
      )}
    </div>
  );
}

export default DocumentViewer;
