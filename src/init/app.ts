import { Express } from "express"
const express = require('express')
const app: Express = express()
const port = process.env.PORT ?? 8080

app.get("/status", (_req, res) =>
  res
    .status(200)
    .send(`OK!`)
);

app.listen(port, () => {
  console.log(`🔐 ds-auth listening on port ${port}`)
})