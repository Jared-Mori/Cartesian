import { useState } from 'react';
import styles from './GuildEvents.module.css';

function GuildEvents({ events, onEventsChange }) {
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'raid',
    description: ''
  });

  const saveEvents = (updatedEvents) => {
    localStorage.setItem('cartesian-guild-events', JSON.stringify(updatedEvents));
    onEventsChange(updatedEvents);
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert('Please fill in all required fields');
      return;
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      createdAt: new Date().toISOString(),
      attendees: []
    };

    const updatedEvents = [...events, event];
    saveEvents(updatedEvents);
    
    setNewEvent({
      title: '',
      date: '',
      time: '',
      type: 'raid',
      description: ''
    });
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    saveEvents(updatedEvents);
  };

  const toggleAttendance = (eventId) => {
    const playerName = prompt('Enter character name:');
    if (!playerName) return;

    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const attendees = event.attendees || [];
        const isAttending = attendees.includes(playerName);
        
        return {
          ...event,
          attendees: isAttending 
            ? attendees.filter(name => name !== playerName)
            : [...attendees, playerName]
        };
      }
      return event;
    });
    
    saveEvents(updatedEvents);
  };

  return (
    <div className={styles.eventsSection}>
      <div className={styles.addEventForm}>
        <h3>Create New Event</h3>
        <div className={styles.formRow}>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            className={styles.formInput}
          />
          <select
            value={newEvent.type}
            onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
            className={styles.formSelect}
          >
            <option value="raid">Raid</option>
            <option value="dungeon">Dungeon</option>
            <option value="pvp">PvP</option>
            <option value="social">Social</option>
            <option value="meeting">Guild Meeting</option>
          </select>
        </div>
        <div className={styles.formRow}>
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
            className={styles.formInput}
          />
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
            className={styles.formInput}
          />
        </div>
        <textarea
          placeholder="Event Description (optional)"
          value={newEvent.description}
          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
          className={styles.formTextarea}
        />
        <button onClick={addEvent} className={styles.addButton}>Create Event</button>
      </div>

      <div className={styles.eventsList}>
        <h3>Upcoming Events</h3>
        {events.length === 0 ? (
          <p className={styles.noEvents}>No events scheduled</p>
        ) : (
          events
            .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
            .map(event => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <h4>{event.title}</h4>
                  <span className={styles.eventType}>{event.type}</span>
                </div>
                <div className={styles.eventDetails}>
                  <p><strong>Date:</strong> {event.date} at {event.time}</p>
                  {event.description && <p><strong>Description:</strong> {event.description}</p>}
                  <p><strong>Attendees:</strong> {event.attendees?.length || 0}</p>
                  {event.attendees?.length > 0 && (
                    <div className={styles.attendeesList}>
                      {event.attendees.map(name => (
                        <span key={name} className={styles.attendeeBadge}>{name}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.eventActions}>
                  <button 
                    onClick={() => toggleAttendance(event.id)}
                    className={styles.attendButton}
                  >
                    Toggle Attendance
                  </button>
                  <button 
                    onClick={() => deleteEvent(event.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default GuildEvents;
