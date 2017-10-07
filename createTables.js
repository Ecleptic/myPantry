'use strict'
const promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: promise})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pantry'
const client = pgp(connectionString)


/**
     * Creates the tables
     */
function createTables() {
    let total = 0
    client
        .any(`CREATE TABLE "public"."users" (
            "username" text,
            "password" text,
            "listName" text,
            PRIMARY KEY ("username")
        )`)
        .then(() => {
            console.log('Created Users Table')
            total++
        })
    client
        .any(`CREATE TABLE "public"."foods" (
            "foodName" text,
            "category" text,
            "type" text,
            "expiration" date,
            PRIMARY KEY ("foodName")
        )`)
        .then(() => {
            console.log('Created Foods Table')
            total++
        })
    client
        .any(`CREATE TABLE "public"."lists" (
            "username" text,
            "foodName" text,
            "qty/weight" text,
            PRIMARY KEY ("username")
        )`)
        .then(() => {
            console.log('Created lists Users Table')
            total++
        })
}

// connectDB()
createTables()
// disconnectDB()