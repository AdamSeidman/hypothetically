const cors = require('cors')
const path = require('path')
const express = require('express')
const config = require('../config')
const bodyParser = require('body-parser')

let app = express()
app.use(cors())

let options = {}
let jsonParser = bodyParser.json()

const PORT = config.port || 80

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`)
})

app.use(express.static(path.join(__dirname, '../../www')))

module.exports = {}
