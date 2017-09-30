'use strict'
const dbCommands = require('./dbCommands')
const dbcommands = new dbCommands()

module.exports = class dbLink {
    connect() {
        dbcommands.connectDB()
    }

    getAll(req, res) {
        res
            .status(200)
            .json({status: 'success'})
    }
    getSingle(req, res) {
        let id = parseInt(req.query.id)
        console.log(id)
        res
            .status(200)
            .json({status: 'success'})
    }
    insert(req, res) {
        console.log("inserting")
        let command = (req.query.cmd)
        let username = req.query.username
        let password = req.query.password

        console.log("command", command)
        console.log("username", username)
        console.log("password", password)

        if (command == 'register') {
            console.log('register')
            dbcommands.insert({
                username: username,
                password: password
            })
            // console.log(res)
        } else if (command == 'login') {
            console.log('login')
        }

        res
            .status(200)
            .json({status: 'success'})
    }
    update(req, res) {
        let id = parseInt(req.query.id)
        console.log(id)
        res
            .status(200)
            .json({status: 'success'})
    }
    delete(req, res) {
        let id = parseInt(req.query.id)
        dbcommands
            .delete(id)
            .then((response) => {
                console.log(response)
            })
        res
            .status(200)
            .json({status: 'success'})
    }
}