const {Conversations} = require ("../models/Conversations");
const {Messages} = require ("../models/Messages");


const cnvModel = new Conversations ();
const msgModel = new Messages ();


async function list_conversations_mw (req, res)
{
    const conversations = await cnvModel.listMyConversation (req.user.id);
    res.json ({conversations});
}

async function direct_conversation_mw (req, res)
{
    const {username} = req.body;

    if (!username) return res.status (400).json ({message: "username is required"});

    try
    {
        const conv = await cnvModel.getOrCreateDirectConversation (req.user.id, username);
        res.json ({conversation: conv});
    }
    catch (err)
    {
        res.status (400).json({message: err.message});
    }
}

async function list_messages_mw(req, res) {
  const conversationId = Number(req.params.id);
  if (!conversationId) return res.status(400).json({ message: "invalid conversation id" });

  const ok = await cnvModel.isParticipant(conversationId, req.user.id);
  if (!ok) return res.status(403).json({ message: "not a participant" });

  const messages = await msgModel.listMessages(conversationId, 50);
  res.json({ messages });
}

async function create_group_mw (req, res)
{
    const {name} = req.body;

    if (!name) return res.status (400).json ({Message: 'group name is required'});

    try
    {
        const group = await cnvModel.createGroup (name, req.user.id);
        res.json ({group});
    }
    catch (err)
    {
        res.status (500).json ({error: err.message})
    }
}

async function list_all_groups_mw (req, res)
{
    try
    {
        const groups = await cnvModel.getAllGroups ();
        res.json ({groups: groups});
    }
    catch (err)
    {
        res.status(500).json({error: err.message}); 
    }
}

async function join_group_mw(req, res)
{
    const { id } = req.params;
    try
    {
        await cnvModel.addParticipant(id, req.user.id);
        res.json({message: "Joined successfully"});
    }
    catch(e)
    { 
        res.status(500).json({error: e.message}); 
    }
}


module.exports = { list_conversations_mw, direct_conversation_mw, list_messages_mw , 
    create_group_mw, list_all_groups_mw, join_group_mw };

