import { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchCartesianGuildRoster } from './utils/blizzardApi';
import GuildDashboard from './components/GuildDashboard/GuildDashboard';
import CharacterDisplay from './components/CharacterDisplay/CharacterDisplay';
import { getGuildApiConfig } from './utils/blizzardApi';
import './App.css';

function App() {
  const [rosterData, setRosterData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Memoize API config to prevent unnecessary re-renders
  const apiConfig = useMemo(() => getGuildApiConfig(), []);

  // Load Cartesian guild data on app start
  useEffect(() => {
    loadCartesianGuild();
  }, []);

  const loadCartesianGuild = async () => {
    setLoading(true);
    setError(null);
    setRosterData([]);
    
    try {
      const roster = await fetchCartesianGuildRoster();
      
      // Create a unique list of characters
      const uniqueCharacters = [];
      const seen = new Set();
      
      for (const member of roster) {
        const char = member.character;
        if (!seen.has(char.id)) {
          seen.add(char.id);
          uniqueCharacters.push({
            id: char.id,
            name: char.name,
            realm: char.realm.slug
          });
        }
      }

      setRosterData(uniqueCharacters);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading Cartesian guild roster');
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handlers for roster reordering
  const handleDragStart = useCallback((e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    
    setRosterData(currentRoster => {
      const newRoster = [...currentRoster];
      const [draggedItem] = newRoster.splice(draggedIndex, 1);
      newRoster.splice(dropIndex, 0, draggedItem);
      return newRoster;
    });
    
    setDraggedIndex(null);
  }, [draggedIndex]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  return (
    <div className="app-container">
      <GuildDashboard 
        rosterData={rosterData}
        loading={loading}
        error={error}
        onRefresh={loadCartesianGuild}
      />
      
      {/* Character Grid with Drag and Drop */}
      <div className="roster-section">
        <h2>Guild Roster</h2>
        {loading && <p className="loading-message">Loading guild roster...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        
        {!loading && !error && rosterData.length > 0 ? (
          <div className="roster-grid">
            {rosterData.map((character, index) => (
              <div
                key={character.id}
                className="roster-item"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                <CharacterDisplay 
                  realm={character.realm} 
                  characterName={character.name}
                  apiConfig={apiConfig}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === index}
                />
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <p className="no-roster">No roster data available</p>
          )
        )}
      </div>
    </div>
  );
}

export default App;
