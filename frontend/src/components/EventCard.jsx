import { useState } from "react";

export default function EventCard({
  title,
  description,
  start_datetime,
  end_datetime,
  event_type,
  venue,
  event_capacity,
  image,
  status,
  isMyTickets = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  const removeBooking = () => {
    let currentBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    currentBookings = currentBookings.filter((b) => b.title !== title);
    localStorage.setItem("bookings", JSON.stringify(currentBookings));
    alert(`${title} removed from your bookings!`);
    setVisible(false);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    const currentBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    if (!currentBookings.some((b) => b.title === title)) {
      currentBookings.push({
        title,
        description,
        venue,
        start_datetime,
        end_datetime,
        event_capacity,
      });
      localStorage.setItem("bookings", JSON.stringify(currentBookings));
      alert(`${title} added to your bookings!`);
    } else {
      alert(`${title} is already in your bookings`);
    }
  };

  if (!visible) return null;

  return (
    <section
      className="eventListing"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {image && <img src={image} alt={title} />}

      <h3>{title}</h3>

      {!isExpanded && <p>Read more...</p>}

      {isExpanded && (
        <>
          <p>{description}</p>
          <p>Type: {event_type?.name || "N/A"}</p>
          <p>
            Venue: {venue?.name}, {venue?.city}, {venue?.address} (
            {venue?.postcode})
          </p>
          <p>Start: {new Date(start_datetime).toLocaleString()}</p>
          <p>End: {new Date(end_datetime).toLocaleString()}</p>
          <p>Capacity: {event_capacity}</p>
          <p>Status: {status}</p>

          {isMyTickets ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeBooking();
              }}
            >
              Delete from my bookings
            </button>
          ) : (
            <button onClick={handleButtonClick}>Add to my bookings</button>
          )}
        </>
      )}
    </section>
  );
}
