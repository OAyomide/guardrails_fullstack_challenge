const proxy = require("http-proxy-middleware")

module.exports = function (app) {
    app.use(proxy("/api/*", {
        target: "http://http://localhost:10000/api/"
    }))
}