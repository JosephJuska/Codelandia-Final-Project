const generateFileName = (fileExtension) => {
    return `${Date.now()}.${fileExtension}`;
}

module.exports = generateFileName;