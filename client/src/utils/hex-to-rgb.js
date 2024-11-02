const hexToRgb = (hex) => {
    if(!hex) return null;
    hex = hex.replace(/^#/, '');

    if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(char => char + char).join('');
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

    return { r, g, b, a };
};

export default hexToRgb;