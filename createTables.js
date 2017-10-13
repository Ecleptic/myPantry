'use strict'
const promise = require('bluebird')
const pgp = require('pg-promise')({
    promiseLib: promise
})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pantry'
const client = pgp(connectionString)

/**
 * Creates the tables
 */
function createTables() {
    createFoodsTable()
    createUsersTable()
    createListsTable()
}

/**
 * Create the lists table
 */
function createListsTable() {
    client
        .any(`SELECT EXISTS (
        SELECT 1
        FROM   pg_tables
        WHERE  pg_tables.tablename = 'lists'
        );
     `)
        .then((e) => {
            console.log("Lists Table exists: " + (e[0].exists))
            if (!e[0].exists) {
                client
                    .any(`CREATE TABLE "public"."lists" (
                    "username" text,
                    "foodName" text,
                    "qty/weight" text,
                    "isChecked" BOOLEAN DEFAULT FALSE
                    FOREIGN KEY ("username") REFERENCES "users"("username")
                );`)
                    .then(() => {
                        console.log('Created Lists Table')
                    })
            } else {
                console.log("Lists Table Already Exists")
            }
        })
}
/**
 * Create the users table
 */
function createUsersTable() {
    client
        .any(`SELECT EXISTS (
    SELECT 1
    FROM   pg_tables
    WHERE  pg_tables.tablename = 'users'
    );
 `)
        .then((e) => {
            console.log("Users Table exists: " + (e[0].exists))
            if (!e[0].exists) {
                client
                    .any(`CREATE TABLE "public"."users" (
                    "username" text,
                    "password" text,
                    "listName" text,
                    PRIMARY KEY ("username");
                )`)
                    .then(() => {
                        console.log('Created Users Table')
                    })
            } else {
                console.log("Users Table Already Exists")
            }
        })
}
/**
 * Create the foods table
 */
function createFoodsTable() {
    client
        .any(`SELECT EXISTS (
    SELECT 1
    FROM   pg_tables
    WHERE  pg_tables.tablename = 'foods'
    );
 `)
        .then((e) => {
            console.log("Foods Table exists: " + (e[0].exists))
            if (!e[0].exists) {
                client
                    .any(`CREATE TABLE "public"."foods" (
                    "foodName" text,
                    "category" text,
                    "type" text,
                    "expiration" date,
                    PRIMARY KEY ("foodName")
                );`)
                    .then(() => {
                        console.log('Created Foods Table')
                    })
            } else {
                console.log("Foods Table Already Exists")
            }
        })
}


// runs the script
createTables()