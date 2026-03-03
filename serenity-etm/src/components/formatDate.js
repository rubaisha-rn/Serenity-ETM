export default function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    const isThisYear = date.getFullYear() === now.getFullYear();

    const options = {
        day: 'numeric',
        month: 'short',
    }; 

    if (!isThisYear) {
        options.year = 'numeric';
    }

    return date.toLocaleDateString(undefined, options);
}