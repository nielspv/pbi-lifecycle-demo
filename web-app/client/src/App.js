import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import PBIList from './components/PBIList';
import PBIForm from './components/PBIForm';
import PBIDetail from './components/PBIDetail';

function App() {
  const [pbis, setPbis] = useState([]);
  const [selectedPBI, setSelectedPBI] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'create', 'detail'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPBIs();
  }, []);

  const fetchPBIs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/pbis');
      setPbis(response.data);
    } catch (error) {
      console.error('Error fetching PBIs:', error);
      alert('Failed to fetch PBIs');
    } finally {
      setLoading(false);
    }
  };

  const handlePBICreated = (newPBI) => {
    setPbis([newPBI, ...pbis]);
    setView('list');
  };

  const handlePBIUpdated = async () => {
    fetchPBIs();
    setSelectedPBI(null);
  };

  const handleSelectPBI = (pbi) => {
    setSelectedPBI(pbi);
    setView('detail');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 PBI Lifecycle Assistant</h1>
        <p>Manage Product Backlog Items with AI-powered refinement and documentation</p>
      </header>

      <nav className="app-nav">
        <button 
          className={view === 'list' ? 'active' : ''} 
          onClick={() => { setView('list'); setSelectedPBI(null); }}
        >
          📋 PBIs
        </button>
        <button 
          className={view === 'create' ? 'active' : ''} 
          onClick={() => setView('create')}
        >
          ➕ Create PBI
        </button>
      </nav>

      <main className="app-main">
        {loading && <div className="spinner">Loading...</div>}
        
        {view === 'list' && !loading && (
          <PBIList pbis={pbis} onSelectPBI={handleSelectPBI} />
        )}
        
        {view === 'create' && (
          <PBIForm onPBICreated={handlePBICreated} />
        )}
        
        {view === 'detail' && selectedPBI && (
          <PBIDetail 
            pbi={selectedPBI} 
            onBack={() => { setView('list'); setSelectedPBI(null); }}
            onUpdated={handlePBIUpdated}
          />
        )}
      </main>
    </div>
  );
}

export default App;
