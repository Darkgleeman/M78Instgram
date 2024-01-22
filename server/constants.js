const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 20MB in bytes

// Allowed file types
const ALLOWED_MEDIA_TYPES = new Set([
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

module.exports = {
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE,
  ALLOWED_MEDIA_TYPES,
};
