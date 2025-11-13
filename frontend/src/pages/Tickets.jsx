import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";

export default function MyTickets() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  return (
    <div id="savedEventsWrapper">
      <h1 id="savedEventsText" className="blackText centerAlign">
        Saved Events
      </h1>

      <div id="upcomingEvents" className="blackText">
        <div id="eventListingContainer">
          {bookings.length === 0 ? (
            <p>No saved events yet.</p>
          ) : (
            bookings.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                description={event.description}
                location={event.location}
                spaces={event.spaces}
                isMyTickets={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
