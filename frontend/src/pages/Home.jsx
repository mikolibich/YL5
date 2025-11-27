import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import { fetchEvents } from "../api/events";

export default function Home() {
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
      <div id="welcomeText" className="headingText">
        <h1 className="blackText leftAlign">Welcome back!</h1>
      </div>

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
