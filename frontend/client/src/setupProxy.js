const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = app => {
  app.use(createProxyMiddleware("/subscription", {target: "http://localhost:3001", ws: true}))
}