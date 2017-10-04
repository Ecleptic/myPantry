'use strict';

/*eslint-disable */

///////////////////////////////////////////////
// This is to show a complete test application;
///////////////////////////////////////////////

const promise = require('bluebird'); // or any other Promise/A+ compatible library;

const options = {
    promiseLib: promise // overriding the default (ES6 Promise);
};

const pgp = require('pg-promise')(options);
// See also: https://github.com/vitaly-t/pg-promise#initialization-options

// Database connection details;
const cn = {
    host: 'localhost', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'myDatabase',
    user: 'myUser',
    password: 'myPassword'
};
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pantry'

// You can check for all default values in:
// https://github.com/brianc/node-postgres/blob/master/lib/defaults.js

const db = pgp(connectionString); // database instance;

// NOTE: The default ES6 Promise doesn't have methods `.spread` and `.finally`,
// but they are available within Bluebird library used here as an example.

db.tx(t => {
    return t.batch([
        t.one(`INSERT INTO "public"."users"("username","password") VALUES('jacobJingle', 'password') returning username`)
    ]);
})
    .spread((user, event) => {
        // print new user id + new event id;
        console.log('DATA:', user.username, event);
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error;
    })
    .finally(() => {
        // If we do not close the connection pool when exiting the application,
        // it may take 30 seconds (poolIdleTimeout) before the process terminates,
        // waiting for the connection to expire in the pool.

        // But if you normally just kill the process, then it doesn't matter.

        pgp.end(); // For immediate app exit, shutting down all connection pools
                   // See API: http://vitaly-t.github.io/pg-promise/module-pg-promise.html#~end

        // See also:
        // https://github.com/vitaly-t/pg-promise#library-de-initialization
    });