const {Db} = require ('./db');


class Conversations
{
    constructor ()
    {
        this.Db = new Db ();
    }

    async isParticipant (conversationId, userId)
    {
        const query = `select 1 from  conversation_participants where conversation_id = ? 
                        and user_id = ? Limit 1`;
        const rows = await this.Db.select (query, [conversationId, userId]);
        return (rows.length > 0);
    }

    async getUserIdByUserName (username)
    {
        const query = `select id from users where username = ? limit 1`;
        const rows = await this.Db.select (query, [username]);
    }


    async getOrCreateDirectConversation (userId, otherusername)
    {
        const otherid = await this.getUserIdByUserName (otherusername);

        if (!other) throw new Error ("other User Not Found");

        if (otherid == userId) throw new Error ("cannot start a chat with yourself");

        const findConv = `
        
        select c.id from conversation c where c.type = 'direct'
        and (select count (*) from conversation_participants cp where cp.conversation_id = c.id) = 2

        and exists (select 1 from conversation_participants cp where cp.conversation_id = c.id and cp.user_id = ? )

        and exists (select 1 from conversation_participants cp where cp.conversation_id = c.id and cp.user_id = ? )

        Limit 1`;

        const found = await this.Db.select (findConv, [userId, otherid]);

        if (found.length > 0) return {id : found[0].id};

        // here we gonna create the cnv;

        const initCnv =  await this.Db.select (`insert into conversations (type) Values ('direct')`, []);
        
        if (!conversationId)
        {
            throw new Error("Insert did not return insertId. Check Db.select() implementation.");
        }
        const cnvId = initCnv.insertId;

        await this.Db.select (`insert into conversation_participants (conversation_id, user_id) 
            values (?, ?), (?, ?)`, [cnvId, userId, cnvId, otherid]);

        return {id: cnvId};
    }

    async listMyConversation (userId)
    {
        const query = `select   c.id, c.type, c.name, c.created_at   from conversations c
            join  conversation_participants cp on cp.conversation_id = c.id where cp.user_id = ?
            order by c.created_at desc`;
        return await this.Db.select (q, [userId]);
    }
}



module.exports = {Conversations};