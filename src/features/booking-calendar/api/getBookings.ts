  import axios from 'axios';

  const eventColorMap: Record<string, string> = {
    'Open Play': '#DCECBE',          
    'Private Lesson': '#C6DFF8',    
    'Group Lesson': '#FDF4BB',       
    'Clinic': '#F0CDFD',            
    'Tournament': '#FFD6D6',         
    'League': '#D2D2D2',             
    'Coach Session': '#E6D8BE'
  };
  export const fetchBookings = async (clubId: string) => {
    if (!clubId) throw new Error('Club ID is required');

    const token = localStorage.getItem('jwtToken');
    const response = await axios.get(`http://44.216.113.234:8080/api/bookings/all-bookings/${clubId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { courtBooking, playTypeSession } = response.data;

    const formatDateTime = (dateArray: number[]) => {
      const [year, month, day, hour = 0, minute = 0] = dateArray;
      return new Date(year, month - 1, day, hour, minute);
    };

    const courtEvents = courtBooking.map((booking: any) => ({
      id: booking.id,
      title: 'Reserved',
      start: formatDateTime([...booking.date, ...booking.startTime]),
      end: formatDateTime([...booking.date, ...booking.endTime]),
      resourceId: booking.courtId,
      backgroundColor:'#575755'
    }));

    const playTypeEvents = playTypeSession.map((session: any) => {
      const start = formatDateTime(session.startTime);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + session.durationMinutes);
      const formattedTitle = session.playTypeName.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

      return {
        id: session.id,
        title: formattedTitle, 
        start,
        end,
        resourceId: session.courtId,
        backgroundColor: eventColorMap[formattedTitle] || '#ccc',
        extendedProps: {
          skillLevel: session.skillLevel,
          playTypeSession:session.playTypeName,
          slotsRemaining: session.maxPlayers - (session.registeredPlayers?.length || 0),
          totalSlots: session.maxPlayers,
          coachId:session.coachId,
          openSessionFull: session.sessionFull,
          eventRepeatType: session.eventRepeatType,
          repeatEndDate: formatDateTime(session.repeatEndDate),
          repeatInterval: session.repeatInterval,
        },
      };
    });

    return [...courtEvents, ...playTypeEvents];
  };
