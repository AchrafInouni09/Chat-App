require ('dotenv').config ();
const http = require ('http');
const express = require('express');
const app = express();
const mysql = require ('mysql2');
// const { connect } = require('./src/routes/authRoutes');

const PORT = process.env.PORT || 3000;

const cnx = mysql.createConnection ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

console.log ('attempting to connect to mysql');

cnx.connect ((err) => 
{
    if (err)
    {
        console.error ('error connecting to mysql', err.stack);
        return;
    }
    console.log ('connected to mysql as id ' + cnx.threadId);

    cnx.query ('Select 1 + 1 as solution', (error, results, field) =>
    {
        if (error) throw Error(error);
        console.log ('solution is ', results[0].solution);
        cnx.end();
    });
})

app.get ('/', (req, res) => {
    res.json ({messsage:'chat app backend is running'});
})

app.listen (PORT, () => {
    console.log ('server is running on http://localhost:${PORT}')
})


