'use strict'

const dbCommands = require('./dbCommands')
const dbcommands = new dbCommands()

module.exports = class dbLink {
    connect() {
        dbcommands.connectDB()
    }

    get(req, res) {
        // TODO: Save it to localstorage or in a cache or something.
        let command = req.query.cmd

        if (command == 'list') {
            console.log('list')
            dbcommands
                .listItems()
                .then(resolve => {
                    console.log(resolve)
                    res
                        .status(200)
                        .json({status: 'success', data: resolve})
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        }

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
        let command = req.query.cmd
        let username = req.query.username
        let password = req.query.password

        if (command == 'register') {
            console.log('register')
            let register = dbcommands.insert({username: username, password: password})
            register.then(resolve => {
                if (resolve) {
                    res
                        .status(200)
                        .json({status: 'success'})
                }
            }).catch(error => {
                res
                    .status(500)
                    .json({status: 'Error', error: error})
            })
        } else if (command == 'login') {
            console.log('login')
        }

    }

    update(req, res) {
        let id = parseInt(req.query.id)
        console.log(id)
        res
            .status(200)
            .json({status: 'success'})
    }

    delete(req, res) {
        let id = (req.query.id)
        console.log("deleting in link")
        console.log("ID:", id)
        dbcommands
            .delete(id)
            .then(resolve => {
                console.log("resolve", resolve)
                if (resolve) {
                    res
                        .status(200)
                        .json({status: 'success'})
                }
            })
            .catch(error => {
                res
                    .status(500)
                    .json({status: 'Error', error: error})
            })
    }
}