const rawBaseUrl = process.env.REACT_APP_API_BASE_URL;
const isInvalidBaseUrl = !rawBaseUrl || rawBaseUrl === 'false' || rawBaseUrl === 'undefined' || rawBaseUrl === 'null';
const API_BASE_URL = isInvalidBaseUrl ? 'http://localhost:8000' : rawBaseUrl;

export const fetchShows = async () => {
  const response = await fetch(`${API_BASE_URL}/shows`);

  if (!response.ok) {
    throw new Error('Failed to fetch shows');
  }

  return response.json();
};

export const createShow = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/shows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create show');
  }

  return response.json();
};
