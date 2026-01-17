
const {Db} = require ('./db');
const crypto = require ('crypto');


class ApiKeys
{
    constructor ()
    {
        this.Db = new Db ();
    }

    generateApiKey ()
    {
        const key = crypto.randomBytes (32).toString ('hex');
        const prefix = key.substring (0, 8);
        const hash = crypto.createHash ('sha256').update (key).digest ('hex');
        return {key , prefix, hash};
    }


    async create (userId, name, rateLimit = 100)
    {
        const {key, prefix, hash} = this.generateApiKey ();

        const query = `INSERT INTO api_keys (user_id, key_prefix, key_hash, name, rate_limit) VALUES (?, ?, ?, ?, ?)`;
        const result = await this.Db.select (query, [userId, prefix, hash, name, rateLimit]);

        return {
            id: result.insertId,
            key,
            prefix,
            name,
            rateLimit
        };
    }

    async findByKey(apiKey)
    {
        const hash = crypto.createHash ('sha256').update (apiKey).digest ('hex');
        const query = `SELECT ak.*, u.id as user_id, u.username, u.role
            FROM api_keys ak 
            JOIN users u ON ak.user_id = u.id 
            WHERE ak.key_hash = ?`;

        const results = await this.Db.select(query, [hash]);
        return results.length > 0 ? results[0] : null;
    }

    async listByUser(userId)
    {
        const query = `SELECT id, key_prefix, name, rate_limit, created_at FROM api_keys WHERE user_id = ?`;
        return await this.Db.select(query, [userId]);
    }

    async delete(keyId, userId)
    {
        const query = `DELETE FROM api_keys WHERE id = ? AND user_id = ?`;
        const result = await this.Db.select(query, [keyId, userId]);
        return result.affectedRows > 0;
    }

    async updateRateLimit(keyId, userId, rateLimit)
    {
        const query = `UPDATE api_keys SET rate_limit = ? WHERE id = ? AND user_id = ?`;
        const result = await this.Db.select(query, [rateLimit, keyId, userId]);
        return result.affectedRows > 0;
    }
}

module.exports = {ApiKeys};