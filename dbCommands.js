'use strict'
const promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: promise})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pantry'
const client = pgp(connectionString)

const dbName = "users"
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
        client.query(`SELECT * FROM ${dbName} ORDER BY id ASC`, (err, res) => {
            console.log(res.rows)

            return (res.rows)
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
        console.log(`DELETE FROM "public"."${dbName}" WHERE "username"="${id}";`)
        return new Promise((resolve, reject) => {
            client.query(`DELETE FROM "public"."${dbName}" WHERE "username"="${id}";`, (err) => {
                console.log(err
                    ? err.stack
                    : 'Successful delete')
                    if(!err){
                        resolve("Successful Delete")
                }else{
                    reject(err)

                }
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
                return t.batch([t.one(`INSERT INTO "public"."${dbName}"("username","password") VALUES('${username}', '${password}') returning username`)])
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
