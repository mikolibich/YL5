const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let events = [
  {
    created_at: "2025-01-01T12:00:00Z",
    event_id: 1,
    event_type: { id: 100, name: "Cancer Screening" },
    start_datetime: "2025-12-01T18:00:00Z",
    end_datetime: "2025-12-01T21:00:00Z",
    title: "Breast Cancer Screening Event",
    updated_at: "2025-01-01T12:00:00Z",
    venue: {
      id: 10,
      name: "City Hall",
      address: "123 Main St",
      city: "Testville",
      postcode: "12345",
      max_capacity: 500,
    },
    description: "A description of the breast cancer screening event.",
    event_capacity: 500,
    image: "https://via.placeholder.com/150",
    status: "UP",
  },
  {
    created_at: "2025-01-01T12:00:00Z",
    event_id: 5,
    event_type: { id: 100, name: "Cancer Screening" },
    start_datetime: "2025-12-01T18:00:00Z",
    end_datetime: "2025-12-01T21:00:00Z",
    title: "Cervical Cancer Screening Event",
    updated_at: "2025-01-01T12:00:00Z",
    venue: {
      id: 50,
      name: "City Hall",
      address: "123 Main St",
      city: "Testville",
      postcode: "12345",
      max_capacity: 500,
    },
    description: "A description of the screening event.",
    event_capacity: 500,
    image: "https://via.placeholder.com/150",
    status: "UP",
  },
  {
    created_at: "2025-01-01T12:00:00Z",
    event_id: 50,
    event_type: { id: 100, name: "Check up" },
    start_datetime: "2025-12-01T18:00:00Z",
    end_datetime: "2025-12-01T21:00:00Z",
    title: "Free check up with doctor Event",
    updated_at: "2025-01-01T12:00:00Z",
    venue: {
      id: 10,
      name: "City Hall",
      address: "123 Main St",
      city: "Testville",
      postcode: "12345",
      max_capacity: 500,
    },
    description: "A description of the event.",
    event_capacity: 500,
    image: "https://via.placeholder.com/150",
    status: "UP",
  },
];

// GET all events with optional filters, search, and ordering
app.get("/events", (req, res) => {
  let result = [...events];

  const { event_type, status, venue, search, ordering } = req.query;

  if (event_type) {
    result = result.filter(
      (e) => String(e.event_type.id) === String(event_type)
    );
  }

  if (status) {
    result = result.filter((e) => e.status === status);
  }

  if (venue) {
    result = result.filter((e) => String(e.venue.id) === String(venue));
  }

  if (search) {
    const lower = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower)
    );
  }

  if (ordering && result.length > 0) {
    result = result.sort((a, b) =>
      String(a[ordering]).localeCompare(String(b[ordering]))
    );
  }

  res.json(result);
});

// GET event by ID
app.get("/events/:id", (req, res) => {
  const eventId = Number(req.params.id);
  const event = events.find((e) => e.event_id === eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));
