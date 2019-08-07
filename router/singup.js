const express = require('express')
const app = express()

app.use(express.urlencoded())

app.post('/', (req, res) => {
    const username = req.body.username
    res.end()
  })
  