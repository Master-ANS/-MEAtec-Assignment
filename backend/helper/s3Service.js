const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT, 
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

const bucketName = process.env.S3_BUCKET_NAME;

const uploadFile = async (key, body, contentType) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType
    };
    return s3.upload(params).promise();
};

const deleteFile = async (key) => {
    const params = {
        Bucket: bucketName,
        Key: key
    };
    return s3.deleteObject(params).promise();
};

const getFileUrl = (key) => {
    return s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: key,
        Expires: 60 * 60 // 1 hour
    });
};

module.exports = { uploadFile, deleteFile, getFileUrl };
