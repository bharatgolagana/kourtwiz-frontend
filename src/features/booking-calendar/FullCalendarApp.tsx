import { useState, useEffect, JSX, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import './Calendar.css';

import 'react-calendar/dist/Calendar.css';
import AuthContext from '../../context/AuthContext';
import { fetchCourts } from './api/getCourts';
import { fetchBookings } from './api/getbookings';

function FullCalendarApp(): JSX.Element {
    const { user } = useContext(AuthContext)!;
    const clubId = user?.currentActiveClubId;
    const [courtsResponse, setCourtsResponse] = useState<{ id: string; name: string }[]>([]);
    const [courtsLoading, setCourtsLoading] = useState(true);
    const [courtsError, setCourtsError] = useState('');
    const [schedules, setSchedules] = useState({ events: [] });
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [eventsError, setEventsError] = useState('');
    const renderEventContent = (arg) => {
        const { event } = arg;
        const isCourtBooking = event.title === 'Reserved'; 
        const isFull = event.extendedProps.openSessionFull;
        let backgroundColor = 'grey'; 
        if (isCourtBooking) {
            backgroundColor = 'red'; 
        } else if (isFull) {
            backgroundColor = 'blue'; 
        }
        return (
            <div
                style={{
                fontSize: '14px',
                padding: '5px',
                height: '100%',
                whiteSpace: 'normal',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor, 
                color: isCourtBooking ? 'white' : 'black', 
                borderRadius: '4px',
                }}
            >
                {isCourtBooking ? (
                <p style={{ fontWeight: 'bold', margin: 0 }}>Reserved</p>
                ) : (
                <>
                    
                    <p style={{ fontWeight: 'bold', margin: 0 }}>{event.extendedProps.skillLevel} - OPEN PLAY</p>
        
    
                    <p style={{ margin: 0 }}>
                    {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
        
                    
                    {isFull ? (
                    <p style={{ backgroundColor: 'red', color: 'white', padding: '2px 5px', borderRadius: '4px', margin: 0 }}>
                        FULL
                    </p>
                    ) : (
                    <p style={{ margin: 0 }}>
                        {event.extendedProps?.slotsRemaining} of {event.extendedProps.totalSlots} slots left
                    </p>
                    )}
        
                    
                    <button
                    style={{
                        marginTop: '5px',
                        padding: '5px 10px',
                        backgroundColor: isFull ? 'gray' : 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={()=>alert(event.extendedProps?.skillLevel)}
                    >
                    {isFull ? 'Join Waitlist' : 'Reserve Court'}
                    </button>
                </>
                )}
            </div>
        );
    };
  
    useEffect(() => {
        const loadCourts = async () => {
          try {
            setCourtsLoading(true);
            const courts = await fetchCourts(clubId!);
            setCourtsResponse(courts);
          } catch (error) {
            setCourtsError(error.message);
          } finally {
            setCourtsLoading(false);
          }
        };
    
        if (clubId) loadCourts();
      }, [clubId]);

      useEffect(() => {
        const loadBookings = async () => {
          try {
            const bookings = await fetchBookings(clubId!);
            setEvents(bookings);
          } catch (error) {
            setEventsError(error.message);
          }
        };
    
        if (clubId) loadBookings();
      }, [clubId]);

    const handleDateChange = date => {
        console.log(date);
        setSelectedDate(date);
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
          plugins= {[ resourceTimeGridPlugin ]}
  initialView='resourceTimeGridDay'
        //   slotMinTime="09:00:00"
        //     slotMaxTime="23:00:00"
        //   headerToolbar={{
        //     center: 'timeGridDay',
        //   }}
        resources={courtsResponse}
          events={events}
          resourceAreaHeaderContent="Courts"
          eventBackgroundColor="#b3cde0"
          eventTextColor="#0f2657"
          nowIndicator
          views={{
            resourceTimelineDay: {
              slotHeight: 200, 
            },
          }}
          eventContent={renderEventContent}
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
