import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";
import { Link } from "react-router-dom";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function GuestCalendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // controlled date

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/events/");
        const data = await res.json();

        const mappedEvents = data.map((event) => ({
          title: event.title,
          start: new Date(event.start_datetime),
          end: new Date(event.end_datetime),
          allDay: false,
        }));

        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  // Custom next/back handlers
  const handleNext = () => setCurrentDate(addMonths(currentDate, 1));
  const handleBack = () => setCurrentDate(subMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/guest">
        <img src="leftArrow.svg" alt="back" id="backArrowGuest" />
      </Link>
      <h1 className="blackText">Calendar</h1>

      {/* Custom navigation */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <button onClick={handleBack}>Back</button>
        <button onClick={handleToday}>Today</button>
        <button onClick={handleNext}>Next</button>
      </div>

      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        defaultView="month"
        views={["month"]}
        date={currentDate} // controlled date
        onNavigate={setCurrentDate} // sync navigation
        toolbar={false}
      />

      <nav id="navBar" class="centerAlign">
        <Link to="/guestcalendar">
          <img src="calendar.svg" className="calendarIcon"></img>
        </Link>
        <Link to="/GuestSettings">
          <img src="settings.svg" className="settingsIcon"></img>
        </Link>
      </nav>
    </div>
  );
}
