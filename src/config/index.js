require("dotenv").config();

const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 3000,
  dbPassword: process.env.DB_PASSWORD,
  dbUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  businessMail: process.env.BUSINESS_MAIL,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
};

module.exports = { config };
