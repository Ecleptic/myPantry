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

        dbcommands.insert({name: "NameHereYo!", bool: "TRUE", id: 1})
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
        console.log("dblink delete id: ", id)
        dbcommands.delete(id)
        res
            .status(200)
            .json({status: 'success'})
    }
}