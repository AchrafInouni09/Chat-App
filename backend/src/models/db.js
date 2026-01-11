require ('dotenv').config ();
const http = require ('http');
const express = require('express');
const app = express();
const mysql = require ('mysql2');
const { rejects } = require('assert');
const { resolve } = require('path');

const PORT = process.env.PORT || 3000;


const pool = mysql.createPool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


class Db 
{
    constructor()   {}


    select (query, params) 
    {
        return new Promise ((resolve, reject) => 
        {
            pool.query (query, params, (err, results) =>
            {
                if (err) {reject (err);}
                else {resolve (results);}
            } );
        });
    }


}


module.exports = { Db };




