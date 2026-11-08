// Central API base URL configuration
// Normalizes trailing slash automatically to avoid duplicate slashes in endpoints
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://backend-symecs-attendence.vercel.app'
).replace(/\/+$/, '');
