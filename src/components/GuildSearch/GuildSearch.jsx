import { useState } from 'react';
import styles from './GuildSearch.module.css';

const REGIONS = {
  'us': { name: 'US', apiBase: 'https://us.api.blizzard.com' },
  'eu': { name: 'EU', apiBase: 'https://eu.api.blizzard.com' },
  'kr': { name: 'KR', apiBase: 'https://kr.api.blizzard.com' },
  'tw': { name: 'TW', apiBase: 'https://tw.api.blizzard.com' },
  'cn': { name: 'CN', apiBase: 'https://gateway.battlenet.com.cn' }
};

const LOCALES = {
  'us': [
    { code: 'en_US', name: 'English (United States)' },
    { code: 'es_MX', name: 'Spanish (Mexico)' },
    { code: 'pt_BR', name: 'Portuguese' }
  ],
  'eu': [
    { code: 'en_GB', name: 'English (Great Britain)' },
    { code: 'es_ES', name: 'Spanish (Spain)' },
    { code: 'fr_FR', name: 'French' },
    { code: 'de_DE', name: 'German' },
    { code: 'it_IT', name: 'Italian' },
    { code: 'ru_RU', name: 'Russian' }
  ],
  'kr': [
    { code: 'ko_KR', name: 'Korean' }
  ],
  'tw': [
    { code: 'zh_TW', name: 'Chinese (Traditional)' }
  ],
  'cn': [
    { code: 'zh_CN', name: 'Chinese (Simplified)' }
  ]
};

const VERSION_TYPES = {
  retail: 'Retail',
  classic: 'Classic Era',
  cataclysm: 'Cataclysm Classic'
};

function GuildSearch({ onSearch, isLoading }) {
  const [guildName, setGuildName] = useState('');
  const [realm, setRealm] = useState('');
  const [region, setRegion] = useState('us');
  const [locale, setLocale] = useState('en_US');
  const [version, setVersion] = useState('classic');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guildName.trim() || !realm.trim()) {
      alert('Please enter both guild name and realm');
      return;
    }
    
    const searchParams = {
      guildName: guildName.trim().toLowerCase(), // Convert to lowercase for API
      realm: realm.trim().toLowerCase().replace(/\s+/g, '-'), // Convert to lowercase and replace spaces with hyphens
      region,
      locale,
      version
    };
    
    onSearch(searchParams);
  };

  const availableLocales = LOCALES[region] || [{ code: 'en_US', name: 'English (United States)' }];
  
  // Update locale if current locale is not available for selected region
  if (!availableLocales.find(loc => loc.code === locale)) {
    setLocale(availableLocales[0].code);
  }

  return (
    <div className={styles.guildSearchPage}>
      <div className={styles.guildSearch}>
        <div className={styles.searchHeader}>
          <h1>World of Warcraft Guild Viewer</h1>
          <h2>Search for a Guild</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="guildName">Guild Name:</label>
              <input
                id="guildName"
                type="text"
                value={guildName}
                onChange={(e) => setGuildName(e.target.value)}
                placeholder="Enter guild name"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="realm">Realm:</label>
              <input
                id="realm"
                type="text"
                value={realm}
                onChange={(e) => setRealm(e.target.value)}
                placeholder="e.g. Stormrage, Area-52"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="region">Region:</label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={isLoading}
              >
                {Object.entries(REGIONS).map(([key, region]) => (
                  <option key={key} value={key}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="locale">Locale:</label>
              <select
                id="locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                disabled={isLoading}
              >
                {availableLocales.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="version">Version:</label>
              <select
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                disabled={isLoading}
              >
                {Object.entries(VERSION_TYPES).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={isLoading || !guildName.trim() || !realm.trim()}>
            {isLoading ? 'Searching...' : 'Search Guild'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GuildSearch;
