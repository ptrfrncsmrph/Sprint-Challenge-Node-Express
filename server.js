const express = require("express")

const projectsRouter = require("./api/projects")
const actionsRouter = require("./api/actions")

const server = express()

server.use(express.json())
server.use("/api/projects", projectsRouter)
server.use("/api/actions", actionsRouter)

server.get("/", (_req, res) => {
  res.send(`
    <h1>Hello</h1>
  `)
})

module.exports = server
