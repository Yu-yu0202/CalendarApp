// src/view/components/EventCard.tsx
import React from 'react';
import { Event } from '../../types/Event';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick
}) => {
  return (
    <div
      className="event-card"
      onClick={onClick}
    >
      <div className="event-title">{event.title}</div>
      <div className="event-time">
        {formatTime(event.startTime)} - {formatTime(event.endTime)}
      </div>
      {event.description && (
        <div className="event-description">
          {event.description}
        </div>
      )}
    </div>
  );
};