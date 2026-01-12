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

  const ok = await convModel.isParticipant(conversationId, req.user.id);
  if (!ok) return res.status(403).json({ message: "not a participant" });

  const messages = await msgModel.listMessages(conversationId, 50);
  res.json({ messages });
}

module.exports = { list_conversations_mw, direct_conversation_mw, list_messages_mw };

