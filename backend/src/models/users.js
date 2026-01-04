require ('dotenv').config ();
const mysql = require ('mysql2');
const {Db} = require ('../models/db');




class User
{
    constructor()
    {
        this.Db = new Db ();
    }

    async Find (username, password)
    {
        try
        {
            const query = `select * from users where username = ?  && password_hash= ?`;
            const results = await this.Db.select (query, [username, password]);

            if (results.length > 0)
            {
                return results[0];
            }
            return null;
        }
        catch (err)
        {
            console.error("Error in User.findByUsername:", err);
            return (false);
        }
    }

    

    async isEmailExist (email)
    {
        let isfound = false;
        try
        {
            const query = `select 1=1 from users where email = ?`;
            const results = await this.Db.select (query, [email]);

            if (results.length > 0)
            {
                isfound = true;
            }
            
        }
        catch (err)
        {
            console.error("Error in User.isEmailExist:", err);
            return (false);
        }
        return (isfound);
    }

    async isUserNameExist (username)
    {
        let isfound = false;

        try
        {
            const query = `select 1=1 from users where username = ? `;
            const results = await this.Db.select (query, [username]);

            if (results.length > 0)
            {
                isfound = true;
            }
        }
        catch (err)
        {
            console.error ("Error in User.isEmailExist:", err)
        }
        return (isfound);
    }

    async isNameExist (firstname, lastname)
    {
        let isfound = false;

        try
        {
            const query = `select 1=1 from users where first_name = ? && last_name = ?`;
            const results = await this.Db.select (query, [firstname, lastname]);

            if (results.length > 0)
            {
                isfound = true;
            }
        }
        catch (err)
        {
            console.error ("Error in User.isNameExist:", err)
        }
        return (isfound);
    }

    async register (firstname, lastname, username, email, password, role)
    {
        try
        {
            const query = `insert into users (first_name, last_name, username, email, password_hash, role) values (
             ?, ?, ?, ?, ?, ?)`;
            const results = await this.Db.select (query, [firstname, lastname, username, email, password, role]);
            return results;
        }
        catch (err)
        {
            console.error ("Error in User.register:", err);
            throw err;
        }
    }
    
}
module.exports  = {User};




