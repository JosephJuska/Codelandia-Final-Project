const rgbToHex = (color) => {
    if(!color) return '';
    if(typeof color === "string") return color;
    const { r, g, b, a } = color?.metaColor ? color.metaColor : color;

    const rgbToHex = (value) => {
        const hex = Math.round(value).toString(16).padStart(2, '0');
        return hex;
    };

    const hex = `#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`;

    const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
    const hexWithAlpha = `${hex}${alphaHex}`;

    return hexWithAlpha;
};

export default rgbToHex;