import React, { useState } from 'react';
import axios from 'axios';
import './PBIForm.css';

function PBIForm({ onPBICreated }) {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    userStory: '',
    acceptanceCriteria: ['']
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/pbis', formData);
      alert('PBI created successfully!');
      onPBICreated(response.data);
    } catch (error) {
      alert('Error creating PBI: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pbi-form-container">
      <div className="pbi-form">
        <h2>Create New PBI</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Self-service password reset"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Describe what needs to be done..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userStory">User Story</label>
            <textarea
              id="userStory"
              name="userStory"
              value={formData.userStory}
              onChange={handleInputChange}
              placeholder="As a [role], I want to [goal] so that [benefit]"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Acceptance Criteria</label>
            <div className="acceptance-criteria">
              {formData.acceptanceCriteria.map((ac, index) => (
                <div key={index} className="ac-item">
                  <textarea
                    value={ac}
                    onChange={(e) => handleACChange(index, e.target.value)}
                    placeholder={`Given... When... Then...`}
                    rows="2"
                  />
                  {formData.acceptanceCriteria.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeAC(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="btn-add-ac" onClick={addAC}>
              + Add Criterion
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : '✓ Create PBI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PBIForm;
