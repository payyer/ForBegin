const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 8000,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
};

const product = {
  app: {
    port: process.env.PRODUCT_APP_PORT || 8080,
  },
  db: {
    host: process.env.PRODUCT_APP_HOST || "localhost",
    port: process.env.PRODUCT_APP_PORT || 27017,
    name: process.env.PRODUCT_APP_NAME || "CodingSocial",
  }, 
};

const config = { dev, product };
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];
