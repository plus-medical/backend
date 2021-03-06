const aws = require('aws-sdk');
const Boom = require('@hapi/boom');
const { config: { s3AccessKeyId, s3SecretAccessKey, s3Bucket } } = require('../../config');
const randomString = require('./randomString');

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: s3AccessKeyId,
  secretAccessKey: s3SecretAccessKey,
});

function uploadFile(file, prefix) {
  return new Promise((resolve, reject) => {
    const date = new Date().getTime();
    const random = randomString(10);
    const filename = file.originalname.split('.');
    const ext = filename[filename.length - 1];
    const hash = `${prefix && prefix}${date}${random}.${ext}`;

    const params = {
      Bucket: s3Bucket,
      Key: hash,
      Body: file.buffer,
      ACL: 'public-read',
    };

    s3.upload(params, (err, result) => {
      if (err) reject(Boom.internal(err));
      else resolve(result);
    });
  });
}

module.exports = uploadFile;
