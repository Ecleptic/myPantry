const {
    Pool,
    Client
} = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo'
const client = new Client(connectionString)
const pool = new Pool()

const data = {
    text: "freddy",
    complete: false
}

client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('Connected to Postgres')
    }
})

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
    console.log(err ?
        err.stack :
        res.rows[0].message) // Hello World!
    client.end()
})

function listItems(res) {
    client.query(`SELECT * FROM testing ORDER BY id ASC;`, (err, res) => {
        console.log(res.rows)
        client.end()
    })
}

let name = 'Bobert'
let bool = false
let id = 11

client.query(`DELETE FROM "testing" WHERE id=(${id})`, (err) => {
    console.log(err ?
        err.stack :
        'Successful insert')
    listItems()
})

client.query(`INSERT INTO testing("text", "complete") VALUES('${name}', ${bool});`, (err, res) => {
    console.log(err ?
        err.stack :
        'Successful insert')
    console.log(res)
    // listItems(res)
    client.end()
})

client.query(`CREATE TABLE COMPANY(
    ID INT PRIMARY KEY     NOT NULL,
    NAME           TEXT    NOT NULL,
    AGE            INT     NOT NULL,
    ADDRESS        CHAR(50),
    SALARY         REAL
 );`, (err, res) => {
    console.log(err ?
        err.stack :
        'Successful insert')
    console.log(res)
    // listItems(res)
    client.end()
})