const {Db} = require ('./db');

class Messages
{
    constructor ()
    {
        this.Db = new Db ();
    }

    async listMessages (conversationId, limit = 50)
    {
        const query = `
        select  
        m.id, m.conversation_id, m.sender_id, m.content, m.created_at, 
        u.username as sender_username, u.avatar_url
        from messages m  join users u on u.id = m.sender_id where
                m.conversation_id = ? order by m.created_at desc limit ?`;
        const rows = await this.Db.select (query, [conversationId, Number (limit)]);
        return rows.reverse ();
    }

    async createMessage (conversation_id, sender_id, content)
    {
        const query = `insert into messages (conversation_id, sender_id, content) values (?, ?, ?)`;
        return await (this.Db.select (query, [conversation_id, sender_id, content]));
    }

    async getMessageById (messageid)
    {
        const query = `
        select m.id, m.conversation_id, m.sender_id, m.content, m.created_at, 
        u.username as sender_username, u.avatar_url
        from messages m join users u on u.id = m.sender_id where m.id = ? limit 1`;

        const rows = await this.Db.select (query, [messageid]);
        return rows[0] ?? null;
    }
}

module.exports = {Messages};