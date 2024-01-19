require('dotenv').config()
global.SALT_KEY = process.env.SALT_KEY

module.exports = {
  CONNECTION_STRING: process.env.DB_CONN,
}