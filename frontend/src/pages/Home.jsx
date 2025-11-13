import { useState } from "react";
import EventCard from "../components/EventCard";

export default function Home() {
  const events = [
    {
      title: "Event 1",
      description: "Description 1",
      location: "Location 1",
      spaces: 10,
    },
    {
      title: "Event 2",
      description: "Description 2",
      location: "Location 2",
      spaces: 5,
    },
    {
      title: "Event 3",
      description: "Description 3",
      location: "Location 3",
      spaces: 2,
    },
    {
      title: "Event 4",
      description: "Description 4",
      location: "Location 4",
      spaces: 0,
    },
  ];

  return (
    <div id="homeWrapper">
      <div id="welcomeText" className="headingText">
        <h1 className="blackText leftAlign">Welcome back!</h1>
      </div>

      <div id="upcomingEvents" className="blackText">
        <h2 className="blackText leftAlign">Upcoming events</h2>
        <div id="eventListingContainer">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              description={event.description}
              location={event.location}
              spaces={event.spaces}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
