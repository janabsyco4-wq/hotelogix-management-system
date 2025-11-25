/**
 * Helper function to convert ID to string for MongoDB
 * Handles both integer IDs (from old SQLite) and string ObjectIds
 */
const convertToMongoId = (id) => {
  // If it's already a string, return as is
  if (typeof id === 'string') {
    return id;
  }
  
  // If it's a number, convert to string
  if (typeof id === 'number') {
    return id.toString();
  }
  
  // Otherwise return as string
  return String(id);
};

module.exports = { convertToMongoId };
