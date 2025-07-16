import { useEffect, useState } from 'react';
import { fetchGuildRoster } from './utils/blizzardApi';

export default function GuildRoster() {
  const [members, setMembers] = useState([]);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetchGuildRoster('area-52', 'YourGuildName')
      .then(setMembers)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Guild Roster</h2>
      <ul>
        {members.map(m => (
          <li key={m.character.id}>
            {m.character.name} — {m.character.playable_class.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
