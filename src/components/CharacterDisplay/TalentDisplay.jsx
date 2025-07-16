import React, { useEffect, useState } from 'react';
import { fetchCharacterSpecialization } from '../../utils/blizzardApi';
import styles from './TalentDisplay.module.css';

const TalentDisplay = ({ realmSlug, characterName, apiConfig }) => {
  const [specializationData, setSpecializationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpecializationData = async () => {
      if (!realmSlug || !characterName || !apiConfig) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCharacterSpecialization(realmSlug, characterName, apiConfig);
        setSpecializationData(data);
      } catch (err) {
        console.error('Failed to load specialization data:', err);
        setError('Failed to load talent data');
      } finally {
        setLoading(false);
      }
    };

    loadSpecializationData();
  }, [realmSlug, characterName, apiConfig]);

  const renderLoadingState = () => (
    <div className={styles.talentContainer}>
      <div className={styles.talentHeader}>
        <h3 className={styles.characterName}>Loading Talents...</h3>
      </div>
      <div className={styles.talentContent}>
        <div className={styles.loadingSpinner}></div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className={styles.talentContainer}>
      <div className={styles.talentHeader}>
        <h3 className={styles.characterName}>Error Loading Talents</h3>
      </div>
      <div className={styles.talentContent}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    </div>
  );

  const renderSpecialization = (spec) => {
    if (!spec) return null;

    return (
      <div className={styles.specializationSection}>
        <div className={styles.specHeader}>
          <h4 className={styles.specName}>{spec.specialization?.name}</h4>
          <span className={styles.specRole}>{spec.specialization?.role?.name}</span>
        </div>
        
        {spec.talents && spec.talents.length > 0 && (
          <div className={styles.talentsGrid}>
            {spec.talents.map((talent, index) => (
              <div key={index} className={styles.talentItem}>
                <div className={styles.talentIcon}>
                  <div className={styles.talentTier}>{talent.tier}</div>
                </div>
                <div className={styles.talentInfo}>
                  <div className={styles.talentName}>{talent.talent?.name}</div>
                  <div className={styles.talentDescription}>
                    {talent.talent?.description || 'No description available'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {spec.pvp_talents && spec.pvp_talents.length > 0 && (
          <div className={styles.pvpTalentsSection}>
            <h5 className={styles.pvpHeader}>PvP Talents</h5>
            <div className={styles.pvpTalentsGrid}>
              {spec.pvp_talents.map((pvpTalent, index) => (
                <div key={index} className={styles.pvpTalentItem}>
                  <div className={styles.talentInfo}>
                    <div className={styles.talentName}>{pvpTalent.talent?.name}</div>
                    <div className={styles.talentDescription}>
                      {pvpTalent.talent?.description || 'No description available'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (!specializationData) return null;

  return (
    <div className={styles.talentContainer}>
      <div className={styles.talentHeader}>
        <h3 className={styles.characterName}>{characterName} - Talents</h3>
      </div>
      
      <div className={styles.talentContent}>
        {specializationData.active_specialization && (
          <div className={styles.activeSpecSection}>
            <h4 className={styles.sectionTitle}>Active Specialization</h4>
            {renderSpecialization(specializationData.active_specialization)}
          </div>
        )}

        {specializationData.specializations && specializationData.specializations.length > 0 && (
          <div className={styles.allSpecsSection}>
            <h4 className={styles.sectionTitle}>All Specializations</h4>
            {specializationData.specializations.map((spec, index) => (
              <div key={index} className={styles.specWrapper}>
                {renderSpecialization(spec)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentDisplay;