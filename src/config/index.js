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
  digitalOceanBucket: process.env.DIGITAL_OCEAN_BUCKET,
  digitalOceanAccessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY_ID,
  digitalOceanSecretAccessKey: process.env.DIGITAL_OCEAN_SECRET_ACCESS_KEY,
};

module.exports = { config };
