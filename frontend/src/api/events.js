export async function fetchEvents(filters = {}) {
  const baseUrl = "http://localhost:4000/events";

  const query = new URLSearchParams(filters).toString();
  const url = query ? `${baseUrl}?${query}` : baseUrl;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}
