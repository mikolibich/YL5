import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";

export default function Liked() {
  const [likedEvents, setLikedEvents] = useState([]);

  useEffect(() => {
    const storedLikedEvents =
      JSON.parse(localStorage.getItem("liked events")) || [];
    setLikedEvents(storedLikedEvents);
  }, []);

  return (
    <div id="savedEventsWrapper">
      <h1 id="savedEventsText" className="blackText centerAlign">
        Liked Events
      </h1>

      <div id="upcomingEvents" className="blackText">
        <div id="eventListingContainer">
          {likedEvents.length === 0 ? (
            <p>No saved events yet.</p>
          ) : (
            likedEvents.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                description={event.description}
                venue={event.venue}
                start_datetime={event.start_datetime}
                end_datetime={event.end_datetime}
                event_capacity={event.event_capacity}
                isMyTickets={false}
                isLiked={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
