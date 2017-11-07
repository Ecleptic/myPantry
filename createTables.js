'use strict'
const promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: promise})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pantry'
const client = pgp(connectionString)

/**
 * Creates the tables
 */
function createTables() {
    createFoodsTable().then((e) => {
        createUsersTable().then(() => {
            createListsTable().then(() => {
                client.end()
            })
        })
    })
}

/**
 * Create the lists table
 */
function createListsTable() {
    return new Promise((resolve, reject) => {
        client
            .any(`
                SELECT EXISTS (
                SELECT 1
                FROM   pg_tables
                WHERE  pg_tables.tablename = 'lists'
                );
            `)
            .then((e) => {
                console.log("Lists Table exists: " + (e[0].exists))
                if (!e[0].exists) {
                    client
                        .any(`
                            CREATE TABLE "public"."lists" (
                            "username" text,
                            "foodname" text,
                            "checked" boolean DEFAULT 'FALSE',
                            FOREIGN KEY ("username") REFERENCES "public"."users"("username"),
                            FOREIGN KEY ("foodname") REFERENCES "public"."foods"("foodname")
                            );
                        `)
                        .then(() => {
                            console.log('Created Lists Table')
                            resolve('Created Lists Table')
                        })
                } else {
                    console.log("Lists Table Already Exists")
                    resolve("Lists Table Already Exists")
                }
            })
    })
}
/**
 * Create the users table
 */
function createUsersTable() {
    return new Promise((resolve, reject) => {
        client
            .any(`
                SELECT EXISTS (
                SELECT 1
                FROM   pg_tables
                WHERE  pg_tables.tablename = 'users'
                );
            `)
            .then((e) => {
                console.log("Users Table exists: " + (e[0].exists))
                if (!e[0].exists) {
                    client
                        .any(`
                            CREATE TABLE "public"."users" (
                            "username" text,
                            "password" text,
                            PRIMARY KEY ("username")
                        );
                        `)
                        .then(() => {
                            console.log('Created Users Table')
                            resolve('Created Users Table')
                        })
                } else {
                    console.log("Users Table Already Exists")
                    resolve("Users Table Already Exists")
                }
            })
    })
}
/**
 * Create the foods table
 */
function createFoodsTable() {
    return new Promise((resolve, reject) => {

        client
            .any(`
                SELECT EXISTS (
                SELECT 1
                FROM   pg_tables
                WHERE  pg_tables.tablename = 'foods'
                );
            `)
            .then((e) => {
                console.log("Foods Table exists: " + (e[0].exists))
                if (!e[0].exists) {
                    client
                        .any(`
                            CREATE TABLE "public"."foods" (
                            "foodname" text,
                            "category" text,
                            "type" text,
                            "expiration" date,
                            "suggestedStorage" text,
                            PRIMARY KEY ("foodname")
                            );
                        `)
                        .then(() => {
                            console.log('Created Foods Table')
                            resolve('Created Foods Table')

                        })
                } else {
                    console.log("Foods Table Already Exists")
                    resolve("Foods Table Already Exists")

                }
            })
    })
}

// runs the script
createTables()