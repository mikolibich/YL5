import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import { fetchEvents } from "../api/events";
import { Link } from "react-router-dom";

export default function Guest() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        // Fetch all events (or add filters here)
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div id="homeWrapper">
      <div id="welcomeTextGuest" className="headingText">
        <Link to="/landing">
          <img src="leftArrow.svg" alt="back" id="backArrowGuest" />
        </Link>
        <h1 className="blackText leftAlign">Rose Foundation</h1>
      </div>

      <nav id="navBar" class="centerAlign">
        <Link to="/Login">
          <img src="calendar.svg" className="calendarIcon"></img>
        </Link>
        <Link to="/settings">
          <img src="settings.svg" className="settingsIcon"></img>
        </Link>
      </nav>

      <div id="upcomingEvents" className="blackText">
        <h2 className="blackText leftAlign">Upcoming events</h2>
        <div id="eventListingContainer">
          {events.map((event) => (
            <EventCard
              key={event.event_id}
              title={event.title}
              description={event.description}
              start_datetime={event.start_datetime}
              end_datetime={event.end_datetime}
              event_type={event.event_type}
              venue={event.venue}
              event_capacity={event.event_capacity}
              image={event.image}
              status={event.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
