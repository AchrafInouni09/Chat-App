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

    async register (firstname, lastname, username, email, password, role, avatar_url)
    {
        try
        {
            const query = `insert into users (first_name, last_name, username, email, password_hash, role, avatar_url) values (
             ?, ?, ?, ?, ?, ?, ?)`;
            const results = await this.Db.select (query, [firstname, lastname, username, email, password, role, avatar_url]);
            return results;
        }
        catch (err)
        {
            console.error ("Error in User.register:", err);
            throw err;
        }
    }
    async getById(id)
    {
        const q = `
          SELECT id, first_name, last_name, username, email, avatar_url, bio, role, created_at, updated_at
          FROM users
          WHERE id = ?
          LIMIT 1`;
        const rows = await this.Db.select(q, [id]);
        return rows[0] ?? null;
    }

    async isEmailExistsForOtherUser (email, myid)
    {
        const query = `select 1 from users where email = ? and id <> ? limit 1`;
        const rows = await this.Db.select (query, [email, myid]);

        return rows.length > 0;
    }

    async updateProfile(userId, payload)
    {
        const allowed = ["first_name", "last_name", "email", "avatar_url", "bio", "password"];
        const keys    = Object.keys (payload).filter ((k) => allowed.includes(k));

        if (keys.length === 0)
        {
            const err = new Error ("no updatable fields provided");
            err.status = 400;
            throw err;
        }

        if (payload.email)
        {
            const exists = await this.isEmailExistsForOtherUser (payload.email, userId);

            if (exists)
            {
                 const err = new Error("Email already in use");
                err.status = 409;
                throw err;
            }
        }

        const setParts = [];
        const params = [];

        for (const k of keys)
        {
            if (k === "password")
            {
                setParts.push(`password_hash = ?`);
                params.push(String(payload.password));
                continue;
            }

            setParts.push(`${k} = ?`);
            params.push(payload[k]);
        }
    

        const query = `update users set ${setParts.join (", ")} where id = ?`
        params.push(userId);

        const result = await this.Db.select(query, params);
        if (!result.affectedRows)
        {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }

        return await this.getById(userId);
    }

    async deleteById(userId)
    {
        const q = `DELETE FROM users WHERE id = ?`;
        const result = await this.Db.select(q, [userId]);
        return result.affectedRows > 0;
    }

    async searchUsers(searchTerm, currentUserId)
    {
        const query = `
            SELECT id, username, first_name, last_name, avatar_url, bio 
            FROM users 
            WHERE id != ? AND (username LIKE ? OR first_name LIKE ? OR last_name LIKE ?)
            LIMIT 20`;
        const term = `%${searchTerm}%`;
        return await this.Db.select(query, [currentUserId, term, term, term]);
    }

    async AddUser (firstname, lastname , username, email, role, password)
    {
        const query = `insert into users (first_name, last_name, username, email, role, password_hash) values (?,?, ?, ?, ?, ?)`;
        const results = await this.Db.select (query, [firstname, lastname, username, email, role, password]);
        return results;
    }

    async GetAllUsers ()
    {
        const query = `select id, username, email, role from users`;
        const results = await this.Db.select (query, []);
        return results;
    }

    async DeleteUser (userid)
    {
        const query = `delete from users where id = ?`;
        const results = await this.Db.select (query, [userid]);
        return results;
    }

    async UpdateUser (userid, username, email, role)
    {
        const query = `update users set username = ?, email = ?, role = ? where id = ?`;
        const results = await this.Db.select (query, [username, email, role, userid]);
        return results;
    }
    
}
module.exports  = {User};




