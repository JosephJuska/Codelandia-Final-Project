export default function truncateText(text, length) {
    const truncated = text && text.length > length ? text.slice(0, length) + '...' : text;
    return truncated;
};