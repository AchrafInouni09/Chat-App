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
        return rows[0]?.id ?? null;
    }


    async getOrCreateDirectConversation (userId, otherusername)
    {
        const otherid = await this.getUserIdByUserName (otherusername);

        if (!otherid) throw new Error ("other User Not Found");

        if (otherid == userId) throw new Error ("cannot start a chat with yourself");

        const findConv = `
        SELECT c.id FROM conversations c WHERE c.type = 'direct'
        AND (SELECT COUNT(*) FROM conversation_participants cp WHERE cp.conversation_id = c.id) = 2
        AND EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id = ?)
        AND EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id = ?)
        LIMIT 1`;

        const found = await this.Db.select (findConv, [userId, otherid]);

        if (found.length > 0) return {id : found[0].id};

        // here we gonna create the cnv;

        const initCnv =  await this.Db.select (`insert into conversations (type) Values ('direct')`, []);
        const cnvId = initCnv.insertId;
        
        if (!cnvId)
        {
            throw new Error("Insert did not return insertId. Check Db.select() implementation.");
        }

        await this.Db.select (`insert into conversation_participants (conversation_id, user_id) 
            values (?, ?), (?, ?)`, [cnvId, userId, cnvId, otherid]);

        return {id: cnvId};
    }

    async listMyConversation (userId)
    {
        const query = `
            SELECT c.id, c.type, c.created_at,
            CASE 
                WHEN c.type = 'group' THEN c.name
                ELSE (
                    SELECT u.username 
                    FROM conversation_participants cp2 
                    JOIN users u ON u.id = cp2.user_id 
                    WHERE cp2.conversation_id = c.id AND cp2.user_id != ? 
                    LIMIT 1
                )
            END as name
            FROM conversations c
            JOIN conversation_participants cp ON cp.conversation_id = c.id
            WHERE cp.user_id = ?
            ORDER BY c.created_at DESC`;
        return await this.Db.select (query, [userId, userId]);
    }


    async createGroup (name , creatorId)
    {
        const query = `insert into conversations (type, name) values ('group', ?)`;
        const res = await this.Db.select (query, [name]);
        const convId = res.insertId;

        await this.addParticipant (convId, creatorId);
        return {id: convId, name, type:'group'};
    }

    async addParticipant (convId, userId)
    {
        const query = `INSERT IGNORE INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)`;
        return await this.Db.select (query, [convId, userId]);
    }

    async getAllGroups() 
    {
        const query = `SELECT id, name, type, created_at FROM conversations WHERE type = 'group' ORDER BY created_at DESC`;
        return await this.Db.select(query, []);
    }
}



module.exports = {Conversations};