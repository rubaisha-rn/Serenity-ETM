/**
 * Utility function used to convert a timestamp into a short, human-readable data string.
 * Hides year when the date is from the current year.
 */

export default function formatDate(timestamp) {

    // Convert timestamp into a date object
    const date = new Date(timestamp);

    const now = new Date();

    // Check if provided date occurs in current year
    const isThisYear = date.getFullYear() === now.getFullYear();

    // Base formatting options for the date string
    const options = {
        day: 'numeric',
        month: 'short',
    }; 

    // If not this year, include the year in the output format as well
    if (!isThisYear) {
        options.year = 'numeric';
    }

    // Convert date string into localised string according to user's browser settings for user's preferred language and region
    return date.toLocaleDateString(undefined, options);
}