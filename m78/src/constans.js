// default one minute
export const POLLING_INTERVAL = 3000; // Corrected to 60000 for one minute
export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 5MB in bytes

// Allowed file types
export const MEDIA_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/ogg',
]);
