const multer = require('multer');

const uploadStorage = multer.memoryStorage();

const uploadBlogImageAbstract = {
    storage: uploadStorage,
    limits: { fileSize: 1024 * 300}, // 300 KB,
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Uploaded file must be an image'), false);
        }

        return cb(false, true);
    }
};

const uploadBlogImage = multer(uploadBlogImageAbstract);

uploadBlogImage.fileSize = '300KB';

const uploadBlogBanner = multer({
    ...uploadBlogImageAbstract,
    limits: { fileSize: 1024*1024 }, // 1MB
});

uploadBlogBanner.fileSize = '1MB';

const uploadCategoryImageAbstract = {
    storage: uploadStorage,
    limits: { fileSize: 1024 * 100 }, // 100kb
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Uploaded file must be an image'), false);
        }

        return cb(false, true);
    }
};

const uploadCategoryImage = multer(uploadCategoryImageAbstract);

uploadCategoryImage.fileSize = '100KB';

const uploadBrandImageAbstract = {
    limits: { fileSize: 1024 * 10 }, // 10KB
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Uploaded file must be an image'), false);
        }

        return cb(false, true);
    }
};

const uploadBrandImage = multer(uploadBrandImageAbstract);

uploadBrandImage.fileSize = '10KB';

const uploadTeamMemberImageAbstract = {
    limits: { fileSize: 1024 * 50 }, // 50KB
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Uploaded file must be an image'), false);
        }

        return cb(false, true);
    }
};

const uploadTeamMemberImage = multer(uploadTeamMemberImageAbstract);

uploadTeamMemberImage.fileSize = '50KB';

const uploadBannerImageAbstract = {
    limits: { fileSize: 1024 * 1024 * 10 }, // 10MB
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Uploaded file must be an image'), false);
        }

        return cb(false, true);
    }
};

const uploadBannerImage = multer(uploadBannerImageAbstract);

uploadBannerImage.fileSize = '10MB';

const uploadProductImageAbstract = {
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Uploaded file must be an image'), false);
        }

        return cb(false, true);
    }
};

const uploadProductImage = multer(uploadProductImageAbstract);

uploadBannerImage.fileSize = '2MB';

module.exports = {
    uploadBlogImage,
    uploadBlogBanner,
    uploadCategoryImage,
    uploadBrandImage,
    uploadTeamMemberImage,
    uploadBannerImage,
    uploadProductImage
};