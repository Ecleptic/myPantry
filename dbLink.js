'use strict'

const dbCommands = require('./dbCommands')
const dbcommands = new dbCommands()

module.exports = class dbLink {
    /**
     * run command to connect to the PostgreSQL Database
     */
    connect() {
        dbcommands.connectDB()
    }

    /**
     * If the command is 'list', then send the db command of listItems()
     *      which resolves into an object listing the database
     * @param {Request} req
     * @param {Response} res
     */
    get(req, res) {
        // TODO: Save it to localstorage or in a cache or something.
        let command = req.query.cmd
        let username = req.query.username

        if (command == 'listUsers') {
            console.log('list')
            dbcommands
                .listUsers()
                .then(resolve => {
                    console.log(resolve)
                    res
                        .status(200)
                        .json({status: 'success', users: resolve})
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        }
        if (command == 'getList') {
            console.log("getting list in dbLink")
            dbcommands
                .getList({username: username})
                .then(resolve => {
                    console.log(resolve)
                    res
                        .status(200)
                        .json({status: 'Success', items: resolve})
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        }
    }

    /**
     * for now this command just creates a user need to refactor or split to something else
     * @param {Request} req
     * @param {Response} res
     */
    insert(req, res) {
        console.log("inserting")
        let command = req.query.cmd
        let username = req.query.username
        let password = req.query.password
        let newItem = req.query.item

        if (command == 'register') {
            console.log('register')
            let register = dbcommands.insert({command: 'register', username: username, password: password})
            register.then(resolve => {
                console.log(resolve)
                res
                    .status(200)
                    .json({status: 'successful register'})

            }).catch(error => {
                res
                    .status(500)
                    .json({status: 'Error', error: error})
            })
        } else if (command == 'login') {
            let login = dbcommands.getLogin({username: username, password: password})
            login.then(resolve => {
                if (resolve) {
                    res
                        .status(200)
                        .json({status: 'successful login', data: resolve.username})
                }
            }).catch(error => {
                res
                    .status(404)
                    .json({status: 'Not Exist', error: error})
            })
        } else if (command == 'addItem') {
            console.log("new Item: ", newItem)
            let addItem = dbcommands.insert({command: 'newItem', username: username, newItem: newItem})
            addItem.then(resolve => {
                console.log(resolve)
                res
                    .status(200)
                    .json({status: 'successful add'})
            }).catch(error => {
                res
                    .status(500)
                    .json({status: 'Error', error: error})
            })
        } else if (command == 'CreateItem') {
            console.log("create item")
        }

    }

    /**
     * Does nothing yet, will be to edit an entry TODO:
     * @param {Request} req
     * @param {Response} res
     */
    update(req, res) {
        let id = parseInt(req.query.id)
        console.log(id)
        res
            .status(200)
            .json({status: 'success'})
    }

    /**
     * Send the request to delete column in the database where ID is the name
     * @param {Request} req
     * @param {Response} res
     */
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