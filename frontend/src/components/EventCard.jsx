import { useState } from "react";

export default function EventCard({
  title,
  description,
  location,
  spaces,
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
    if (isMyTickets && onRemove) {
      onRemove();
    } else {
      const currentBookings =
        JSON.parse(localStorage.getItem("bookings")) || [];
      if (!currentBookings.some((b) => b.title === title)) {
        currentBookings.push({ title, description, location, spaces });
        localStorage.setItem("bookings", JSON.stringify(currentBookings));
        alert(`${title} added to your bookings!`);
      } else {
        alert(`${title} is already in your bookings`);
      }
    }
  };

  if (!visible) return null;

  return (
    <section
      className="eventListing"
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ cursor: "pointer" }}
    >
      <h3 className="eventTitle">{title}</h3>

      {!isExpanded && <p>Read more...</p>}

      {isExpanded && (
        <>
          <p className="eventDescription">{description}</p>
          <p className="eventLocation">{location}</p>
          <p className="eventSpaces">There are {spaces} spaces left</p>
          {isMyTickets ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeBooking();
              }}
            >
              Delete from my bookings
            </button>
          ) : (
            <button type="button" onClick={handleButtonClick}>
              {isMyTickets ? "Delete from my bookings" : "Add to my bookings"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
