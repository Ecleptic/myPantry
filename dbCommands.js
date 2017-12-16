'use strict'
//looks like js jargon, i remember cameron talking about 'promises' - mike
const promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: promise})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pantry'
const client = pgp(connectionString)
const SHA256 = require("crypto-js/sha256");


//declare tables - mike
const userTable = "users"
const foodTable = "foods"
const listTable = "lists"

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

//list all entries in the users table - mike
    listUsers() {
        console.log("listing in command")
        return new Promise((resolve, reject) => {
            console.log("promising")
            client
                .any(`SELECT * FROM ${userTable}`)
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /**
     * Search to see if one tuple exists
     * @param {object} val // val contains a username and password. We have allowed for more inputs if required.
     * @returns {Promise} Resolves to the tuple from the username.
     */
    getLogin(val) {
        console.log("getting login")
        return new Promise((resolve, reject) => {
            if (val.username && val.password) {
                client
                //pull all data on user from specific username/password combo - mike
                    .any(`SELECT * FROM users where username='${val.username}' and password='${SHA256(val.password)}'`)
                    .then(data => {
                        if (data.length > 0) {
                            resolve(data)
                        } else {
                            reject('Invalid username or Password')
                        }
                    })
                    .catch(err => {
                        reject(err)
                    })
            } else {
                reject('Invalid username or Password')
            }
        })
    }
    /**
     * check if an item is in the foods table
     * @param {object} val
     */
    getItemInList(val) {
        return new Promise((resolve, reject) => {
            client
            //function to search list for specific food item? - mike
                .any(`SELECT * FROM ${foodTable} WHERE foodname = '${val.foodname}'`)
                .then(data => {
                    if (data.length > 0) {
                        resolve(200)
                    } else {
                        reject(404) //it doesn't exist
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    getList(val) {
        return new Promise((resolve, reject) => {
            client
            //pull user's list after login - mike
                .any(`SELECT * FROM ${listTable} WHERE username = '${val.username}' order by checked,foodname;`)
                .then(data => {
                    if (data.length > 0) {
                        resolve(data)
                    } else {
                        reject('Error Could Not Find List')
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    getFoodDetails(val) {
        return new Promise((resolve, reject) => {
            client
            //don't know what this is for, getting food attributes maybe? - mike
                .any(`select * from foods where foodname = '${val.foodname}';`)
                .then(data => {
                    console.log(data)
                    resolve(data)
                })
                .catch(error => {
                    console.error(error)
                    reject(error)
                })
        })
    }
    updateFoodDetails(val) {
        return new Promise((resolve, reject) => {
			//user change food attributes - mike
            console.log(`UPDATE "public"."${foodTable}" SET "category"='${val.category}', "type"='${val.type}', "expiration"='${val.expiration}', "suggestedStorage"='${val.storage}' WHERE "foodname"='${val.foodname}' RETURNING "foodname", "category", "type", "expiration", "suggestedStorage";`)
            client
                .any(`UPDATE "public"."${foodTable}" SET "category"='${val.category}', "type"='${val.type}', "expiration"='${val.expiration}', "suggestedStorage"='${val.storage}' WHERE "foodname"='${val.foodname}' RETURNING "foodname", "category", "type", "expiration", "suggestedStorage";`)
                .then(data => {
                    console.log(data)
                    resolve(data)
                })
                .catch(error => {
                    console.error(error)
                    reject(error)
                })
        })
    }

    /**
     * Deletes the row at the database dbName from id
     * otherwise log error.stack
     * @param {string} id //the username of the row where it is deleted
     * @returns {Promise} Resolves confirm a successful delete
     * TODO: user ternary operator for whether username or whatever id goes there
     */
    delete(username) {
        return new Promise((resolve, reject) => {
            client
            //delete users from database - mike
                .any(`DELETE FROM "public".${userTable} WHERE "username"='${username}'`)
                .then(data => {
                    resolve("successful Delete", data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    deleteListItem(val) {
		//delete list associated with deleted user - mike
        console.log(`DELETE FROM "public"."${listTable}" WHERE ctid IN (SELECT ctid FROM "public"."${listTable}" WHERE "username"='${val.username}' AND "foodname"='${val.item}' LIMIT 1 FOR UPDATE);`)
        return new Promise((resolve, reject) => {
            client
                .any(`DELETE FROM "public"."${listTable}" WHERE ctid IN (SELECT ctid FROM "public"."${listTable}" WHERE "username"='${val.username}' AND "foodname"='${val.item}' LIMIT 1 FOR UPDATE);`)
                .then(data => {
                    console.log(data)
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }
    /**
     * Inserts into the dabase from the object
     * @param {object} val //val contains username, password, command, and newItem
     * @returns {Promise} Resolves confirm the successful insert with the username
     */
    insert(val) {
        return new Promise((resolve, reject) => {
            let command = val.command
            let username = val.username
            let password = val.password
            let newItem = val.newItem

            if (command === 'register') {
                client
                .any(`INSERT INTO "public"."${userTable}"("username","password") VALUES('${username}', '${SHA256(password)}') returning username`)
                    .then(data => {
                        resolve("successful insert", data)
                    })
                    .catch(error => {
                        reject(error)
                    })
            } else if (command === 'newItem') {
                console.log("creating new item: ", newItem)
                client
                //user creates new item? - mike
                    .any(`INSERT INTO "public"."${listTable}" ("username", "foodname") VALUES('${username}','${newItem}') RETURNING ('username','foodname','checked');`)
                    .then(data => {
                        resolve(data)
                    })
                    .catch(error => {
                        console.error(error)
                        reject(error)
                    })
            } else if (command === 'addFood') {
                // Creating a new item in the foods table if there's any issues.
                console.log("creating new item in foods table: ", newItem)
                client
                //don't know the difference newItem and addFood, help dad. - mike
                    .any(`INSERT INTO "public"."${foodTable}" ("foodname") VALUES ('${newItem}') RETURNING "foodname", "category", "type", "expiration", "suggestedStorage";`)
                    .then(data => {
                        resolve(data)
                    })
                    .catch(error => {
                        reject(error)
                    })
            }
        })
    }
    //edit item attributes? - mike
    editItem(val) {
        return new Promise((resolve, reject) => {
            // UPDATE "public"."lists" SET "foodname"='dudethisispie!' WHERE ctid IN (SELECT
            // ctid FROM "public"."lists" WHERE "username"='Ecleptic' AND
            // "foodname"='cookie' AND "checked"=FALSE LIMIT 1 FOR UPDATE) RETURNING
            // "username", "foodname", "checked";
            console.log(`UPDATE "public"."${listTable}" SET "foodname"='${val.newItem}',"checked"=${val.checked} WHERE ctid IN (SELECT ctid FROM "public"."${listTable}" WHERE "username"='${val.username}' AND "foodname"='${val.oldItem}' LIMIT 1 FOR UPDATE) RETURNING "username", "foodname", "checked";`)
            client
                .any(`UPDATE "public"."${listTable}" SET "foodname"='${val.newItem}',"checked"=${val.checked} WHERE ctid IN (SELECT ctid FROM "public"."${listTable}" WHERE "username"='${val.username}' AND "foodname"='${val.oldItem}' LIMIT 1 FOR UPDATE) RETURNING "username", "foodname", "checked";`)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

}
