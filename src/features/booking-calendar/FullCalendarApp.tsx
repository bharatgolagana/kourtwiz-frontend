import { useState, useEffect, JSX } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import './Calendar.css';

import 'react-calendar/dist/Calendar.css';
const getScheduleData = async () => {
    return {
      events: [
        {
          reservation_id: '1',
          name: 'Match 1',
          date: '2025-04-02',
          time: '10:00:00',
          duration: 2, 
          court: 'court-1'
        },
        {
          reservation_id: '2',
          name: 'Match 2',
          date: '2025-04-02',
          time: '12:00:00',
          duration: 1.5, 
          court: 'court-2'
        },
        {
          reservation_id: '3',
          name: 'Match 3',
          date: '2025-04-02',
          time: '14:00:00',
          duration: 2, 
          court: 'court-3'
        }
      ]
    };
};

function FullCalendarApp(): JSX.Element {
  const [schedules, setSchedules] = useState({ events: [] });
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const data = await getScheduleData();
        setSchedules(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchScheduleData();
  }, [selectedDate]);

  const handleDateChange = date => {
    console.log(date);
    setSelectedDate(date);
  };

  const formatFullCalendarDate = (date, isStartTime = true) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = isStartTime ? '00' : '23';
    const minutes = isStartTime ? '00' : '59';
    const seconds = isStartTime ? '00' : '59';
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <div className="App">
      <div className="full-calendar">
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <FullCalendar
          key={selectedDate.toISOString()}
          height="auto"
          // contentHeight="auto"
          plugins={[resourceTimelinePlugin,dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="resourceTimelineDay"
          slotMinTime="09:00:00"
            slotMaxTime="23:00:00"
        //   headerToolbar={{
        //     center: 'timeGridDay',
        //   }}
        resources={[
            { id: 'court-1', title: 'Court 1' },
            { id: 'court-2', title: 'Court 2' },
            { id: 'court-3', title: 'Court 3' }
          ]}
          events={schedules.events.map(event => ({
            id: event.reservation_id,
            title: event.name,
            start: `${event.date}T${event.time}`,
            end: `${event.date}T${parseInt(event.time.split(':')[0]) + event.duration}:00:00`,
            resourceId: event.court,
          }))}
          resourceAreaHeaderContent="Courts"
          eventBackgroundColor="#b3cde0"
          eventTextColor="#0f2657"
          nowIndicator
          views={{
            dayGrid: {
              dayMaxEvents: 2,
            },
            timeGridWeek: {
              eventMaxStack: 1,
            },
            timeGridDay: {
              eventMaxStack: 5,
            },
          }}
          initialDate={formatFullCalendarDate(selectedDate)}
        />
      </div>
      {/* <div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="calendar"
        />
      </div> */}
    </div>
  );
}

export default FullCalendarApp;
