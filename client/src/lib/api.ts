// src/lib/api.ts

// Na Netlify-u postavi varijablu: VITE_API_URL = https://web-project-4ezy.onrender.com/api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  // USERS
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (uid: string) => `${API_BASE_URL}/users/${uid}`,

  // PREFERENCES
  USER_PREFERENCES: (uid: string) => `${API_BASE_URL}/users/${uid}/preferences`,
  USER_FOOD_PREFERENCES: (uid: string) =>
    `${API_BASE_URL}/users/${uid}/food-preferences`,

  // DESTINATIONS & STATS
  WEATHER: (city: string) =>
    `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`,

  COSTS: (city: string, country: string) =>
    `${API_BASE_URL}/costs?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,

  FLIGHTS: (city: string, uid: string) =>
    `${API_BASE_URL}/flights?city=${encodeURIComponent(city)}&uid=${uid}`,

  HOTEL_STATS: (city: string) =>
    `${API_BASE_URL}/hotels/stats?city=${encodeURIComponent(city)}`,
};

export default API_BASE_URL;
