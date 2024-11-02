const { generate400BadRequest } = require("../utils/response-generator");

const imageMiddleware = (upload, fieldName, single = true) => {
    const uploadMiddleware = async (req, res, next) => {
        let handler;
        if(single) handler = upload.single(fieldName);
        else handler = upload.array(fieldName);
    
        handler(req, res, (err) => {
            if(err){
                if(err.message === 'Unexpected field') {
                    if(fieldName === err.field) return generate400BadRequest(res, 'Too many images');
                    else return generate400BadRequest(res, { [fileSize]:'Invalid image field: ' + err.fieldName });
                };

                if(err?.code === 'LIMIT_FILE_SIZE') {
                    return generate400BadRequest(res, { [fieldName]:'File size exceeds the maximum limit of ' + upload.fileSize });
                }

                return generate400BadRequest(res, { [fieldName]:'Error uploading image: ' + err.message });
    
            }else {
                next();
            }
        });
    };

    return uploadMiddleware;
};

module.exports = imageMiddleware;