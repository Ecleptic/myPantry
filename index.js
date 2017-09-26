const express = require('express')
const app = express()
const dbLink = require('./dblink')
// const router = express.Router()
const DbLink = new dbLink()

app.set('port', (process.env.PORT || 8080))
/**
 * sends the html to the browser on loading the page
 */
app.get('/', function (req, res) {
    res.send("<h1 style ='color:green'>Hello World!</h1>")
})

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
})

//test dbLink is working

console.log(DbLink.connectDB())