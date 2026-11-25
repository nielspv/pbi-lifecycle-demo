import React, { useState } from 'react';
import axios from 'axios';
import './PBIDetail.css';
import DocumentViewer from './DocumentViewer';

function PBIDetail({ pbi, onBack, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [refineResult, setRefineResult] = useState(null);
  const [docsResult, setDocsResult] = useState(null);
  const [showDocViewer, setShowDocViewer] = useState(false);

  const runRefiner = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/pbis/${pbi.id}/refine`);
      setRefineResult(response.data);
    } catch (error) {
      alert('Error running refiner: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const runDocWriter = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/pbis/${pbi.id}/generate-docs`);
      setDocsResult(response.data);
      onUpdated();
    } catch (error) {
      alert('Error generating docs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pbi-detail-container">
      <button className="btn-back" onClick={onBack}>← Back to List</button>
      
      <div className="pbi-detail">
        <div className="pbi-header">
          <h1>{pbi.title}</h1>
          <span className="status" data-status={pbi.status || 'draft'}>
            {pbi.status || 'draft'}
          </span>
        </div>

        <div className="pbi-content">
          <section>
            <h2>Summary</h2>
            <p>{pbi.summary}</p>
          </section>

          <section>
            <h2>User Story</h2>
            <p>{pbi.user_story}</p>
          </section>

          <section>
            <h2>Acceptance Criteria</h2>
            {typeof pbi.acceptance_criteria === 'string' ? (
              <p>{pbi.acceptance_criteria}</p>
            ) : (
              <ul>
                {JSON.parse(pbi.acceptance_criteria || '[]').map((ac, i) => (
                  <li key={i}>{ac}</li>
                ))}
              </ul>
            )}
          </section>

          <div className="actions">
            <button 
              className="btn-action btn-refine" 
              onClick={runRefiner}
              disabled={loading}
            >
              🔍 {loading ? 'Refining...' : 'Run PBI Refiner'}
            </button>
            <button 
              className="btn-action btn-docs" 
              onClick={runDocWriter}
              disabled={loading}
            >
              📄 {loading ? 'Generating...' : 'Generate Documentation'}
            </button>
          </div>

          {refineResult && (
            <section className="result-section">
              <h2>🔍 Refiner Results</h2>
              <div className="verdict" data-verdict={refineResult.verdict}>
                Verdict: <strong>{refineResult.verdict}</strong>
              </div>
              
              <h3>Checklist</h3>
              <div className="checklist">
                {refineResult.checklist.map((item, i) => (
                  <div key={i} className="checklist-item" data-status={item.status}>
                    <span className="criterion">{item.criterion}</span>
                    <span className="item-status">{item.status}</span>
                    <p className="evidence">{item.evidence}</p>
                  </div>
                ))}
              </div>

              {refineResult.questions.length > 0 && (
                <>
                  <h3>Questions for Product Owner</h3>
                  <ol className="questions">
                    {refineResult.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </>
              )}
            </section>
          )}

          {docsResult && (
            <section className="result-section">
              <h2>📄 Documentation Generated</h2>
              <p className="success-message">✅ {docsResult.message}</p>
              <div className="doc-links">
                <a href={docsResult.pr_url} target="_blank" rel="noopener noreferrer" className="btn-link">
                  View Pull Request →
                </a>
                <button 
                  className="btn-link btn-view-doc"
                  onClick={() => setShowDocViewer(true)}
                >
                  View Document →
                </button>
              </div>
            </section>
          )}

          {showDocViewer && docsResult && (
            <DocumentViewer 
              title={pbi.title}
              markdown={docsResult.markdown}
              docxFilename={`${pbi.title}.docx`}
              pbiId={pbi.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PBIDetail;
