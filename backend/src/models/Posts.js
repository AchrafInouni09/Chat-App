const {Db} = require ('./db');


class Posts
{
    constructor ()
    {
        this.Db = new Db ();
    }


    async createPost (userId, content, visibility = 'public')
    {
        try
        {
            const query = `insert into posts (user_id, content, visibility) values (?, ?, ?)`;
            const result = await this.Db.select (query, [userId, content, visibility]);
            return result.insertId;
        }
        catch (err)
        {
            console.error ('error in post.create', err);
            throw err;
        }
    }

    async findAll(limit = 20, offset = 0)
    {
        try
        {
            const query = `
                SELECT p.*, u.username, u.avatar_url,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                    (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.visibility = 'public'
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?`;
            return await this.Db.select(query, [limit, offset]);
        }
        catch (err)
        {
            console.error("Error in Post.findAll:", err);
            throw err;
        }
    }


    async findById (postId)
    {
        try
        {
            const query = `SELECT p.*, u.username, u.avatar_url,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count
                FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`;
            const results = await this.Db.select (query, [postId]);
            return results.length > 0 ? results[0] : null;
        }
        catch (err)
        {
            console.error("Error in Post.findById:", err);
            throw err;
        }
    }

    async findByUserId(userId, limit = 20, offset = 0)
    {
        try
        {
            const query = `
                SELECT p.*, u.username, u.avatar_url,
                    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                    (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count
                FROM posts p
                JOIN users u ON p.user_id = u.id
                WHERE p.user_id = ?
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?`;
            return await this.Db.select(query, [userId, limit, offset]);
        }
        catch (err)
        {
            console.error("Error in Post.findByUserId:", err);
            throw err;
        }
    }

    async update(postId, userId, content)
    {
        try
        {
            const query = `UPDATE posts SET content = ? WHERE id = ? AND user_id = ?`;
            const result = await this.Db.select(query, [content, postId, userId]);
            return result.affectedRows > 0;
        }
        catch (err)
        {
            console.error("Error in Post.update:", err);
            throw err;
        }
    }

    async delete(postId, userId)
    {
        try
        {
            const query = `DELETE FROM posts WHERE id = ? AND user_id = ?`;
            const result = await this.Db.select(query, [postId, userId]);
            return result.affectedRows > 0;
        }
        catch (err)
        {
            console.error("Error in Post.delete:", err);
            throw err;
        }
    }

    // Like methods
    async like(postId, userId)
    {
        try
        {
            const query = `INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)`;
            await this.Db.select(query, [postId, userId]);
            return true;
        }
        catch (err)
        {
            if (err.code === 'ER_DUP_ENTRY')
            {
                return false;
            }
            console.error("Error in Post.like:", err);
            throw err;
        }
    }

    async unlike(postId, userId)
    {
        try
        {
            const query = `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`;
            const result = await this.Db.select(query, [postId, userId]);
            return result.affectedRows > 0;
        }
        catch (err)
        {
            console.error("Error in Post.unlike:", err);
            throw err;
        }
    }

    async isLikedByUser(postId, userId)
    {
        try
        {
            const query = `SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?`;
            const results = await this.Db.select(query, [postId, userId]);
            return results.length > 0;
        } 
        catch (err)
        {
            console.error("Error in Post.isLikedByUser:", err);
            throw err;
        }
    }


    // Comment methods
    async addComment(postId, userId, content)
    {
        try
        {
            const query = `INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?)`;
            const result = await this.Db.select(query, [postId, userId, content]);
            return result.insertId;
        }
        catch (err)
        {
            console.error("Error in Post.addComment:", err);
            throw err;
        }
    }

    async getComments(postId, limit = 50, offset = 0)
    {
        try
        {
            const query = `
                SELECT c.*, u.username, u.avatar_url
                FROM post_comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.post_id = ?
                ORDER BY c.created_at ASC
                LIMIT ? OFFSET ?`;
            return await this.Db.select(query, [postId, limit, offset]);
        }
        catch (err)
        {
            console.error("Error in Post.getComments:", err);
            throw err;
        }
    }

    async deleteComment(commentId, userId)
    {
        try
        {
            const query = `DELETE FROM post_comments WHERE id = ? AND user_id = ?`;
            const result = await this.Db.select(query, [commentId, userId]);
            return result.affectedRows > 0;
        }
        catch (err)
        {
            console.error("Error in Post.deleteComment:", err);
            throw err;
        }
    }
}


module.exports = {Posts};