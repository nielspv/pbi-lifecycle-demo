import React from 'react';
import './PBIList.css';

function PBIList({ pbis, onSelectPBI }) {
  if (pbis.length === 0) {
    return (
      <div className="pbi-list-empty">
        <p>📭 No PBIs yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="pbi-list">
      <h2>Product Backlog Items ({pbis.length})</h2>
      <div className="pbi-cards">
        {pbis.map(pbi => (
          <div key={pbi.id} className="pbi-card" onClick={() => onSelectPBI(pbi)}>
            <div className="pbi-status" data-status={pbi.status || 'draft'}>
              {pbi.status || 'draft'}
            </div>
            <h3>{pbi.title}</h3>
            <p className="pbi-summary">{pbi.summary}</p>
            {pbi.user_story && (
              <p className="pbi-story">👤 {pbi.user_story.substring(0, 80)}...</p>
            )}
            <div className="pbi-meta">
              <span>Created: {new Date(pbi.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PBIList;
