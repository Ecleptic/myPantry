'use strict'

const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')

const port = (process.env.PORT || 8080)
const dbLink = require('./dblink')
const db = new dbLink()

// Setting up CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/public')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// get the path for where the API is listening
app.use('/', router)

db.connect() //connect to Database on server startup.
app.listen(port, () => {
    console.log(`The app is running on port: ${port}`)
})

router
    .route('/api/pantry')
    .post(db.insert)
    .get(db.getAll) //or somehow db.getSingle TODO: Figure that out later
    .delete(db.delete)
    // .post(db.update)
