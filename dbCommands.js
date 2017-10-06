'use strict'
const promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: promise})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pantry'
const client = pgp(connectionString)

const tableName = "users"
module.exports = class DbCommands {

    /**
     * Connects to the database from the client variable above. if error, log it.
     * Will need to return error when implemented.
     */
    connectDB() {
        client.connect((err) => {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                console.log('Connected to Postgres')
            }
        })
    }
    /**
     * Disconnect from postgres database.
     */
    disconnectDB() {
        client.end((err) => {
            if (err) {
                console.error('disconnection error', err.stack)
            } else {
                console.log('disconnected from Postgres')
            }
        })
    }
    /**
     * List the items in the row of our database
     */
    listItems() {
        console.log("listing in command")
        console.log(`SELECT * FROM ${tableName}`)
        return new Promise((resolve, reject) => {
            console.log("promising")
            client
                .any(`SELECT * FROM ${tableName}`)
                .then(data => {
                    console.log("data", data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    /**
     * Deletes the row at the database dbName
     * otherwise log error.stack
     * @param {string} id
     */
    delete(id) {
        console.log("ID at: " + id)
        console.log(typeof(id))
        // console.log(`DELETE FROM "public"."${tableName}" WHERE "username"="${id}";`)
        return new Promise((resolve, reject) => {
            client
                .any(`DELETE FROM "public".${tableName} WHERE "username"='${id}'`)
                .then(data => {
                    resolve("successful Delete", data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    /**
     * Inserts into the dabase from the object
     * TODO: setup the base items depending on our tables
     * @param {object} val
     */
    // new Promise((resolve, reject) => {}

    insert(val) {
        return new Promise((resolve, reject) => {

            let username = val.username
            let password = val.password
            console.log("username, password: " + username + " " + password)
            client.tx(t => {
                return t.batch([t.one(`INSERT INTO "public"."${tableName}"("username","password") VALUES('${username}', '${password}') returning username`)])
            }).spread((user, event) => {
                // print new user id + new event id
                console.log('DATA:', user, event)
                resolve("RESOLVED!!")
            }).catch(error => {
                reject(error)
            }). finally(e => {})
        })
    }
    /**
     * creates table from input
     * @param {string} tableName the name of the table
     * TODO: @param {object}   - the different pieces of the table. maybe hard code this? IDK
     */
    createTable(tableName) {

        client.query(`CREATE TABLE ${tableName}(
        ID INT PRIMARY KEY     NOT NULL,
        NAME           TEXT    NOT NULL,
        AGE            INT     NOT NULL,
        ADDRESS        CHAR(50),
        SALARY         REAL
     )`, (err, res) => {
            console.log(err
                ? err.stack
                : 'Successful insert')
        })
    }
    /**
     * Test the connection to the database (unnecessary because of connect, but still fun)
     */
    test() {
        client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
            console.log(err
                ? err.stack
                : res.rows[0].message) // Hello World!
        })
    }

}
