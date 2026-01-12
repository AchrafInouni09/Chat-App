const express = require ('express');
const router = express.Router ();

const {
  list_conversations_mw,
  direct_conversation_mw,
  list_messages_mw,
} = require("../middlewares/chat_middleware");

router.get ("/conversations", list_conversations_mw);
router.post ("/conversation/direct", direct_conversation_mw);
router.get ("/conversations/:id/messages", list_messages_mw);

module.exports = router;