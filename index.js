const express = require('express')
const app = express()
const router = express.Router()

app.set('port', (process.env.PORT || 3000))

app.get('/', function (req, res) {
    res.send("<h1 style ='color:green'>Hello World!</h1>")
})

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
})
