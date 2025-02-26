// src/view/components/CalendarGrid.tsx
import React from 'react';
import { Event } from '../../types/Event';

interface CalendarGridProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  currentDate: Date;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  events,
  onEventClick,
  currentDate
}) => {
  const daysInMonth = getDaysInMonth(currentDate);

  return (
    <div className="calendar-grid">
      {daysInMonth.map((day, index) => (
        <div
          key={index}
          className={`calendar-cell ${isToday(day) ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day.getDate()}</span>
          {eventsForDay(events, day).map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onEventClick(event)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
