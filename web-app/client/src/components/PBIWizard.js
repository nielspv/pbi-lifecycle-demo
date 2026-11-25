import React, { useState } from 'react';
import './PBIWizard.css';

function PBIWizard({ onPBIComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    businessContext: '',
    userStory: '',
    businessValue: '',
    inScope: '',
    outOfScope: '',
    acceptanceCriteria: [''],
    dependencies: '',
    risks: '',
    estimate: '',
    nonFunctional: '',
  });

  const steps = [
    { num: 1, title: '📋 Basis Info', help: 'Wat wil je cre\u00ebren?' },
    { num: 2, title: '👤 User Story', help: 'Voor wie en waarom?' },
    { num: 3, title: '✅ Acceptance Criteria', help: 'Hoe weet je dat het klaar is?' },
    { num: 4, title: '📊 Scope & Risico\'s', help: 'Grenzen en afhankelijkheden' },
    { num: 5, title: '⚙️ Non-functioneel', help: 'Performance, beveiliging, etc.' },
    { num: 6, title: '📝 Review', help: 'Alles controleren' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleACChange = (index, value) => {
    const newAC = [...formData.acceptanceCriteria];
    newAC[index] = value;
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: newAC
    }));
  };

  const addAC = () => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }));
  };

  const removeAC = (index) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const validateStep = () => {
    if (step === 1 && !formData.title.trim()) {
      alert('Titel is verplicht!');
      return false;
    }
    if (step === 2 && !formData.userStory.trim()) {
      alert('User story is verplicht!');
      return false;
    }
    if (step === 3 && formData.acceptanceCriteria.filter(ac => ac.trim()).length === 0) {
      alert('Minstens 1 acceptance criterium is verplicht!');
      return false;
    }
    return true;
  };

  const handleComplete = () => {
    const pbi = {
      title: formData.title,
      summary: formData.summary,
      userStory: formData.userStory,
      acceptanceCriteria: formData.acceptanceCriteria.filter(ac => ac.trim())
    };
    onPBIComplete(pbi);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="wizard-step">
            <h3>📋 Wat wil je cre\u00ebren?</h3>
            <p className="step-help">Begin met de basisinformatie van je PBI.</p>
            
            <div className="form-group">
              <label>Titel *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="bijv. Invoice PO Number extraction"
              />
            </div>

            <div className="form-group">
              <label>Korte samenvatting</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Beschrijf in 1-2 zinnen wat dit PBI doet"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Business Context</label>
              <textarea
                name="businessContext"
                value={formData.businessContext}
                onChange={handleInputChange}
                placeholder="Waarom is dit belangrijk? Wat is het huidige probleem?"
                rows="3"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="wizard-step">
            <h3>👤 User Story</h3>
            <p className="step-help">Volg het formaat: "Als [rol], wil ik [actie], zodat [voordeel]"</p>
            
            <div className="form-group">
              <label>User Story *</label>
              <textarea
                name="userStory"
                value={formData.userStory}
                onChange={handleInputChange}
                placeholder="Als [rol], wil ik [actie], zodat [voordeel]"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Business Value / Baten</label>
              <textarea
                name="businessValue"
                value={formData.businessValue}
                onChange={handleInputChange}
                placeholder="Wat is de bedrijfswaarde? (bijv. '30% minder handmatige invoer')"
                rows="3"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="wizard-step">
            <h3>✅ Acceptance Criteria</h3>
            <p className="step-help">Minstens 3 criteria in Given/When/Then format</p>
            
            <div className="acceptance-criteria">
              {formData.acceptanceCriteria.map((ac, index) => (
                <div key={index} className="ac-item">
                  <label>Criterium {index + 1}</label>
                  <textarea
                    value={ac}
                    onChange={(e) => handleACChange(index, e.target.value)}
                    placeholder="Given [context], When [actie], Then [resultaat]"
                    rows="3"
                  />
                  {formData.acceptanceCriteria.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-ac"
                      onClick={() => removeAC(index)}
                    >
                      ✕ Verwijderen
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="btn-add-ac" onClick={addAC}>
              + Criterium toevoegen
            </button>
          </div>
        );

      case 4:
        return (
          <div className="wizard-step">
            <h3>📊 Scope & Risico's</h3>
            <p className="step-help">Definieer grenzen en identificeer afhankelijkheden</p>
            
            <div className="form-group">
              <label>In Scope (wat is wel inbegrepen)</label>
              <textarea
                name="inScope"
                value={formData.inScope}
                onChange={handleInputChange}
                placeholder="bijv. 'PO Number extraction, Confidence-based routing'"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Out of Scope (wat is expliciet niet inbegrepen)</label>
              <textarea
                name="outOfScope"
                value={formData.outOfScope}
                onChange={handleInputChange}
                placeholder="bijv. 'Invoice classification, PDF generation'"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Afhankelijkheden & Risico's</label>
              <textarea
                name="dependencies"
                value={formData.dependencies}
                onChange={handleInputChange}
                placeholder="bijv. 'Vereist OCR module v2.0, Risico: Document kwaliteit'"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Schatting (team sizing)</label>
              <input
                type="text"
                name="estimate"
                value={formData.estimate}
                onChange={handleInputChange}
                placeholder="bijv. 'Medium (8 story points)'"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="wizard-step">
            <h3>⚙️ Non-functionele Vereisten</h3>
            <p className="step-help">Performance, beveiliging, compliance, etc.</p>
            
            <div className="form-group">
              <label>Non-functionele Vereisten</label>
              <textarea
                name="nonFunctional"
                value={formData.nonFunctional}
                onChange={handleInputChange}
                placeholder="Security: PII hashing; Performance: &lt;2s processing; Compliance: GDPR artikel 7"
                rows="5"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="wizard-step">
            <h3>📝 Review je PBI</h3>
            <p className="step-help">Controleer alles voordat je het inlevert</p>
            
            <div className="review-box">
              <div className="review-item">
                <strong>Titel:</strong> {formData.title || '(niet ingevuld)'}
              </div>
              <div className="review-item">
                <strong>Samenvatting:</strong> {formData.summary || '(niet ingevuld)'}
              </div>
              <div className="review-item">
                <strong>User Story:</strong> {formData.userStory || '(niet ingevuld)'}
              </div>
              <div className="review-item">
                <strong>Business Value:</strong> {formData.businessValue || '(niet ingevuld)'}
              </div>
              <div className="review-item">
                <strong>In Scope:</strong> {formData.inScope || '(niet ingevuld)'}
              </div>
              <div className="review-item">
                <strong>Out of Scope:</strong> {formData.outOfScope || '(niet ingevuld)'}
              </div>
              <div className="review-item">
                <strong>Acceptance Criteria ({formData.acceptanceCriteria.filter(ac => ac.trim()).length}):</strong>
                <ul>
                  {formData.acceptanceCriteria.filter(ac => ac.trim()).map((ac, i) => (
                    <li key={i}>{ac}</li>
                  ))}
                </ul>
              </div>
              <div className="review-item">
                <strong>Afhankelijkheden:</strong> {formData.dependencies || '(niet ingevuld)'}
              </div>
              <div className="review-item">
                <strong>Schatting:</strong> {formData.estimate || '(niet ingevuld)'}
              </div>
              <div className="review-item">
                <strong>Non-functioneel:</strong> {formData.nonFunctional || '(niet ingevuld)'}
              </div>
            </div>

            <div className="dor-checklist">
              <h4>✅ Definition of Ready Checklist</h4>
              <ul>
                <li className={formData.title ? 'done' : 'pending'}>✓ Duidelijke titel</li>
                <li className={formData.summary ? 'done' : 'pending'}>✓ Samenvatting</li>
                <li className={formData.userStory ? 'done' : 'pending'}>✓ User Story (rol, actie, voordeel)</li>
                <li className={formData.businessValue ? 'done' : 'pending'}>✓ Business Value duidelijk</li>
                <li className={formData.acceptanceCriteria.filter(ac => ac.trim()).length >= 3 ? 'done' : 'pending'}>
                  ✓ Minstens 3 Acceptance Criteria
                </li>
                <li className={formData.inScope && formData.outOfScope ? 'done' : 'pending'}>
                  ✓ Scope grenzen helder
                </li>
                <li className={formData.dependencies ? 'done' : 'pending'}>✓ Afhankelijkheden geïdentificeerd</li>
                <li className={formData.estimate ? 'done' : 'pending'}>✓ Schatting gegeven</li>
                <li className={formData.nonFunctional ? 'done' : 'pending'}>✓ Non-functionele vereisten</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1>🚀 PBI Wizard (IDP Standaard)</h1>
        <p>Stap {step} van {steps.length}: {steps[step - 1].title}</p>
      </div>

      <div className="wizard-progress">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`progress-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}
          >
            <div className="step-number">{s.num}</div>
            <div className="step-label">{s.title}</div>
          </div>
        ))}
      </div>

      <div className="wizard-content">
        {renderStep()}
      </div>

      <div className="wizard-actions">
        {step > 1 && (
          <button className="btn-nav btn-prev" onClick={handlePrev}>
            ← Terug
          </button>
        )}
        {step < 6 && (
          <button className="btn-nav btn-next" onClick={handleNext}>
            Volgende →
          </button>
        )}
        {step === 6 && (
          <button className="btn-nav btn-submit" onClick={handleComplete}>
            ✓ PBI Creëren
          </button>
        )}
        <button className="btn-nav btn-cancel" onClick={onCancel}>
          Annuleren
        </button>
      </div>
    </div>
  );
}

export default PBIWizard;
