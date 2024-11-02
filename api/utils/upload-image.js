const generateFileName = require('./generate-file-name');
const { ProcessError, ProcessSuccess } = require('./process-result');
const generateStaticPath = require('./generate-static-path');
const logData = require('../utils/log-data');
const loggingData = require('../utils/log-data-object');

const fs = require('fs');
const LoggingData = require('../utils/log-data-object');

const uploadImage = async (image, imagePathGenerator, staticPath = null) => {
    let logEntry;
    const fileName = generateFileName(image.mimetype.split('/')[1]);
    const filePath = imagePathGenerator(fileName);
    fs.writeFile(filePath, image.buffer, (e) => {
        logEntry = new LoggingData(
            e,
            null,
            e
        );
        logData(logEntry, 'image-upload');
        if(e) return new ProcessError(null, true);
    });

    logEntry = new LoggingData(
        'Image uploaded successfully',
        {
            filePath: filePath
        },
        null
    );
    logData(logEntry, 'image-upload');
    const path = generateStaticPath(staticPath + fileName);
    return new ProcessSuccess(path);
};

module.exports = uploadImage;