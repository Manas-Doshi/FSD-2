import { memo, useEffect } from 'react';
import { CATEGORIES } from './data.js';

function EventCardBase({ event, onDragStart, onRender }) {
  useEffect(() => {
    onRender(event.id);
  });

  return (
    <div
      className="event-card"
      style={{ borderLeftColor: CATEGORIES[event.category].color }}
      draggable
      onDragStart={(e) => onDragStart(e, event.id)}
    >
      <span className="event-card__time">{event.time}</span>
      <span className="event-card__title">{event.title}</span>
    </div>
  );
}

export const EventCard = memo(EventCardBase);
export const EventCardUnmemoized = EventCardBase;
