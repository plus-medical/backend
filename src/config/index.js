require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 3000,
  dbPassword: process.env.DB_PASSWORD,
  dbUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  businessMail: process.env.BUSINESS_MAIL,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  s3Bucket: process.env.S3_BUCKET,
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
};

module.exports = { config };
