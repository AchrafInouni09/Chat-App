const {Friendships} = require ('../models/FriendsShip');

const friendmodel = new Friendships ();




async function list_friends_mw (req, res, next)
{
    try 
    {
        const userid = req.user.id;
        const friends =  await friendmodel.getFriends (userid);

        res.json ({friends});
    }
    catch (err)
    {
        res.status (500).json ({ error: err.message });
    }
}

async function send_friend_request_mw (req, res, next)
{
    try
    {
        const senderId = req.user.id;
        const { username } = req.body;

        if (!username)
        {
            return res.status (400).json ({ message: 'reciever username is required' });
        }

        await friendmodel.sendFriendRequest (senderId, username);

        res.json ({ message: 'Friend request sent' });
    }
    catch (err)
    {
        res.status (500).json ({ error: err.message });
    }
}

async function  removeFriend_mw (req, res, next)
{
    try
    {
        const userid = req.user.id;
        const { username } = req.body;

        if (!username) return res.status(400).json({ message: 'username is required' });

        await friendmodel.RemoveFriend (userid, username);

        res.json ({ message: 'Friend removed' });
    }
    catch (err)
    {
        res.status (500).json ({ error: err.message });
    }
}



async function  accept_friend_mw (req, res, next)
{
    try
    {
        const userId = req.user.id;
        const { username } = req.body;

        if (!username) return res.status(400).json({ message: 'username is required' });

        await friendmodel.acceptFriendRequest(userId, username);
        res.json({ message: 'Friend request accepted' });

    } catch (err)
    {
        res.status(400).json({ message: err.message });
    }
}


async function  list_pendingfriend_mw (req, res, next)
{
    try
    {
        const userId = req.user.id;

        const pendingrequest = await friendmodel.getPendingRequests(userId);
        res.json({pendingrequest});

    } catch (err)
    {
        res.status(400).json({ message: err.message });
    }
}

async function list_sent_requests_mw (req, res, next)
{
    try
    {
        const userId = req.user.id;
        const sentRequests = await friendmodel.getSentPendingRequests(userId);
        res.json({ sentRequests });

    } catch (err)
    {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {list_friends_mw, send_friend_request_mw, removeFriend_mw, accept_friend_mw, list_pendingfriend_mw, list_sent_requests_mw};
