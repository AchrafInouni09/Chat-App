const {Posts} = require ('../models/Posts');




async function get_all_posts_mw (req, res, next)
{
    try 
    {
        const { limit = 20, offset = 0 } = req.query;
        const postModel = new Posts();
        const posts = await postModel.findAll(parseInt(limit), parseInt(offset));
        res.json({ posts });
    } 
    catch (err)
    {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function create_post_mw (req, res, next)
{
    try
    {
        const {content, visibility} = req.body;

        if (!content || content.trim() === '')
        {
            return res.status (400).json ({message : 'content is required'});
        }

        const postmodel = new Posts ();
        const postid = await postmodel.createPost (req.user.id, content, visibility);
        const post  = await postmodel.findById (postid);

        res.status (201).json ({message: 'Post created', post});
    }
    catch (err)
    {
        console.error ('error creating post', err);
        res.status (500).json ({message: 'Internal server error'});
    }
}

async function get_post_mw (req, res, next)
{
    try
    {
        const postModel = new Posts();
        const post = await postModel.findById(req.params.id);
        
        if (!post)
        {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json({ post });
    }
    catch (err)
    {
        console.error('Error fetching post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function update_post_mw (req, res, next)
{
    try
    {
        const { content } = req.body;
        
        if (!content || content.trim() === '')
            {
            return res.status(400).json({ message: 'Content is required' });
        }

        const postModel = new Posts();
        const updated = await postModel.update(req.params.id, req.user.id, content);
        
        if (!updated)
            {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }
        
        res.json({ message: 'Post updated' });
    }
    catch (err)
    {
        console.error('Error updating post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function delete_post_mw (req, res, next)
{
    try
    {
        const postModel = new Posts();
        const deleted = await postModel.delete(req.params.id, req.user.id);
        
        if (!deleted)
            {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }
        
        res.json({ message: 'Post deleted' });
    } 
    catch (err)
    {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function like_post_mw (req, res, next)
{
    try
    {
        const postModel = new Posts();
        const liked = await postModel.like(req.params.id, req.user.id);
        res.json({ message: liked ? 'Post liked' : 'Already liked' });
    }
    catch (err) 
    {
        console.error('Error liking post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function unlike_post_mw (req, res, next)
{
    try 
    {
        const postModel = new Posts();
        await postModel.unlike(req.params.id, req.user.id);
        res.json({ message: 'Post unliked' });
    } 
    catch (err)
     {
        console.error('Error unliking post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getcomment_post_mw (req, res, next)
{
    try
    {
        const { limit = 50, offset = 0 } = req.query;
        const postModel = new Posts();
        const comments = await postModel.getComments(req.params.id, parseInt(limit), parseInt(offset));
        res.json({ comments });
    }
     catch (err) 
     {
        console.error('Error fetching comments:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function addcomment_post_mw (req, res, next)
{
    try 
    {
        const { content } = req.body;
        
        if (!content || content.trim() === '') 
        {
            return res.status(400).json({ message: 'Content is required' });
        }

        const postModel = new Posts();
        const commentId = await postModel.addComment(req.params.id, req.user.id, content);
        res.status(201).json({ message: 'Comment added', commentId });
    } 
    catch (err) 
    {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deletecomment_post_mw (req, res, next)
{
    try 
    {
        const postModel = new Posts();
        const deleted = await postModel.deleteComment(req.params.commentId, req.user.id);
        
        if (!deleted) 
        {
            return res.status(404).json({ message: 'Comment not found or unauthorized' });
        }
        
        res.json({ message: 'Comment deleted' });
    } 
    catch (err) 
    {
        console.error('Error deleting comment:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

async function get_my_posts_mw (req, res, next)
{
    try 
    {
        const { limit = 20, offset = 0 } = req.query;
        const postModel = new Posts();
        const posts = await postModel.findByUserId(req.user.id, parseInt(limit), parseInt(offset));
        res.json({ posts });
    } 
    catch (err)
    {
        console.error('Error fetching my posts:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {get_all_posts_mw, create_post_mw, get_post_mw,
     update_post_mw, delete_post_mw, like_post_mw, unlike_post_mw, getcomment_post_mw, addcomment_post_mw, deletecomment_post_mw, get_my_posts_mw};