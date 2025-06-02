export const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'; // Handle 0 or invalid input

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString();
    } catch (e) {
        return 'Invalid Date';
    }
};


export const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Import 'formatDistanceToNow' from 'date-fns' where you use this
        // For simplicity here, just returning the string
        // Example: return `${formatDistanceToNow(new Date(dateString))} ago`;
        return new Date(dateString).toLocaleDateString(); // Simple fallback
    } catch (e) {
        return 'Invalid Date';
    }
};