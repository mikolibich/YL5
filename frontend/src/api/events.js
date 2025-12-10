export async function fetchEvents(filters = {}) {
  const baseUrl = "http://127.0.0.2:8000/api/events/";

  // Convert filters into URL query parameters
  const params = new URLSearchParams(filters).toString();
  const url = params ? `${baseUrl}?${params}` : baseUrl;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }

  return res.json();
}
