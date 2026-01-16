const {Db} = require('./db');


class Friendships 
{
    constructor ()
    {
        this.Db = new Db ();
    }

    async  getFriends(userId)
    {
        const query = ` SELECT u.id, u.username, u.first_name, 
        u.last_name, u.avatar_url, u.bio from users u   join friendships f ON (u.id = f.user_id_1 OR u.id = f.user_id_2)
            where (f.user_id_1 = ? or f.user_id_2 = ?) and f.status = 'accepted' 
                                                and u.id != ?`;

        return await this.Db.select (query, [userId, userId, userId]);
    }


    async getPendingRequests (userId)
    {
        const query = ` SELECT u.id, u.username, u.first_name, 
        u.last_name, u.avatar_url, u.bio from users u
            JOIN friendships f  on  u.id = f.user_id_1 where f.user_id_2 = ? 
            and f.status = 'pending' `;

        return await this.Db.select (query, [userId]);
    }

    async getSentPendingRequests (userId)
    {
        const query = ` SELECT u.id, u.username, u.first_name, 
        u.last_name, u.avatar_url, u.bio from users u
            JOIN friendships f  on  u.id = f.user_id_2 where f.user_id_1 = ? 
            and f.status = 'pending' `;

        return await this.Db.select (query, [userId]);
    }

    async sendFriendRequest (senderId, recieverUserName)
    {
        const userQuery = `select id from users where username = ?`;

        const user = await this.Db.select (userQuery, [recieverUserName]);

        if (user.length === 0)
            throw new Error ('Receiver User not found');

        const receiverId = user[0].id;

        if (senderId === receiverId)
            throw new Error ('cannot add yourself');

        const checkQuery = `select * from friendships where 
                            (user_id_1 = ? and user_id_2 = ?) or 
                            (user_id_1 = ? and user_id_2 = ?)`;
        const existingrlt = await this.Db.select (checkQuery, [senderId, receiverId, receiverId, senderId]);
        if (existingrlt.length > 0)
        {
            const rel = existingrlt[0];
            if (rel.status === 'accepted') throw new Error ('already friends');
            if (rel.status === 'blocked') throw new Error ('cannot add blocked friend');
            if (rel.status === 'pending') 
                {
                    if (rel.user_id_1 == senderId)  throw new Error ('request already sent');
                    else throw new Error ('this user already sent you request');
                }
        }

        const insertQuery = `insert into friendships (user_id_1, user_id_2, status) values (? , ? , 'pending')`;
        return this.Db.select (insertQuery , [senderId, receiverId]);
    }

    async acceptFriendRequest (userId, requesterUserName)
    {
        const check_requester = `select id from users where username = ?`;
        const user = await this.Db.select (check_requester, [requesterUserName]);

        if (user.length === 0)
            throw new Error ('user not found');
        const requesterid = user[0].id;

        const updateQuery = `Update friendships set status = 'accepted' where 
                    user_id_1 = ? and user_id_2 = ? and status = 'pending'`;
        const affectedRows = await this.Db.select (updateQuery, [requesterid, userId]);

        if (affectedRows.length === 0) 
            throw new Error ('no pending request found');
        return affectedRows;
    }

    async RemoveFriend (userId, friendUserName)
    {
        const checkFriendquery = `select id from users where username = ?`;
        const user = await this.Db.select (checkFriendquery, [friendUserName]);

        if (user.length === 0) throw new Error ('friend not found');

        const friendid = user[0].id;

        const deletequery = `delete from friendships  
        where (user_id_1 = ? and user_id_2 = ?  )   or
         (user_id_1 = ? and user_id_2 = ?)`;

        return await this.Db.select (deletequery, [userId, friendid, friendid, userId]);   
    }

    async rejectFriendRequest (userId, requesterUserName)
    {
        const check_requester = `select id from users where username = ?`;
        const user = await this.Db.select (check_requester, [requesterUserName]);

        if (user.length === 0)
            throw new Error ('user not found');
        const requesterId = user[0].id;

        const deleteQuery = `DELETE FROM friendships WHERE user_id_1 = ? AND user_id_2 = ? AND status = 'pending'`;
        const result = await this.Db.select (deleteQuery, [requesterId, userId]);

        if (result.affectedRows === 0) 
            throw new Error ('no pending request found');
        return result;
    }
}

module.exports = {Friendships};