const DB_URL = process.env.NODE_ENV === "test" ? "mongodb://admin:admin123@ds347298.mlab.com:47298/guard_rails_test" : "mongodb://admin:admin123@ds347298.mlab.com:47298/guard_rails"
const PORT = process.env.PORT || 10000

module.exports = { PORT, DB_URL }