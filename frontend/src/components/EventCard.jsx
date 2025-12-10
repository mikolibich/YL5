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
  isMyTickets = false,
  isLiked = false,
  isGuest = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  const storedSpaces = JSON.parse(localStorage.getItem("spaces")) || {};
  const initialSpacesLeft = storedSpaces[title] ?? event_capacity;

  const [spacesLeft, setSpacesLeft] = useState(initialSpacesLeft);

  const updateSpacesLeft = (newValue) => {
    const currentSpaces = JSON.parse(localStorage.getItem("spaces")) || {};
    currentSpaces[title] = newValue;
    localStorage.setItem("spaces", JSON.stringify(currentSpaces));
  };

  const removeBooking = () => {
    let currentBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    currentBookings = currentBookings.filter((b) => b.title !== title);
    localStorage.setItem("bookings", JSON.stringify(currentBookings));

    const newSpaces = spacesLeft + 1;
    setSpacesLeft(newSpaces);
    updateSpacesLeft(newSpaces);

    alert(`${title} removed from your bookings!`);
    setVisible(false);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();

    if (spacesLeft <= 0) {
      alert("No spaces left!");
      return;
    }

    const currentBookings = JSON.parse(localStorage.getItem("bookings")) || [];

    if (!currentBookings.some((b) => b.title === title)) {
      currentBookings.push({
        title,
        description,
        venue,
        start_datetime,
        end_datetime,
      });
      localStorage.setItem("bookings", JSON.stringify(currentBookings));

      const newSpaces = spacesLeft - 1;
      setSpacesLeft(newSpaces);
      updateSpacesLeft(newSpaces);

      alert(`${title} added to your bookings!`);
    } else {
      alert(`${title} is already in your bookings`);
    }
  };

  if (!visible) return null;

  return (
    <section
      className="eventListing"
      id="eventCard"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {image && <img src={image} alt={title} />}

      <h3>{title}</h3>

      {!isExpanded && <p>Read more...</p>}

      {isExpanded && (
        <>
          <p>Description: {description}</p>
          <p>
            Venue: {venue?.name}, {venue?.city}, {venue?.address} (
            {venue?.postcode})
          </p>
          <p>Start: {new Date(start_datetime).toLocaleString()}</p>
          <p>End: {new Date(end_datetime).toLocaleString()}</p>

          {/* NEW: Spaces Left */}
          <p>Spaces left: {spacesLeft}</p>

          <h3>Tags</h3>
          <div className="tag">Type: {event_type?.name || "N/A"}</div>

          {!isGuest && (
            <>
              {isLiked ? (
                <button
                  id="unlikeButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    let likedEvents =
                      JSON.parse(localStorage.getItem("liked events")) || [];
                    likedEvents = likedEvents.filter((b) => b.title !== title);
                    localStorage.setItem(
                      "liked events",
                      JSON.stringify(likedEvents)
                    );
                    alert(`${title} removed from your liked events!`);
                    setVisible(false);
                  }}
                >
                  Unlike
                </button>
              ) : isMyTickets ? (
                <button
                  className="button"
                  id="deleteButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBooking();
                  }}
                >
                  Cancel booking
                </button>
              ) : (
                <div className="buttonGroup">
                  <button
                    className="button"
                    id="addButton"
                    onClick={handleButtonClick}
                  >
                    Book Event
                  </button>
                  <button
                    className="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const likedEvents =
                        JSON.parse(localStorage.getItem("liked events")) || [];
                      if (!likedEvents.some((b) => b.title === title)) {
                        likedEvents.push({
                          title,
                          description,
                          venue,
                          start_datetime,
                          end_datetime,
                        });
                        localStorage.setItem(
                          "liked events",
                          JSON.stringify(likedEvents)
                        );
                        alert(`${title} added to your liked events!`);
                      } else {
                        alert(`${title} is already in your liked events`);
                      }
                    }}
                  >
                    Like
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
